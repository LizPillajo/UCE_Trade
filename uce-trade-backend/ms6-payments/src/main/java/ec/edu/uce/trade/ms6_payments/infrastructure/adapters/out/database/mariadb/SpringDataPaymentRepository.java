package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.database.mariadb;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SpringDataPaymentRepository extends JpaRepository<PaymentEntity, UUID> {
}