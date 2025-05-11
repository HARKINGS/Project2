package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.dto.request.CreateOrderItemRequest;
import com.harkins.startYourEngine.dto.response.OrderItemResponse;
import com.harkins.startYourEngine.entity.OrderItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    OrderItem toOrderItem(CreateOrderItemRequest request);

    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
}
