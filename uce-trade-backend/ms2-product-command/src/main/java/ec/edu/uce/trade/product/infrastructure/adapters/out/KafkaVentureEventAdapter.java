package ec.edu.uce.trade.product.infrastructure.adapters.out;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureEventPort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaVentureEventAdapter implements VentureEventPort {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    // Topic where we will post the message
    private static final String TOPIC = "venture-created-topic"; 

    public KafkaVentureEventAdapter(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publishVentureCreatedEvent(Venture venture) {
        // The student ID and the startup project are sent
        kafkaTemplate.send(TOPIC, venture.getStudentId().toString(), venture);
        System.out.println("Event sent to Kafka: Startup created -> " + venture.getTitle());
    }
}