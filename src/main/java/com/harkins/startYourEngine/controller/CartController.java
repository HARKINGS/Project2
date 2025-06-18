package com.harkins.startYourEngine.controller;

import com.harkins.startYourEngine.dto.request.CartRequest;
import com.harkins.startYourEngine.dto.response.CartResponse;
import com.harkins.startYourEngine.enums.CartItemStatus;
import com.harkins.startYourEngine.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {

    CartService cartService;

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(@RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/{cartId}/place-order")
    public ResponseEntity<CartResponse> placeOrder(@PathVariable String cartId, @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.placeOrder(cartId, request));
    }

    @PostMapping("/{cartId}/cancel-order")
    public ResponseEntity<CartResponse> cancelOrder(@PathVariable String cartId) {
        return ResponseEntity.ok(cartService.cancelOrder(cartId));
    }

    @PostMapping("/items/{cartItemId}/status")
    public ResponseEntity<CartResponse> updateCartItemStatus(
            @PathVariable String cartItemId,
            @RequestParam CartItemStatus status) {
        return ResponseEntity.ok(cartService.updateCartItemStatus(cartItemId, status));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable String cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.ok().build();
    }
}