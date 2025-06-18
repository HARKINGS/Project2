package com.harkins.startYourEngine.controller;

import com.harkins.startYourEngine.dto.response.OrderHistoryResponse;
import com.harkins.startYourEngine.service.OrderHistoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/order-history")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderHistoryController {

    OrderHistoryService orderHistoryService;

    @GetMapping
    public ResponseEntity<List<OrderHistoryResponse>> getOrderHistory() {
        return ResponseEntity.ok(orderHistoryService.getOrderHistory());
    }
}