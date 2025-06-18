package com.harkins.startYourEngine.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.harkins.startYourEngine.enums.CartItemStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    String id;
    String goodsId;
    Long price; // Thêm trường price
    String goodsName;
    Integer quantity;
    CartItemStatus status;
}