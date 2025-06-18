package com.harkins.startYourEngine.dto.request;

import com.harkins.startYourEngine.enums.PaymentMethod;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentRequestDTO {
    String cartId;
    PaymentMethod method;
}
