package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, String> {
}