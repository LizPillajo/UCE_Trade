package ec.edu.uce.trade.identity.infrastructure.adapters.output.persistence;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    private String uid;
    private String email;
    private String role;
}