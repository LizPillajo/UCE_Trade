package ec.edu.uce.trade.identity.application.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import ec.edu.uce.trade.identity.domain.model.User;
import ec.edu.uce.trade.identity.domain.ports.UserRepositoryPort; 
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepositoryPort userRepository;

    public AuthService(UserRepositoryPort userRepository) {
        this.userRepository = userRepository;
    }

    public User authenticate(String idToken) throws Exception {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        String email = decodedToken.getEmail();
        String uid = decodedToken.getUid();

        String role = (email != null && email.endsWith("@uce.edu.ec")) ? "UCE_STUDENT" : "UCE_CLIENT";

        User user = new User();
        user.setUid(uid);
        user.setEmail(email);
        user.setRole(role);
        user.setCreatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
}