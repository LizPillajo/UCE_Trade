package ec.edu.uce.trade.product.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class Venture {
    private UUID id;
    private UUID studentId;
    private String title;
    private String description;
    private BigDecimal price;
    private String status; 
    private LocalDateTime createdAt;
    
    // El constructor y getters/setters los generaremos luego
}
