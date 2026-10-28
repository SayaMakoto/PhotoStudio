package com.photostudio.controller;

import com.photostudio.config.VNPayConfig;
import com.photostudio.dto.payments.VNPayPaymentRequest;
import com.photostudio.dto.payments.VNPayPaymentResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.model.payments.Payment;
import com.photostudio.model.payments.PaymentMethod;
import com.photostudio.model.payments.PaymentStatus;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/payments/vnpay")
public class VNPayController {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public VNPayController(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @PostMapping("/create-payment")
    public ResponseEntity<VNPayPaymentResponse> createPayment(
            @RequestBody VNPayPaymentRequest request,
            HttpServletRequest httpServletRequest) throws UnsupportedEncodingException {

        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new IllegalArgumentException("Số tiền thanh toán phải lớn hơn 0");
        }

        Long bookingId = request.getBookingId() != null ? request.getBookingId() : 1L;
        long amountInCents = Math.round(request.getAmount() * 100);

        String vnp_TxnRef = "BK" + bookingId + "_" + System.currentTimeMillis();
        String vnp_IpAddr = httpServletRequest.getRemoteAddr();
        if (vnp_IpAddr == null || vnp_IpAddr.isBlank() || vnp_IpAddr.equals("0:0:0:0:0:0:0:1")) {
            vnp_IpAddr = "127.0.0.1";
        }

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        String vnp_CreateDate = formatter.format(cld.getTime());

        String orderInfo = request.getNote() != null && !request.getNote().isBlank()
                ? request.getNote()
                : "Thanh toan don dat lich #" + bookingId + " PhotoStudio";

        String returnUrl = request.getReturnUrl() != null && !request.getReturnUrl().isBlank()
                ? request.getReturnUrl()
                : VNPayConfig.VNP_RETURN_URL;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VNPayConfig.VNP_VERSION);
        vnp_Params.put("vnp_Command", VNPayConfig.VNP_COMMAND);
        vnp_Params.put("vnp_TmnCode", VNPayConfig.VNP_TMN_CODE);
        vnp_Params.put("vnp_Amount", String.valueOf(amountInCents));
        vnp_Params.put("vnp_CurrCode", VNPayConfig.VNP_CURR_CODE);

        if (request.getBankCode() != null && !request.getBankCode().isBlank()) {
            vnp_Params.put("vnp_BankCode", request.getBankCode());
        }

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", VNPayConfig.VNP_LOCALE);
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        // Xây dựng query string và tính hash
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.VNP_HASH_SECRET, hashData.toString());
        String paymentUrl = VNPayConfig.VNP_PAY_URL + "?" + query + "&vnp_SecureHash=" + vnp_SecureHash;

        return ResponseEntity.ok(new VNPayPaymentResponse(paymentUrl, vnp_TxnRef, request.getAmount(), "Tạo URL VNPay Sandbox thành công"));
    }

    @GetMapping("/callback")
    public ResponseEntity<Map<String, Object>> paymentCallback(@RequestParam Map<String, String> queryParams) {
        Map<String, Object> response = new HashMap<>();

        String vnp_SecureHash = queryParams.get("vnp_SecureHash");
        String vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
        String vnp_TxnRef = queryParams.get("vnp_TxnRef");
        String vnp_AmountStr = queryParams.get("vnp_Amount");

        Map<String, String> fields = new HashMap<>(queryParams);
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String calculatedHash = VNPayConfig.hashAllFields(fields);

        if (!calculatedHash.equalsIgnoreCase(vnp_SecureHash)) {
            response.put("status", "error");
            response.put("message", "Chữ ký VNPay không hợp lệ");
            return ResponseEntity.badRequest().body(response);
        }

        boolean isSuccess = "00".equals(vnp_ResponseCode);
        response.put("status", isSuccess ? "success" : "failed");
        response.put("responseCode", vnp_ResponseCode);
        response.put("txnRef", vnp_TxnRef);

        if (isSuccess && vnp_TxnRef != null && vnp_TxnRef.startsWith("BK")) {
            try {
                String bookingIdStr = vnp_TxnRef.substring(2).split("_")[0];
                Long bookingId = Long.parseLong(bookingIdStr);

                Double amount = vnp_AmountStr != null ? Double.parseDouble(vnp_AmountStr) / 100 : 0.0;

                Booking booking = bookingRepository.findById(bookingId).orElse(null);
                if (booking != null) {
                    Payment payment = new Payment();
                    payment.setBooking(booking);
                    payment.setPaymentMethod(PaymentMethod.vnpay);
                    payment.setAmount(amount);
                    payment.setPaidAt(LocalDateTime.now());
                    payment.setStatus(PaymentStatus.paid);
                    payment.setNote("VNPay Sandbox #" + vnp_TxnRef);
                    paymentRepository.save(payment);

                    booking.setStatus(BookingStatus.confirmed);
                    bookingRepository.save(booking);
                }
            } catch (Exception e) {
                // Ignore parsing errors for mock references
            }
        }

        return ResponseEntity.ok(response);
    }
}
