package com.harkins.startYourEngine.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String voucherId;

    Long identifiedVoucherId;
    LocalDate expiryDate;
    // mã sử dụng có hợp lệ không
    boolean validated;

    String voucherName;
    String voucherDescription;

    // Thêm trạng thái đã sử dụng
    boolean used;

    // Thêm mã giảm giá
    String discountCode;

    // Thêm loại giảm giá (0: tiền mặt, 1: phần trăm)
    private Integer discountType;

    // Giá trị giảm giá (tiền mặt hoặc phần trăm)
    private Long discountValue;

    public Long getDiscountAmount() {
        if (used || !validated || expiryDate.isBefore(LocalDate.now())) {
            return 0L;
        }
        return discountType == 0 ? discountValue : (totalPrice != null ? (totalPrice * discountValue / 100) : 0L);
    }

    // Setter tạm thời để gán totalPrice (cần từ context)
    private Long totalPrice;

    public void setTotalPriceForDiscount(Long totalPrice) {
        this.totalPrice = totalPrice;
    }
}