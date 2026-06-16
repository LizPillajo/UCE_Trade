package ec.edu.uce.trade.product.infrastructure.adapters.in.web;

import ec.edu.uce.trade.product.application.usecases.CreateVentureUseCase;
import ec.edu.uce.trade.product.domain.model.Venture;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Base64;

@Slf4j
@RestController
@RequestMapping("/api/v1/ventures")
public class VentureController {

    private final CreateVentureUseCase createVentureUseCase;

    public VentureController(CreateVentureUseCase createVentureUseCase) {
        this.createVentureUseCase = createVentureUseCase;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createVenture(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @ModelAttribute Venture venture, 
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Security Alert: Missing or invalid authentication token."); // <-- LOG
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("The authentication token is missing or invalid.");
        }

        String token = authHeader.replace("Bearer ", "");
        try {
            String[] chunks = token.split("\\.");
            Base64.Decoder decoder = Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(payload);
            String email = node.has("email") ? node.get("email").asText() : "";

            if (!email.endsWith("@uce.edu.ec")) {
                log.warn("Security Alert: Blocked venture creation attempt from external client: {}", email); 
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied. Only UCE students can post business ventures.");
            }

            log.info("Venture creation authorized for student: {}", email); 

        } catch (Exception e) {
            log.error("Token processing error: {}", e.getMessage()); 
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error processing the security token.");
        }
        
        Venture createdVenture = createVentureUseCase.execute(venture, file);
        log.info("Venture '{}' created successfully with ID: {}", createdVenture.getTitle(), createdVenture.getId()); 
        return ResponseEntity.status(201).body(createdVenture);
    }
}