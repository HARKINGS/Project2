package com.harkins.startYourEngine.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateMomoRequest {
    String partnerCode;
    String requestType;
    String ipnUrl;
    String orderId;
    long amount;
    String orderInfo;
    String requestId;
    String redirectUrl;
    String lang;
    String extraData;
    String signature;
}
