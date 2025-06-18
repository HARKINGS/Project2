package com.harkins.startYourEngine.service;

import com.harkins.startYourEngine.dto.request.PaymentRequestDTO;
import com.harkins.startYourEngine.dto.response.PaymentResponseDTO;
import com.harkins.startYourEngine.entity.Cart;
import com.harkins.startYourEngine.entity.Payment;
import com.harkins.startYourEngine.enums.CartStatus;
import com.harkins.startYourEngine.enums.PaymentMethod;
import com.harkins.startYourEngine.repository.CartRepository;
import com.harkins.startYourEngine.repository.PaymentRepository;
import com.harkins.startYourEngine.mapper.PaymentMapper;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
public class PaymentService {

    final PaymentRepository paymentRepository;
    final CartRepository cartRepository;
    final PaymentMapper paymentMapper;
    final RestTemplate restTemplate;

    @Value("${momo.endpoint}")
    private String momoEndpoint;

    @Value("${momo.partnerCode}")
    private String momoPartnerCode;

    @Value("${momo.accessKey}")
    private String momoAccessKey;

    @Value("${momo.secretKey}")
    private String momoSecretKey;

    @Value("${momo.returnUrl}")
    private String momoReturnUrl;

    @Value("${momo.notifyUrl}")
    private String momoNotifyUrl;

    @Value("${vnpay.endpoint}")
    private String vnpayEndpoint;

    @Value("${vnpay.tmnCode}")
    private String vnpayTmnCode;

    @Value("${vnpay.hashSecret}")
    private String vnpayHashSecret;

    @Value("${vnpay.returnUrl}")
    private String vnpayReturnUrl;

    @Value("${zalopay.endpoint}")
    private String zalopayEndpoint;

    @Value("${zalopay.appId}")
    private String zalopayAppId;

    @Value("${zalopay.key1}")
    private String zalopayKey1;

    @Value("${zalopay.returnUrl}")
    private String zalopayReturnUrl;

    @Value("${mb.bank.endpoint}")
    private String mbBankEndpoint;

    @Value("${mb.accountNumber}")
    private String mbBankAccountNumber;

    // Constructor thủ công
    public PaymentService(PaymentRepository paymentRepository, CartRepository cartRepository,
                          PaymentMapper paymentMapper, RestTemplate restTemplate) {
        this.paymentRepository = paymentRepository;
        this.cartRepository = cartRepository;
        this.paymentMapper = paymentMapper;
        this.restTemplate = restTemplate;
    }

    @Transactional
    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {
        Cart cart = cartRepository.findById(request.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        double totalAmount = cart.getCartItems().stream()
                .mapToDouble(item -> item.getGoods().getPrice() * item.getQuantity())
                .sum();

        Payment payment = Payment.builder()
                .cart(cart)
                .method(request.getMethod())
                .amount(totalAmount)
                .status("PENDING")
                .build();

        String paymentUrl = "";
        if (request.getMethod() == PaymentMethod.MOMO) {
            paymentUrl = createMomoPayment(totalAmount, cart.getId());
        } else if (request.getMethod() == PaymentMethod.VNPAY) {
            paymentUrl = createVnpayPayment(totalAmount, cart.getId());
        } else if (request.getMethod() == PaymentMethod.ZALOPAY) {
            paymentUrl = createZaloPayPayment(totalAmount, cart.getId());
        } else if (request.getMethod() == PaymentMethod.MB_BANK) {
            paymentUrl = createMbBankPaymentInfo(totalAmount);
        } else if (request.getMethod() == PaymentMethod.COD) {
            cart.setStatus(CartStatus.PENDING);
            payment.setStatus("SUCCESS");
        }

        payment.setTransactionId(UUID.randomUUID().toString());
        if (request.getMethod() != PaymentMethod.COD && !paymentUrl.isEmpty()) {
            payment.setStatus("PENDING");
        } else if (request.getMethod() == PaymentMethod.MB_BANK) {
            payment.setStatus("MANUAL");
        }

        payment = paymentRepository.save(payment);
        cartRepository.save(cart);

        PaymentResponseDTO response = paymentMapper.toDto(payment);
        response.setPaymentUrl(paymentUrl);
        return response;
    }

    private String createMomoPayment(double amount, String cartId) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("partnerCode", momoPartnerCode);
        params.add("accessKey", momoAccessKey);
        params.add("requestId", UUID.randomUUID().toString());
        params.add("amount", String.valueOf((int) amount));
        params.add("orderId", "ORDER_" + cartId);
        params.add("orderInfo", "Thanh toan don hang " + cartId);
        params.add("returnUrl", momoReturnUrl);
        params.add("notifyUrl", momoNotifyUrl);
        params.add("extraData", "");

        // Placeholder cho signature (cần tích hợp logic HMAC-SHA256 với momoSecretKey)
        String signature = "";
        params.add("signature", signature);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        Map<String, Object> response = restTemplate.postForObject(momoEndpoint, request, Map.class);
        return response != null ? response.get("payUrl").toString() : "";
    }

    private String createVnpayPayment(double amount, String cartId) {
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnpayTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf((int) (amount * 100)));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", "TXN_" + cartId);
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang " + cartId);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_ReturnUrl", vnpayReturnUrl);
        vnpParams.put("vnp_IpAddr", "127.0.0.1");

        // Placeholder cho secureHash (cần tích hợp logic SHA256 với vnpayHashSecret)
        String secureHash = "";
        vnpParams.put("vnp_SecureHash", secureHash);

        String queryString = vnpParams.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .reduce((a, b) -> a + "&" + b)
                .orElse("");
        return vnpayEndpoint + "?" + queryString;
    }

    private String createZaloPayPayment(double amount, String cartId) {
        Map<String, String> params = new HashMap<>();
        params.put("app_id", zalopayAppId);
        params.put("app_user", "user123");
        params.put("app_time", String.valueOf(System.currentTimeMillis()));
        params.put("amount", String.valueOf((int) amount));
        params.put("app_trans_id", "ZALO_" + cartId);
        params.put("embed_data", "{}");
        params.put("item", "[]");
        params.put("description", "Thanh toan don hang " + cartId);
        params.put("callback_url", zalopayReturnUrl);

        // Placeholder cho mac (cần tích hợp logic HMAC-SHA256 với zalopayKey1)
        String mac = "";
        params.put("mac", mac);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(params, headers);

        Map<String, Object> response = restTemplate.postForObject(zalopayEndpoint, request, Map.class);
        return response != null ? response.get("order_url").toString() : "";
    }

    private String createMbBankPaymentInfo(double amount) {
        String qrUrl = mbBankEndpoint + "?account=" + mbBankAccountNumber + "&amount=" + amount;
        return "Vui lòng chuyển khoản số tiền " + amount + " VND đến tài khoản MB Bank: " + mbBankAccountNumber +
                ". Hoặc quét QR code tại: " + qrUrl;
    }
}