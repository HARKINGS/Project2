package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.Order;
import com.harkins.startYourEngine.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByTransactionId(String transactionId);

    List<Order> findByStatus(OrderStatus orderStatus);

    List<Order> findByUsername(String username);
}
