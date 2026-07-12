package ec.edu.uce.trade.ms7_billing.infrastructure.adapters.in.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import ec.edu.uce.trade.ms7_billing.application.usecases.GenerateInvoiceUseCase;
import ec.edu.uce.trade.ms7_billing.infrastructure.adapters.in.messaging.dto.PaymentEvent;
import ec.edu.uce.trade.ms7_billing.infrastructure.config.RabbitMQConfig;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component

public class RabbitMQBillingConsumer {

    private final GenerateInvoiceUseCase generateInvoiceUseCase;

    private final ObjectMapper objectMapper;

    public RabbitMQBillingConsumer(GenerateInvoiceUseCase generateInvoiceUseCase) {
        this.generateInvoiceUseCase = generateInvoiceUseCase;
        this.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    /**
     * Handles incoming payment success events from RabbitMQ.
     * Accepts raw {@link Message} to handle both cases:
     * 1. JSON object body (application/json content-type with Jackson converter).
     * 2. String-serialized JSON body sent by MS6 Outbox pattern.
     */
    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receivePaymentSuccess(Message rawMessage) {
        PaymentEvent event;
        try {
            String body = new String(rawMessage.getBody(), java.nio.charset.StandardCharsets.UTF_8);
            // Handle double-serialized JSON: if body is wrapped in quotes, unwrap it
            if (body.startsWith("\"") && body.endsWith("\"")) {
                body = objectMapper.readValue(body, String.class);
            }
            event = objectMapper.readValue(body, PaymentEvent.class);
        } catch (Exception e) {
            log.error("CRITICAL: Failed to deserialize RabbitMQ PaymentEvent message. Body: {}. Error: {}",
                    new String(rawMessage.getBody()), e.getMessage(), e);
            return; // Don't requeue to avoid poison pill loop
        }

        log.info("Received PaymentSuccess event for Venture ID: {} Amount: {}", event.getVentureId(), event.getAmount());
        log.debug("Full event payload: {}", event);
        try {
            log.info("Starting invoice generation process for event...");
            generateInvoiceUseCase.processPaymentSuccess(event.getId(), event.getVentureId(), event.getStudentId(), event.getAmount());
            log.info("Successfully completed billing process for Venture ID: {}", event.getVentureId());
        } catch (Exception e) {
            log.error("CRITICAL: Error processing billing for event: {}. Cause: {}", event, e.getMessage(), e);
        }
    }
}
