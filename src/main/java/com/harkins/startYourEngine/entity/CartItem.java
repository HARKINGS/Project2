package com.harkins.startYourEngine.entity;

import com.harkins.startYourEngine.enums.CartItemStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    Cart cart;

    @ManyToOne
    Goods goods;

    Integer quantity;
    @Enumerated(EnumType.STRING)
    CartItemStatus status;
}