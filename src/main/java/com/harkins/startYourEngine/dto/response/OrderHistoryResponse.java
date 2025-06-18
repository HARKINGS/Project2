package com.harkins.startYourEngine.dto.response;

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
public class OrderHistoryResponse {
    String id;
    CartStatus status;
    List<OrderHistoryItemResponse> orderHistoryItems;
    String shippingAddress;
    String paymentMethod;
    Long totalPrice;
    Long totalDiscount;
    String voucherId;
    PaymentStatus paymentStatus;
    String receiverName;
    String phoneNumber;
    String date; // Có thể thêm trường date nếu cần
}