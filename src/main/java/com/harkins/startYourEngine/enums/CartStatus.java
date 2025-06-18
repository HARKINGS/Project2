package com.harkins.startYourEngine.enums;

public enum CartStatus {
    PENDING, // Chờ xác nhận
    CONFIRMED, // Đã xác nhận
    SHIPPING, // Đang giao hàng
    DELIVERED, // Đã giao hàng
    CANCELLED, // Đã hủy
    PLACED, PROCESSING // Đang xử lý
}
