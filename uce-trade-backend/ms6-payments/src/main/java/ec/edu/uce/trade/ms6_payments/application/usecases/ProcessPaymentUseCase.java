package ec.edu.uce.trade.ms6_payments.application.usecases;

import ec.edu.uce.trade.ms6_payments.domain.model.Payment;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.PaymentEventPort;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.PaymentRepositoryPort;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.StripePort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
public class ProcessPaymentUseCase {

    private final PaymentRepositoryPort repositoryPort;
    private final StripePort stripePort;
    private final PaymentEventPort eventPort;

    public ProcessPaymentUseCase(PaymentRepositoryPort repositoryPort, StripePort stripePort, PaymentEventPort eventPort) {
        this.repositoryPort = repositoryPort;
        this.stripePort = stripePort;
        this.eventPort = eventPort;
    }

    public String createIntent(UUID ventureId, String ventureName, String studentId, BigDecimal amount) {
        log.info("Starting payment intent creation for ventureId: {} by studentId: {}", ventureId, studentId);
        
        String description = "Pay for service: " + (ventureName != null ? ventureName : "Unknown Venture");
        java.util.Map<String, String> metadata = java.util.Map.of(
            "ventureId", ventureId.toString(),
            "studentId", studentId
        );
        String clientSecret = stripePort.createPaymentIntent(amount, "USD", description, metadata);
        log.info("Successfully generated client secret for ventureId: {}", ventureId);
        
        return clientSecret;
    }

    @Transactional
    public Payment confirmPayment(UUID ventureId, String studentId, BigDecimal amount) {
        log.info("Confirming payment for ventureId: {} by studentId: {}", ventureId, studentId);
        
        Payment payment = new Payment();
        payment.setId(UUID.randomUUID());
        payment.setVentureId(ventureId);
        payment.setStudentId(studentId);
        payment.setAmount(amount);
        payment.setStatus("SUCCEEDED");
        payment.setCreatedAt(LocalDateTime.now());

        Payment savedPayment = repositoryPort.save(payment);
        log.info("Payment persisted in database with ID: {}", savedPayment.getId());
        
        eventPort.publishPaymentSuccess(savedPayment);
        log.info("Payment success event saved to Outbox");

        return savedPayment;
    }
}