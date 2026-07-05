package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.in.web;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import ec.edu.uce.trade.ms6_payments.application.usecases.ProcessPaymentUseCase;
import ec.edu.uce.trade.ms6_payments.infrastructure.config.StripeConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@Tag(name = "Payments Webhook", description = "MS6 Stripe Webhook Integration")
public class WebhookController {

    private final ProcessPaymentUseCase processPaymentUseCase;
    private final StripeConfig stripeConfig;

    public WebhookController(ProcessPaymentUseCase processPaymentUseCase, StripeConfig stripeConfig) {
        this.processPaymentUseCase = processPaymentUseCase;
        this.stripeConfig = stripeConfig;
    }

    @Operation(summary = "Stripe Webhook endpoint")
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        String webhookSecret = stripeConfig.getWebhookSecret();
        if (webhookSecret == null || webhookSecret.isEmpty()) {
            log.error("Stripe Webhook Secret is not configured.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook secret is not configured");
        }

        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Invalid signature for Stripe Webhook: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            log.error("Error parsing Stripe Webhook payload: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error parsing payload");
        }

        if ("payment_intent.succeeded".equals(event.getType())) {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            if (dataObjectDeserializer.getObject().isPresent()) {
                PaymentIntent paymentIntent = (PaymentIntent) dataObjectDeserializer.getObject().get();
                
                log.info("Payment succeeded for PaymentIntent ID: {}", paymentIntent.getId());
                
                // Assuming metadata contains ventureId and studentId that we pass during createIntent
                String ventureIdStr = paymentIntent.getMetadata().get("ventureId");
                String studentId = paymentIntent.getMetadata().get("studentId");
                
                if (ventureIdStr != null && studentId != null) {
                    try {
                        UUID ventureId = UUID.fromString(ventureIdStr);
                        // Amount is in cents, convert back to decimal
                        BigDecimal amount = BigDecimal.valueOf(paymentIntent.getAmountReceived()).divide(BigDecimal.valueOf(100));
                        processPaymentUseCase.confirmPayment(ventureId, studentId, amount);
                        log.info("Successfully processed payment for ventureId: {} and studentId: {}", ventureId, studentId);
                    } catch (Exception e) {
                        log.error("Error confirming payment from webhook: {}", e.getMessage());
                        // Return 500 to let Stripe retry
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                } else {
                    log.warn("PaymentIntent succeeded but metadata missing ventureId or studentId. PaymentIntent ID: {}", paymentIntent.getId());
                }
            }
        } else {
            log.info("Unhandled Stripe event type: {}", event.getType());
        }

        return ResponseEntity.ok("Success");
    }
}
