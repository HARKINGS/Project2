package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.dto.request.CreateOrderRequest;
import com.harkins.startYourEngine.dto.response.OrderResponse;
import com.harkins.startYourEngine.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderResponse toOrderResponse(Order order);

    Order toOrder(CreateOrderRequest orderResponse);
}
