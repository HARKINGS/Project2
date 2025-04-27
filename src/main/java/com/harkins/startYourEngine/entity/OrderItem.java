package com.harkins.startYourEngine.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "infoBuyId")
    InfoBuy infoBuy;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "goodsId")
    Goods goods;

    Integer quantity;
}
