package com.harkins.startYourEngine.service;

import com.harkins.startYourEngine.dto.response.OrderHistoryResponse;
import com.harkins.startYourEngine.entity.OrderHistory;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.mapper.OrderHistoryMapper;
import com.harkins.startYourEngine.repository.OrderHistoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrderHistoryService {

    OrderHistoryRepository orderHistoryRepository;
    OrderHistoryMapper orderHistoryMapper;

    public List<OrderHistoryResponse> getOrderHistory() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Fetching order history for user: {}", username);
        List<OrderHistory> orders = orderHistoryRepository.findByUserUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_HISTORY_NOT_FOUND));
        return orders.stream()
                .map(orderHistoryMapper::toOrderHistoryResponse)
                .collect(Collectors.toList());
    }
}