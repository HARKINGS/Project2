package com.harkins.startYourEngine.dto.response;

import com.harkins.startYourEngine.enums.CartItemStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderHistoryItemResponse {
    String id;
    GoodsResponse goods;
    Integer quantity;
    CartItemStatus status;
}