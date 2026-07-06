package ec.edu.uce.trade.ms7_billing.infrastructure.adapters.out.database;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Data
public class InvoiceEntity {
    @Id
    private UUID id;
    private UUID paymentId;
    private UUID ventureId;
    private String studentId;
    private BigDecimal amount;
    private String pdfUrl;
    private LocalDateTime createdAt;
}
