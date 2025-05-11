package com.harkins.startYourEngine.dto.request;

import com.harkins.startYourEngine.validator.DobConstraint;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {
    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;

    String firstName;
    String lastName;

    @DobConstraint(min = 18, message = "INVALID_DOB")
    LocalDate dob;

    List<String> roles;
}
