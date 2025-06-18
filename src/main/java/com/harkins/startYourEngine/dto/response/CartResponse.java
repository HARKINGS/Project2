package com.harkins.startYourEngine.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.harkins.startYourEngine.enums.CartStatus;
import com.harkins.startYourEngine.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
    String id;
    CartStatus status;
    List<CartItemResponse> cartItems;
    String shippingAddress;
    String paymentMethod;
    Long totalPrice;
    Long totalDiscount;
    String voucherId;
    PaymentStatus paymentStatus;
    String receiverName;
    String phoneNumber;
}