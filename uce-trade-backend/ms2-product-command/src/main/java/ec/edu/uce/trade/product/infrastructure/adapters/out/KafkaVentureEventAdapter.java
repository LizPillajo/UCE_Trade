package ec.edu.uce.trade.product.infrastructure.adapters.out;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureEventPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KafkaVentureEventAdapter implements VentureEventPort {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String CREATED_TOPIC = "venture-created-topic";
    private static final String UPDATED_TOPIC = "venture-updated-topic";
    private static final String DELETED_TOPIC = "venture-deleted-topic";

    public KafkaVentureEventAdapter(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publishVentureCreatedEvent(Venture venture) {
        kafkaTemplate.send(CREATED_TOPIC, venture.getStudentId(), venture);
        log.info("Event sent to Kafka: Venture created -> {}", venture.getTitle());
    }

    @Override
    public void publishVentureUpdatedEvent(Venture venture) {
        kafkaTemplate.send(UPDATED_TOPIC, venture.getStudentId(), venture);
        log.info("Event sent to Kafka: Venture updated -> {}", venture.getTitle());
    }

    @Override
    public void publishVentureDeletedEvent(String ventureId) {
        kafkaTemplate.send(DELETED_TOPIC, ventureId, ventureId);
        log.info("Event sent to Kafka: Venture deleted -> {}", ventureId);
    }
}