package com.harkins.startYourEngine.controller;

import com.harkins.startYourEngine.dto.request.CartRequest;
import com.harkins.startYourEngine.dto.response.CreateMomoResponse;
import com.harkins.startYourEngine.service.MomoService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@RequestMapping("/momo")
@Slf4j
public class MomoController {

    MomoService momoService;

    @PostMapping("/create")
    public CreateMomoResponse createMomoQr(@RequestBody CartRequest cartRequest, @RequestParam String cartId) {
        log.info("Tạo mã QR MoMo cho giỏ hàng: {}", cartId);
        return momoService.createQr(cartRequest, cartId);
    }

    @PostMapping("/ipn-handler")
    public String handleIpn(@RequestBody CreateMomoResponse response, @RequestParam String cartId) {
        momoService.handleIpn(response, cartId);
        return response.getResultCode() == 0 ? "SUCCESS" : "FAILED";
    }

    @PostMapping("/return")
    public String handleReturn(@RequestBody CreateMomoResponse response) {
        log.info("Nhận phản hồi từ MoMo: resultCode={}, message={}, orderId={}",
                response.getResultCode(), response.getMessage(), response.getOrderId());
        return response.getResultCode() == 0 ? "Payment successful!" : "Payment failed: " + response.getMessage();
    }
}