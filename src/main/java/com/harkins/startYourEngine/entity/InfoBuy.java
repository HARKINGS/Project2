package com.harkins.startYourEngine.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class InfoBuy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long infoBuyId;

    @OneToMany(mappedBy = "infoBuy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<OrderItem> orderItems;

    @ManyToOne
    @JoinColumn(name = "voucherId")
    Voucher voucher;

    @OneToOne
    @JoinColumn(name = "userId")
    User user;

    @OneToOne
    @JoinColumn(name = "addressId")
    Address address;

    Double totalPrice;
    Double totalDiscount;
}
