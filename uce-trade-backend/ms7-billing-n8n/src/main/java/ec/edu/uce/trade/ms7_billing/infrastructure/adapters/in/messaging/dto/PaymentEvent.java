package ec.edu.uce.trade.ms7_billing.infrastructure.adapters.in.messaging.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PaymentEvent {
    private UUID id;
    private UUID ventureId;
    private String studentId;
    private BigDecimal amount;
    private String status;
}
