package ec.edu.uce.trade.identity.application.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import ec.edu.uce.trade.identity.domain.model.User;
import ec.edu.uce.trade.identity.domain.ports.UserRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
public class AuthService {
    private final UserRepositoryPort userRepository;

    public AuthService(UserRepositoryPort userRepository) {
        this.userRepository = userRepository;
    }

    public User authenticate(String idToken) throws Exception {
        log.info("Starting Firebase token validation...");
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        String uid = decodedToken.getUid();
        
        // ✅ FIX: Validate UID is not null or empty
        if (uid == null || uid.trim().isEmpty()) {
            log.error("Authentication failed: Firebase token contains null or empty UID");
            throw new RuntimeException("Invalid authentication token: UID is missing");
        }
        
        log.info("Authentication successful for UID: {}", uid);
        
        Optional<User> existingUser = userRepository.findById(uid);
        if (existingUser.isPresent()) {
            log.info("Existing user found in PostgreSQL: {}", existingUser.get().getEmail());
            return existingUser.get();
        }

        String email = decodedToken.getEmail();
        log.info("New user detected with email: {}", email);

        // ⚠️ Security: Block admin domain registrations
        if (email != null && email.endsWith("@admin.edu.ec")) {
            log.warn("Security Alert: Attempted registration with administrative domain: {}", email);
            throw new RuntimeException("Access denied: Administrative accounts cannot be registered through this method.");
        }

        // 👤 Assign role based on email domain
        String role = (email != null && email.endsWith("@uce.edu.ec")) ? "UCE_STUDENT" : "UCE_CLIENT";

        // 🆕 Create new user
        User newUser = new User();
        newUser.setUid(uid);
        newUser.setEmail(email);
        newUser.setRole(role);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setPhoneNumber("");
        newUser.setGithubUser("");
        newUser.setDescription("");
        newUser.setAvatarUrl("");
        newUser.setFullName("");
        newUser.setFaculty("");
        
        log.info("Creating new user with role: {}", role);
        return userRepository.save(newUser);
    }
    
    public User updateProfile(String uid, User updatedData) {
        log.info("Updating profile for UID: {}", uid);
        
        User existing = userRepository.findById(uid)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        existing.setFullName(updatedData.getFullName());
        existing.setFaculty(updatedData.getFaculty());
        existing.setPhoneNumber(updatedData.getPhoneNumber());
        existing.setGithubUser(updatedData.getGithubUser());
        existing.setDescription(updatedData.getDescription());
        existing.setAvatarUrl(updatedData.getAvatarUrl());
        
        log.info("Profile updated successfully for: {}", existing.getEmail());
        return userRepository.save(existing);
    }
    
    public User getUserProfile(String uid) {
        log.info("Fetching profile for UID: {}", uid);
        return userRepository.findById(uid)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}