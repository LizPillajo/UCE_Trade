package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.database.mariadb;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "payments")
public class PaymentEntity {
    @Id
    private UUID id;
    private UUID ventureId;
    private String studentId;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;
}