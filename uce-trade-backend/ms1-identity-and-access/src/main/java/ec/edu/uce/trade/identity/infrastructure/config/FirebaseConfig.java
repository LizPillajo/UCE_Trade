package ec.edu.uce.trade.identity.infrastructure.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class FirebaseConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);
    
    @PostConstruct
    public void init() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                ClassPathResource resource = new ClassPathResource("firebase-service-account.json");
                
                if (resource.exists()) {
                    InputStream serviceAccount = resource.getInputStream();
                    FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                    FirebaseApp.initializeApp(options);
                    logger.info("Firebase has been successfully initialized.");
                } else {
                    logger.error("MISSING CRITICAL FILE: firebase-service-account.json was not found in the resources.");
                    throw new RuntimeException("The Firebase credentials file is missing.");
                }
            }
        } catch (Exception e) {
            logger.error("Critical error during Firebase initialization: {}", e.getMessage());
            throw new RuntimeException("Firebase initialization error", e);
        }
    }
}