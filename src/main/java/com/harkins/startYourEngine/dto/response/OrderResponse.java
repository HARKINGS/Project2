package com.harkins.startYourEngine.dto.response;

import com.harkins.startYourEngine.entity.Voucher;
import com.harkins.startYourEngine.enums.OrderStatus;
import com.harkins.startYourEngine.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    String id;
    List<OrderItemResponse> orderItems;
    Voucher voucher;
    UserResponse user;
    AddressResponse address;
    OrderStatus status;
    PaymentStatus paymentStatus;
    String paymentMethod;
    Double totalPrice;
    Double totalDiscount;
    String transactionId;
}
