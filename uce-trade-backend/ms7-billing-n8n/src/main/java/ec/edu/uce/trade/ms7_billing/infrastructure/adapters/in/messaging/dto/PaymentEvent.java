package ec.edu.uce.trade.ms7_billing.infrastructure.adapters.in.messaging.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentEvent {
    private UUID id;
    private UUID ventureId;
    private String studentId;
    private BigDecimal amount;
    private String status;
}
