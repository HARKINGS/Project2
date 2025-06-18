package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.dto.response.OrderHistoryItemResponse;
import com.harkins.startYourEngine.entity.OrderHistoryItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderHistoryItemMapper {
    OrderHistoryItemResponse toOrderHistoryItemResponse(OrderHistoryItem item);
}