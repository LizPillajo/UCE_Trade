package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import ec.edu.uce.trade.ms6_payments.domain.model.Payment;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.PaymentEventPort;
import ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.database.mariadb.OutboxEventEntity;
import ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.database.mariadb.SpringDataOutboxEventRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Component
public class RabbitMQPaymentEventAdapter implements PaymentEventPort {

    private final SpringDataOutboxEventRepository outboxRepository;
    private final ObjectMapper objectMapper;

    public RabbitMQPaymentEventAdapter(SpringDataOutboxEventRepository outboxRepository) {
        this.outboxRepository = outboxRepository;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void publishPaymentSuccess(Payment payment) {
        log.debug("Preparing to save payment success event to Outbox for Payment ID: {}", payment.getId());
        
        try {
            OutboxEventEntity outboxEvent = new OutboxEventEntity();
            outboxEvent.setId(UUID.randomUUID());
            outboxEvent.setAggregateType("Payment");
            outboxEvent.setAggregateId(payment.getId().toString());
            outboxEvent.setType("payment.success");
            outboxEvent.setPayload(objectMapper.writeValueAsString(payment));
            outboxEvent.setStatus("PENDING");
            outboxEvent.setCreatedAt(LocalDateTime.now());
            
            outboxRepository.save(outboxEvent);
            log.info("Event successfully saved to Outbox table for Payment ID: {}", payment.getId());
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize payment event for outbox", e);
            throw new RuntimeException("Could not serialize outbox event", e);
        }
    }
}