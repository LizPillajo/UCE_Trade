package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.in.scheduler;

import ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.database.mariadb.OutboxEventEntity;
import ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.database.mariadb.SpringDataOutboxEventRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
public class OutboxScheduler {

    private final SpringDataOutboxEventRepository outboxRepository;
    private final RabbitTemplate rabbitTemplate;
    
    public static final String EXCHANGE_NAME = "payments-exchange";

    public OutboxScheduler(SpringDataOutboxEventRepository outboxRepository, RabbitTemplate rabbitTemplate) {
        this.outboxRepository = outboxRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void processOutboxEvents() {
        List<OutboxEventEntity> pendingEvents = outboxRepository.findByStatus("PENDING");
        
        for (OutboxEventEntity event : pendingEvents) {
            try {
                log.info("Publishing outbox event: {} to exchange: {}", event.getId(), EXCHANGE_NAME);
                
                // Publish to RabbitMQ using event type as routing key
                rabbitTemplate.convertAndSend(EXCHANGE_NAME, event.getType(), event.getPayload());
                
                // Mark as processed
                event.setStatus("PROCESSED");
                outboxRepository.save(event);
                
                log.info("Successfully processed outbox event: {}", event.getId());
            } catch (Exception e) {
                log.error("Failed to process outbox event: {}", event.getId(), e);
            }
        }
    }
}
