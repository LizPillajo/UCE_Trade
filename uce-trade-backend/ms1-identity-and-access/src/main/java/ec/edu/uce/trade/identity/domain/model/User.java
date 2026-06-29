package ec.edu.uce.trade.identity.domain.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private String uid;       // Firebase ID
    private String email;
    private String fullName;
    private String faculty;
    private String role;      // "UCE_STUDENT", "UCE_ADMIN", "UCE_CLIENT"
    private LocalDateTime createdAt;
    
    // New fields for profile
    private String phoneNumber;
    private String githubUser;
    private String description;
    private String avatarUrl;
}