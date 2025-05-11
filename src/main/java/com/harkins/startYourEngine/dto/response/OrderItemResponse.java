package com.harkins.startYourEngine.dto.response;

import com.harkins.startYourEngine.enums.OrderStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {
    String id;
    Long orderId;
    OrderStatus status;
    Long goodsId;
    String goodsName;
    Integer quantity;
    Long userId;
    String username;
}
