package com.harkins.startYourEngine.entity;

import java.time.LocalDate;
import java.util.Set;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "web_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String userId;

    String username;
    String password;
    String firstName;
    String lastName;
    LocalDate dob;

    @ManyToMany
//    @JoinTable(
//        name = "user_roles", // Tên bảng trung gian
//        joinColumns = @JoinColumn(name = "user_id"), // Khoá chính
//        inverseJoinColumns = @JoinColumn(name = "name") // Khoá ngoaại
//    )
    Set<Role> roles;
}
