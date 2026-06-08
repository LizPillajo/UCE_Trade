package ec.edu.uce.trade.identity.domain.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private String uid;       // ID de Firebase
    private String email;
    private String fullName;
    private String faculty;
    private String role;      // "UCE_STUDENT", "UCE_ADMIN", "UCE_CLIENT"
    private LocalDateTime createdAt;
}