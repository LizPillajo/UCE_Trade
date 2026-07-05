package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.database.mariadb;

import ec.edu.uce.trade.ms6_payments.domain.model.Payment;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.PaymentRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class PaymentDatabaseAdapter implements PaymentRepositoryPort {

    private final SpringDataPaymentRepository repository;

    public PaymentDatabaseAdapter(SpringDataPaymentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Payment save(Payment payment) {
        log.debug("Saving payment to database for venture ID: {}", payment.getVentureId());
        PaymentEntity entity = new PaymentEntity();
        entity.setId(payment.getId());
        entity.setVentureId(payment.getVentureId());
        entity.setStudentId(payment.getStudentId());
        entity.setAmount(payment.getAmount());
        entity.setStatus(payment.getStatus());
        entity.setCreatedAt(payment.getCreatedAt());

        PaymentEntity saved = repository.save(entity);
        payment.setId(saved.getId()); 
        return payment;
    }
}