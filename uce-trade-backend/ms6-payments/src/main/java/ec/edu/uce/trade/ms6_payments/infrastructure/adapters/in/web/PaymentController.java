package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.in.web;

import ec.edu.uce.trade.ms6_payments.application.usecases.ProcessPaymentUseCase;
import ec.edu.uce.trade.ms6_payments.domain.model.Payment;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@Tag(name = "Payments", description = "MS6 Stripe Payment Integration")
public class PaymentController {

    private final ProcessPaymentUseCase processPaymentUseCase;

    public PaymentController(ProcessPaymentUseCase processPaymentUseCase) {
        this.processPaymentUseCase = processPaymentUseCase;
    }

    @Operation(summary = "Create Stripe Payment Intent")
    @PostMapping("/create-intent")
    public ResponseEntity<?> createPaymentIntent(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @CookieValue(value = "access_token", required = false) String cookieToken,
            @RequestBody Map<String, String> request) {

        String studentId = extractStudentId(authHeader, cookieToken);
        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
        }

        String ventureId = request.get("ventureId");
        String ventureName = request.get("ventureName");
        
        // Use the passed amount or default to a fallback if null (for safety)
        String amountStr = request.get("amount");
        BigDecimal amount = (amountStr != null && !amountStr.isEmpty()) ? new BigDecimal(amountStr) : new BigDecimal("0.00");

        try {
            String clientSecret = processPaymentUseCase.createIntent(UUID.fromString(ventureId), ventureName, studentId, amount);
            return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
        } catch (Exception e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @Operation(summary = "Confirm Payment and Dispatch Event")
    @PostMapping("/confirm/{ventureId}")
    public ResponseEntity<?> confirmPayment(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @CookieValue(value = "access_token", required = false) String cookieToken,
            @PathVariable UUID ventureId,
            @RequestBody(required = false) Map<String, String> request) {

        String studentId = extractStudentId(authHeader, cookieToken);
        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
        }

        String amountStr = (request != null && request.get("amount") != null) ? request.get("amount") : "0.00";
        BigDecimal amount = new BigDecimal(amountStr);

        try {
            Payment confirmedPayment = processPaymentUseCase.confirmPayment(ventureId, studentId, amount);
            return ResponseEntity.ok(confirmedPayment);
        } catch (Exception e) {
            log.error("Error confirming payment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    private String extractStudentId(String authHeader, String cookieToken) {
        String token = (authHeader != null && authHeader.startsWith("Bearer ")) 
                       ? authHeader.replace("Bearer ", "") 
                       : cookieToken;
        if (token == null || token.isEmpty()) return null;

        try {
            String[] chunks = token.split("\\.");
            Base64.Decoder decoder = Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));
            JsonNode node = new ObjectMapper().readTree(payload);

            // JWT Extraction logic strictly using user_id or sub
            String uid = node.has("user_id") ? node.get("user_id").asText() : "";
            if (uid.isEmpty() && node.has("sub")) {
                uid = node.get("sub").asText();
            }
            return uid.isEmpty() ? null : uid;
        } catch (Exception e) {
            log.error("Token processing error: {}", e.getMessage());
            return null;
        }
    }
}