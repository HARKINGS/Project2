package com.harkins.startYourEngine.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateMomoResponse {
    String partnerCode;
    String orderId;
    String requestId;
    long amount;
    long responseTime;
    String message;
    int resultCode;
    String payUrl;
    String deepLink;
    String qrCodeUrl;
}
