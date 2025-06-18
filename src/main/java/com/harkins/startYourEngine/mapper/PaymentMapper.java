package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.dto.response.PaymentResponseDTO;
import com.harkins.startYourEngine.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "id", source = "cart.id")
    PaymentResponseDTO toDto(Payment payment);
}