package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.database.mariadb;

import ec.edu.uce.trade.ms6_payments.domain.model.Payment;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.PaymentRepositoryPort;
import org.springframework.stereotype.Component;

@Component
public class PaymentDatabaseAdapter implements PaymentRepositoryPort {

    private final SpringDataPaymentRepository repository;

    public PaymentDatabaseAdapter(SpringDataPaymentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Payment save(Payment payment) {
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