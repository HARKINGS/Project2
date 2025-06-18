package com.harkins.startYourEngine.entity;

import com.harkins.startYourEngine.enums.CartStatus;
import com.harkins.startYourEngine.enums.PaymentMethod;
import com.harkins.startYourEngine.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Enumerated(EnumType.STRING)
    CartStatus status;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    List<CartItem> cartItems = new ArrayList<>(); // Khởi tạo để tránh null

    String shippingAddress;

    @Enumerated(EnumType.STRING)
    PaymentMethod paymentMethod;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    Voucher voucher;

    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus;

    Long totalPrice;

    Long totalDiscount;

    String receiverName;

    String phoneNumber;
}