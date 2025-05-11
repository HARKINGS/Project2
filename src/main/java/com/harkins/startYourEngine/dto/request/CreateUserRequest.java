package com.harkins.startYourEngine.dto.request;

import com.harkins.startYourEngine.validator.DobConstraint;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateUserRequest {
    @Size(min = 6, message = "INVALID_USERNAME")
    String username;

    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;

    String firstName;
    String lastName;
    @DobConstraint(min = 16, message = "INVALID_DOB")
    LocalDate dob;
}
