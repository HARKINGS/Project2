package com.harkins.startYourEngine.controller;

import com.harkins.startYourEngine.dto.request.PaymentRequestDTO;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.PaymentResponseDTO;
import com.harkins.startYourEngine.service.PaymentService;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Builder
@RequestMapping("/payment")
public class PaymentController {
    PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> processPayment(@RequestBody PaymentRequestDTO request) {
        try {
            PaymentResponseDTO response = paymentService.processPayment(request);
            return ResponseEntity.ok(ApiResponse.<PaymentResponseDTO>builder()
                    .result(response)
                    .build());
        } catch (Exception e) {
            log.error("Error processing payment: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.<PaymentResponseDTO>builder()
                    .message("Payment processing failed: " + e.getMessage())
                    .build());
        }
    }
}