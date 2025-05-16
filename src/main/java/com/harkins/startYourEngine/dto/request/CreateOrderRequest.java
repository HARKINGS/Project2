package com.harkins.startYourEngine.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {
    @NotBlank(message = "NOT_EMPTY")
    List<CreateOrderItemRequest> orderItems;

    @NotBlank(message = "NOT_EMPTY")
    String shippingAddress;

    String voucherId;

    @NotBlank(message = "NOT_EMPTY")
    String paymentMethod;

    @NotBlank(message = "NOT_EMPTY")
    Double totalPrice;

    @NotBlank(message = "NOT_EMPTY")
    Double totalDiscount;
}
