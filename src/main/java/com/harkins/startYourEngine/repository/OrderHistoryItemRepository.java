package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.OrderHistoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderHistoryItemRepository extends JpaRepository<OrderHistoryItem, String> {
}