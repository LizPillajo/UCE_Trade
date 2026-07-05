package ec.edu.uce.trade.ms7_billing.domain.model;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Invoice {
    private UUID id;
    private UUID ventureId;
    private String studentId;
    private BigDecimal amount;
    private String pdfUrl;
    private LocalDateTime createdAt;
}
