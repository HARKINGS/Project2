package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.dto.request.CartRequest;
import com.harkins.startYourEngine.dto.response.CartResponse;
import com.harkins.startYourEngine.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = CartItemMapper.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CartMapper {
    @Mapping(target = "cartItems", source = "cartItems")
    @Mapping(target = "shippingAddress", source = "shippingAddress")
    @Mapping(target = "paymentMethod", source = "paymentMethod")
    Cart toCart(CartRequest request);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "cartItems", source = "cartItems")
    @Mapping(target = "shippingAddress", source = "shippingAddress")
    @Mapping(target = "paymentMethod", source = "paymentMethod")
    @Mapping(target = "totalPrice", source = "totalPrice")
    @Mapping(target = "totalDiscount", source = "totalDiscount")
    @Mapping(target = "paymentStatus", source = "paymentStatus")
    @Mapping(target = "voucherId", expression = "java(cart.getVoucher() != null ? cart.getVoucher().getVoucherId() : null)")
    @Mapping(target = "receiverName", source = "receiverName")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    CartResponse toCartResponse(Cart cart);
}