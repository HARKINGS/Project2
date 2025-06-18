package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, String> {
    Optional<Cart> findByUserUsername(String username);
}