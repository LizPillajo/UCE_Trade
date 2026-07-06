package ec.edu.uce.trade.ms6_payments.domain.model;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Payment {
    private UUID id;
    private UUID ventureId;
    private String studentId;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;
}