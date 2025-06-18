package com.harkins.startYourEngine.service;

import com.harkins.startYourEngine.controller.MomoApi;
import com.harkins.startYourEngine.dto.request.CartItemRequest;
import com.harkins.startYourEngine.dto.request.CreateMomoRequest;
import com.harkins.startYourEngine.dto.response.CreateMomoResponse;
import com.harkins.startYourEngine.dto.request.CartRequest;
import com.harkins.startYourEngine.entity.Cart;
import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.enums.PaymentMethod;
import com.harkins.startYourEngine.enums.PaymentStatus;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.repository.CartRepository;
import com.harkins.startYourEngine.repository.GoodsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MomoService {
    @Value("${momo.partnerCode}")
    private String PARTNER_CODE;

    @Value("${momo.accessKey}")
    private String ACCESS_KEY;

    @Value("${momo.secretKey}")
    private String SECRET_KEY;

    @Value("${momo.returnUrl}")
    private String RETURN_URL;

    @Value("${momo.ipnUrl}")
    private String IPN_URL;

    @Value("${momo.requestType}")
    private String REQUEST_TYPE;

    private final MomoApi momoApi;
    private final CartService cartService;
    private final CartRepository cartRepository;
    private final GoodsRepository goodsRepository;

    public CreateMomoResponse createQr(CartRequest cartRequest, String cartId) {
        long amount = calculateTotalAmount(cartRequest);
        if (amount < 1000 || amount > 50000000) {
            throw new AppException(ErrorCode.CANT_TRADE);
        }

        String orderId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toan don hang: " + orderId;
        String requestId = UUID.randomUUID().toString();
        String extraData = "Khong co khuyen mai gi het";

        String rawSignature = String.format(
                "accessKey=%s&amount=%d&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                ACCESS_KEY, amount, extraData, IPN_URL, orderId, orderInfo, PARTNER_CODE, RETURN_URL, requestId, REQUEST_TYPE);

        String signature;
        try {
            signature = signHmacSHA256(rawSignature, SECRET_KEY);
        } catch (Exception e) {
            log.error("Lỗi khi tạo chữ ký: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.MOMO_SIGNATURE_ERROR);
        }

        CreateMomoRequest createMomoRequest = CreateMomoRequest.builder()
                .amount(amount)
                .partnerCode(PARTNER_CODE)
                .requestType(REQUEST_TYPE)
                .ipnUrl(IPN_URL)
                .redirectUrl(RETURN_URL)
                .lang("vi")
                .orderId(orderId)
                .orderInfo(orderInfo)
                .extraData(extraData)
                .signature(signature)
                .requestId(requestId)
                .build();

        log.info("Gửi yêu cầu đến MoMo: {}", createMomoRequest);
        CreateMomoResponse response = momoApi.createMomoQr(createMomoRequest);
        if (response != null && response.getResultCode() == 0) {
            log.info("Tạo mã QR MoMo thành công. payUrl: {}", response.getPayUrl());
            updateCartWithMomoOrderId(cartRequest, cartId, orderId);
        } else if (response != null) {
            log.error("MoMo API thất bại: resultCode={}, message={}", response.getResultCode(), response.getMessage());
        }

        return response;
    }

    private void updateCartWithMomoOrderId(CartRequest cartRequest, String cartId, String momoOrderId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        cart.setShippingAddress(cartRequest.getShippingAddress());
        cart.setPaymentMethod(PaymentMethod.valueOf(PaymentMethod.MOMO.name()));
        cart.setReceiverName(cartRequest.getReceiverName());
        cart.setPhoneNumber(cartRequest.getPhoneNumber());
        cart.setPaymentStatus(PaymentStatus.PROCESSING);
        cartRepository.save(cart);
    }

    public void handleIpn(CreateMomoResponse response, String cartId) {
        log.info("Nhận IPN từ MoMo: resultCode={}, message={}, orderId={}",
                response.getResultCode(), response.getMessage(), response.getOrderId());
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        if (response.getResultCode() == 0) {
            log.info("Thanh toán thành công cho orderId: {}", response.getOrderId());
            cart.setPaymentStatus(PaymentStatus.PAID);
            cartRepository.save(cart);

            // Gọi placeOrder với CartRequest
            CartRequest cartRequest = CartRequest.builder()
                    .cartItems(cart.getCartItems().stream()
                            .map(item -> CartItemRequest.builder()
                                    .goodsId(item.getGoods().getGoodsId())
                                    .quantity(item.getQuantity())
                                    .build())
                            .collect(Collectors.toList()))
                    .shippingAddress(cart.getShippingAddress())
                    .paymentMethod(PaymentMethod.MOMO.name())
                    .voucherId(cart.getVoucher() != null ? cart.getVoucher().getVoucherId() : null)
                    .receiverName(cart.getReceiverName())
                    .phoneNumber(cart.getPhoneNumber())
                    .build();

            cartService.placeOrder(cartId, cartRequest);
        } else {
            log.error("Thanh toán thất bại cho orderId: {}, message: {}", response.getOrderId(), response.getMessage());
            cart.setPaymentStatus(PaymentStatus.FAILED);
            cartRepository.save(cart);
        }
    }

    private String signHmacSHA256(String data, String key) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKey);

        byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    private long calculateTotalAmount(CartRequest cartRequest) {
        long total = 0;
        if (cartRequest.getCartItems() != null) {
            for (CartItemRequest item : cartRequest.getCartItems()) {
                Goods goods = goodsRepository.findById(item.getGoodsId())
                        .orElseThrow(() -> new AppException(ErrorCode.GOODS_NOT_FOUND));
                total += goods.getPrice() * item.getQuantity();
            }
        }
        return total;
    }
}