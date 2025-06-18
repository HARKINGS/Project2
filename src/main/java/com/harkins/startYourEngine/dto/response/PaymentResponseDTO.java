package com.harkins.startYourEngine.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponseDTO {
    String id;
    String transactionId;
    String status;
    Double amount;
    String paymentUrl;
}
