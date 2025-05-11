package com.harkins.startYourEngine.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    private List<CreateOrderItemRequest> orderItems;
    private String addressId;
    private String voucherId;
    private String paymentMethod;
    private Double totalPrice;
    private Double totalDiscount;
}
