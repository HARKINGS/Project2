package com.harkins.startYourEngine.entity;

import com.harkins.startYourEngine.enums.CartStatus;
import com.harkins.startYourEngine.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "userId")
    User user;

    @OneToMany(mappedBy = "orderHistory", cascade = CascadeType.ALL)
    List<OrderHistoryItem> orderHistoryItems;

    @ManyToOne
    @JoinColumn(name = "voucherId")
    Voucher voucher;

    String shippingAddress;
    String paymentMethod;
    Long totalPrice;
    Long totalDiscount;

    @Enumerated(EnumType.STRING)
    CartStatus status;

    String receiverName;
    String phoneNumber;

    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus;

    LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
}