package com.harkins.startYourEngine.service;

import com.harkins.startYourEngine.dto.request.CartRequest;
import com.harkins.startYourEngine.dto.response.CartResponse;
import com.harkins.startYourEngine.entity.*;
import com.harkins.startYourEngine.enums.*;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.mapper.CartMapper;
import com.harkins.startYourEngine.mapper.OrderHistoryMapper;
import com.harkins.startYourEngine.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CartService {

    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    GoodsRepository goodsRepository;
    CartMapper cartMapper;
    VoucherRepository voucherRepository;
    OrderHistoryRepository orderHistoryRepository;
    OrderHistoryItemRepository orderHistoryItemRepository;
    OrderHistoryMapper orderHistoryMapper;
    UserRepository userRepository;

    // Hàm ánh xạ String sang PaymentMethod
    private PaymentMethod mapToPaymentMethod(String paymentMethodStr) {
        if (paymentMethodStr == null) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_METHOD);
        }
        switch (paymentMethodStr.toUpperCase()) {
            case "CASH ON DELIVERY":
            case "COD":
                return PaymentMethod.COD;
            case "MOMO":
                return PaymentMethod.MOMO;
            default:
                throw new AppException(ErrorCode.INVALID_PAYMENT_METHOD);
        }
    }

    @Transactional
    public CartResponse addToCart(CartRequest request) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            log.info("Adding to cart for user: {}", username);

            User user = userRepository.findByUsername(username)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setUsername(username);
                        return userRepository.save(newUser);
                    });

            Cart cart = cartRepository.findByUserUsername(username)
                    .orElseGet(() -> {
                        Cart newCart = Cart.builder()
                                .user(user)
                                .status(CartStatus.PENDING)
                                .cartItems(new ArrayList<>()) // Khởi tạo cartItems
                                .build();
                        return cartRepository.save(newCart);
                    });

            // Đảm bảo cartItems không null
            if (cart.getCartItems() == null) {
                cart.setCartItems(new ArrayList<>());
            }

            Voucher voucher = null;
            if (request.getVoucherId() != null) {
                voucher = voucherRepository.findById(request.getVoucherId())
                        .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
                if (!voucher.isValidated() || voucher.isUsed() || voucher.getExpiryDate().isBefore(LocalDate.now())) {
                    throw new AppException(ErrorCode.VOUCHER_INVALID);
                }
                log.info("Voucher applied: {}", request.getVoucherId());
            }

            List<CartItem> cartItems = request.getCartItems().stream().flatMap(itemReq -> {
                Goods goods = goodsRepository.findById(itemReq.getGoodsId())
                        .orElseThrow(() -> new AppException(ErrorCode.GOODS_NOT_FOUND));
                if (itemReq.getQuantity() > goods.getQuantity()) {
                    throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
                }

                CartItem existingItem = cart.getCartItems().stream()
                        .filter(ci -> ci.getGoods().getGoodsId().equals(itemReq.getGoodsId()))
                        .findFirst()
                        .orElse(null);

                if (existingItem != null) {
                    existingItem.setQuantity(existingItem.getQuantity() + itemReq.getQuantity());
                    return List.of(existingItem).stream();
                } else {
                    CartItem newItem = CartItem.builder()
                            .cart(cart)
                            .goods(goods)
                            .quantity(itemReq.getQuantity())
                            .status(CartItemStatus.PENDING)
                            .build();
                    return List.of(newItem).stream();
                }
            }).collect(Collectors.toList());

            cart.setCartItems(cartItems);
            cart.setShippingAddress(request.getShippingAddress());
            cart.setPaymentMethod(mapToPaymentMethod(request.getPaymentMethod())); // Chuyển đổi String sang PaymentMethod
            cart.setVoucher(voucher);
            cart.setPaymentStatus(PaymentStatus.PENDING);
            cart.setReceiverName(request.getReceiverName());
            cart.setPhoneNumber(request.getPhoneNumber());

            Long totalPrice = cartItems.stream()
                    .mapToLong(item -> item.getGoods().getPrice() * item.getQuantity())
                    .sum();
            Long totalDiscount = 0L;
            if (voucher != null) {
                voucher.setTotalPriceForDiscount(totalPrice);
                totalDiscount = voucher.getDiscountAmount();
            }
            cart.setTotalPrice(totalPrice);
            cart.setTotalDiscount(totalDiscount);

            Cart savedCart = cartRepository.save(cart);
            log.info("Cart saved successfully with ID: {}", savedCart.getId());
            return cartMapper.toCartResponse(savedCart);
        } catch (Exception e) {
            log.error("Error in addToCart: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public CartResponse placeOrder(String cartId, CartRequest request) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        if (cart.getStatus() != CartStatus.PENDING && cart.getStatus() != CartStatus.SHIPPING) {
            throw new AppException(ErrorCode.INVALID_CART_STATUS);
        }

        cart.setShippingAddress(request.getShippingAddress());
        cart.setPaymentMethod(mapToPaymentMethod(request.getPaymentMethod())); // Chuyển đổi String sang PaymentMethod
        cart.setReceiverName(request.getReceiverName());
        cart.setPhoneNumber(request.getPhoneNumber());
        Voucher voucher = null;
        if (request.getVoucherId() != null) {
            voucher = voucherRepository.findById(request.getVoucherId())
                    .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
            cart.setVoucher(voucher);
        }

        List<CartItem> updatedCartItems = request.getCartItems().stream().map(itemReq -> {
            CartItem cartItem = cart.getCartItems().stream()
                    .filter(ci -> ci.getGoods().getGoodsId().equals(itemReq.getGoodsId()))
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));
            Goods goods = cartItem.getGoods();
            if (itemReq.getQuantity() > goods.getQuantity()) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
            }
            cartItem.setQuantity(itemReq.getQuantity());
            cartItem.setStatus(CartItemStatus.PLACED);
            goods.setQuantity(goods.getQuantity() - itemReq.getQuantity());
            goodsRepository.save(goods);
            return cartItem;
        }).collect(Collectors.toList());

        cart.setCartItems(updatedCartItems);

        Long totalPrice = updatedCartItems.stream()
                .mapToLong(item -> item.getGoods().getPrice() * item.getQuantity())
                .sum();
        Long totalDiscount = 0L;
        if (voucher != null) {
            voucher.setTotalPriceForDiscount(totalPrice);
            totalDiscount = voucher.getDiscountAmount();
        }
        cart.setTotalPrice(totalPrice);
        cart.setTotalDiscount(totalDiscount);

        cart.setStatus(CartStatus.SHIPPING);
        cart.setPaymentStatus(PaymentMethod.COD == mapToPaymentMethod(request.getPaymentMethod())
                ? PaymentStatus.PENDING
                : PaymentStatus.PAID);

        OrderHistory orderHistory = OrderHistory.builder()
                .user(cart.getUser())
                .voucher(voucher)
                .shippingAddress(cart.getShippingAddress())
                .paymentMethod(cart.getPaymentMethod().toString()) // Lưu dưới dạng String nếu cần
                .totalPrice(totalPrice)
                .totalDiscount(totalDiscount)
                .status(CartStatus.SHIPPING)
                .receiverName(cart.getReceiverName())
                .phoneNumber(cart.getPhoneNumber())
                .paymentStatus(cart.getPaymentStatus())
                .build();

        List<OrderHistoryItem> orderHistoryItems = updatedCartItems.stream().map(item ->
                OrderHistoryItem.builder()
                        .orderHistory(orderHistory)
                        .goods(item.getGoods())
                        .quantity(item.getQuantity())
                        .status(CartItemStatus.PLACED)
                        .build()
        ).toList();

        orderHistory.setOrderHistoryItems(orderHistoryItems);
        orderHistoryRepository.save(orderHistory);

        Cart updatedCart = cartRepository.save(cart);
        return cartMapper.toCartResponse(updatedCart);
    }

    @Transactional
    public CartResponse cancelOrder(String cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        if (cart.getStatus() != CartStatus.PLACED && cart.getStatus() != CartStatus.SHIPPING) {
            throw new AppException(ErrorCode.INVALID_CART_STATUS);
        }

        for (CartItem item : cart.getCartItems()) {
            Goods goods = item.getGoods();
            item.setStatus(CartItemStatus.CANCELLED);
            goods.setQuantity(goods.getQuantity() + item.getQuantity());
            goodsRepository.save(goods);
        }

        cart.setStatus(CartStatus.CANCELLED);
        cart.setPaymentStatus(PaymentStatus.CANCELLED);
        Cart updatedCart = cartRepository.save(cart);
        return cartMapper.toCartResponse(updatedCart);
    }

    @Transactional
    public CartResponse updateCartItemStatus(String cartItemId, CartItemStatus status) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));
        Goods goods = cartItem.getGoods();

        if (status == CartItemStatus.DELIVERED && cartItem.getStatus() != CartItemStatus.PLACED) {
            throw new AppException(ErrorCode.INVALID_CART_ITEM_STATUS);
        }

        cartItem.setStatus(status);
        if (status == CartItemStatus.DELIVERED) {
            cartItem.getCart().setPaymentStatus(PaymentStatus.PAID);
        } else if (status == CartItemStatus.CANCELLED) {
            goods.setQuantity(goods.getQuantity() + cartItem.getQuantity());
            goodsRepository.save(goods);
        }
        cartItemRepository.save(cartItem);

        Cart cart = cartItem.getCart();
        if (cart.getCartItems().stream().allMatch(item -> item.getStatus() == CartItemStatus.DELIVERED)) {
            cart.setStatus(CartStatus.DELIVERED);
        } else if (cart.getCartItems().stream().allMatch(item -> item.getStatus() == CartItemStatus.CANCELLED)) {
            cart.setStatus(CartStatus.CANCELLED);
        }
        cartRepository.save(cart);

        return cartMapper.toCartResponse(cart);
    }

    @Transactional
    public void removeCartItem(String cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));
        if (cartItem.getStatus() == CartItemStatus.PLACED || cartItem.getStatus() == CartItemStatus.DELIVERED) {
            throw new AppException(ErrorCode.CART_ITEM_LOCKED);
        }
        cartItemRepository.delete(cartItem);
    }

    @Transactional(readOnly = true)
    public CartResponse getCart() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            log.info("Fetching cart for user: {}", username);

            if (username == null) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            Cart cart = cartRepository.findByUserUsername(username)
                    .orElseGet(() -> {
                        User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
                        Cart newCart = Cart.builder()
                                .user(user)
                                .status(CartStatus.PENDING)
                                .cartItems(new ArrayList<>()) // Khởi tạo cartItems
                                .build();
                        return cartRepository.save(newCart);
                    });
            CartResponse response = cartMapper.toCartResponse(cart);
            log.info("Cart fetched successfully for user: {}, cartId: {}", username, cart.getId());
            return response;
        } catch (Exception e) {
            log.error("Error in getCart: {}", e.getMessage(), e);
            throw e;
        }
    }
}