package com.harkins.startYourEngine.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Goods {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long goodsId;

    String goodsName;
    String goodsVersion;
    Long quantity;
    Double price;
    String goodsDescription;
    String goodsCategory;
    String goodsBrand;
    String goodsImageURL;
}
