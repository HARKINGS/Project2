package com.harkins.startYourEngine.dto.request;

import com.harkins.startYourEngine.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {
    @NotNull(message = "NOT_EMPTY")
    List<CreateOrderItemRequest> orderItems;

    @NotBlank(message = "NOT_EMPTY")
    String shippingAddress;

    @NotBlank(message = "NOT_EMPTY")
    String voucherId;

    @NotNull(message = "NOT_EMPTY")
    PaymentMethod paymentMethod;

    @NotNull(message = "NOT_EMPTY")
    Long totalPrice;

    @NonNull
    Long totalDiscount;
}
