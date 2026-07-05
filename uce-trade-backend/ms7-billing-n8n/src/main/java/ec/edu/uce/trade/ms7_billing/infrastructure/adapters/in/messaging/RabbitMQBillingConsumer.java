package ec.edu.uce.trade.ms7_billing.infrastructure.adapters.in.messaging;

import ec.edu.uce.trade.ms7_billing.application.usecases.GenerateInvoiceUseCase;
import ec.edu.uce.trade.ms7_billing.infrastructure.adapters.in.messaging.dto.PaymentEvent;
import ec.edu.uce.trade.ms7_billing.infrastructure.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RabbitMQBillingConsumer {

    private final GenerateInvoiceUseCase generateInvoiceUseCase;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receivePaymentSuccess(PaymentEvent event) {
        log.info("Received PaymentSuccess event for Venture ID: {} Amount: {}", event.getVentureId(), event.getAmount());
        try {
            generateInvoiceUseCase.processPaymentSuccess(event.getVentureId(), event.getStudentId(), event.getAmount());
        } catch (Exception e) {
            log.error("Error processing billing for event: {}", event, e);
        }
    }
}
