package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.messaging;

import ec.edu.uce.trade.ms6_payments.domain.model.Payment;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.PaymentEventPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class RabbitMQPaymentEventAdapter implements PaymentEventPort {

    private final RabbitTemplate rabbitTemplate;
    public static final String EXCHANGE_NAME = "payments-exchange";
    public static final String ROUTING_KEY = "payment.success";

    public RabbitMQPaymentEventAdapter(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void publishPaymentSuccess(Payment payment) {
        log.debug("Preparing to send payment success event for Payment ID: {}", payment.getId());
        rabbitTemplate.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, payment);
        log.info("Event successfully dispatched to RabbitMQ Exchange: {} with Routing Key: {}", EXCHANGE_NAME, ROUTING_KEY);
    }
}