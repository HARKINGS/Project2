package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory, String> {
    Optional<List<OrderHistory>> findByUserUsername(String username);
}