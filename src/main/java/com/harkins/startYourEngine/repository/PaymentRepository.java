package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, String> {
}