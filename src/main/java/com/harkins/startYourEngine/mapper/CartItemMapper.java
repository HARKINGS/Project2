package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.dto.request.CartItemRequest;
import com.harkins.startYourEngine.dto.response.CartItemResponse;
import com.harkins.startYourEngine.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    @Mapping(target = "goods.goodsId", source = "goodsId")
    CartItem toCartItem(CartItemRequest request);

    @Mapping(target = "goodsId", source = "goods.goodsId")
    @Mapping(target = "goodsName", source = "goods.goodsName")
    @Mapping(target = "price", source = "goods.price")
    CartItemResponse toCartItemResponse(CartItem cartItem);
}