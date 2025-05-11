package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {}
