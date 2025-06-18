package com.harkins.startYourEngine.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String userId;
    String username;
//    String password;
    String firstName;
    String lastName;
    String phoneNumber;
    String email;
    LocalDate dob;
    Set<RoleResponse> roles;
}
