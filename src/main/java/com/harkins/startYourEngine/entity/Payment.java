package com.harkins.startYourEngine.entity;

import com.harkins.startYourEngine.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    Cart cart;

    @Enumerated(EnumType.STRING)
    PaymentMethod method;

    String transactionId;
    Double amount;
    String status; // PENDING, SUCCESS, FAILED
}