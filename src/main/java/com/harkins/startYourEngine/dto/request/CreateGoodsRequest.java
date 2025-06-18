package com.harkins.startYourEngine.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateGoodsRequest {
    @NotBlank(message = "NOT_EMPTY")
    String goodsName;
    String goodsVersion;
    @NotNull(message = "NOT_NULL")
    Long quantity;
    @NotNull(message = "NOT_NULL")
    Long price;
    String goodsBrand;
    String goodsDescription;
    @NotBlank(message = "NOT_EMPTY")
    String goodsCategory;
    String goodsImageURL; // Tùy chọn
}