package com.harkins.startYourEngine.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartRequest {
    List<CartItemRequest> cartItems;
    String shippingAddress;
    String paymentMethod;
    String voucherId;
    String receiverName;
    String phoneNumber;
}