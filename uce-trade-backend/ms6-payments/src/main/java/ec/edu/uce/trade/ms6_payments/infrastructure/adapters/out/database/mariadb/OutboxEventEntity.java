package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.database.mariadb;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "outbox_events")
@Data
public class OutboxEventEntity {

    @Id
    private UUID id;

    private String aggregateType;
    private String aggregateId;
    private String type;
    
    @Column(columnDefinition = "TEXT")
    private String payload;
    
    private String status; // PENDING, PROCESSED

    private LocalDateTime createdAt;
}
