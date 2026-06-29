package ec.edu.uce.trade.identity.infrastructure.adapters.output.persistence;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    private String uid;
    private String email;
    private String fullName;
    private String faculty;
    private String role;
    private LocalDateTime createdAt;
    private String phoneNumber;
    private String githubUser;
    @Column(length = 500)
    private String description;
    private String avatarUrl;
}