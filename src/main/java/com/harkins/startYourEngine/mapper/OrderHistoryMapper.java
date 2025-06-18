package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.dto.request.OrderHistoryRequest;
import com.harkins.startYourEngine.dto.response.OrderHistoryResponse;
import com.harkins.startYourEngine.entity.OrderHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = OrderHistoryItemMapper.class)
public interface OrderHistoryMapper {
    @Mapping(target = "orderHistoryItems", ignore = true)
    OrderHistory toOrderHistory(OrderHistoryRequest request);

    @Mapping(target = "voucherId", expression = "java(orderHistory.getVoucher() != null ? orderHistory.getVoucher().getVoucherId() : null)")
    OrderHistoryResponse toOrderHistoryResponse(OrderHistory orderHistory);
}