package ec.edu.uce.trade.identity.application.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import ec.edu.uce.trade.identity.domain.model.User;
import ec.edu.uce.trade.identity.domain.ports.UserRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final UserRepositoryPort userRepository;

    public AuthService(UserRepositoryPort userRepository) {
        this.userRepository = userRepository;
    }

    public User authenticate(String idToken) throws Exception {
        logger.info("Starting Firebase token validation...");
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        String uid = decodedToken.getUid();
        
        Optional<User> existingUser = userRepository.findById(uid);
        if (existingUser.isPresent()) {
            logger.info("Existing user found in PostgreSQL: {}", existingUser.get().getEmail());
            return existingUser.get();
        }

        String email = decodedToken.getEmail();

        if (email != null && email.endsWith("@admin.edu.ec")) {
            logger.warn("Security Alert: Attempted registration with administrative domain: {}", email);
            throw new RuntimeException("Access denied: Administrative accounts cannot be registered through this method.");
        }

        String role = (email != null && email.endsWith("@uce.edu.ec")) ? "UCE_STUDENT" : "UCE_CLIENT";

        User newUser = new User();
        newUser.setUid(uid);
        newUser.setEmail(email);
        newUser.setRole(role);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setPhoneNumber("");
        newUser.setGithubUser("");
        newUser.setDescription("");
        newUser.setAvatarUrl("");
        
        logger.info("Adding a new user to the database. Assigned role: {}", role);
        return userRepository.save(newUser);
    }
    
    // How to Edit Your Profile - Updated with all fields
    public User updateProfile(String uid, User updatedData) {
        User existing = userRepository.findById(uid)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        // Update all fields
        existing.setFullName(updatedData.getFullName());
        existing.setFaculty(updatedData.getFaculty());
        existing.setPhoneNumber(updatedData.getPhoneNumber());
        existing.setGithubUser(updatedData.getGithubUser());
        existing.setDescription(updatedData.getDescription());
        existing.setAvatarUrl(updatedData.getAvatarUrl());
        
        return userRepository.save(existing);
    }
    
    // How to View Your Profile
    public User getUserProfile(String uid) {
        return userRepository.findById(uid)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}