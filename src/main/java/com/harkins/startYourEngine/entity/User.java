package com.harkins.startYourEngine.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Account")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String userId;

    String username;
    String password;
    String firstName;
    String lastName;
    LocalDate dob;
    String phoneNumber;
    String email;

    @ManyToMany
    Set<Role> roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<GoodsReview> goodsReviews;

}
