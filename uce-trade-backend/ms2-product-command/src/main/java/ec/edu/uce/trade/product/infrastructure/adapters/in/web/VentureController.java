package ec.edu.uce.trade.product.infrastructure.adapters.in.web;

import ec.edu.uce.trade.product.application.usecases.CreateVentureUseCase;
import ec.edu.uce.trade.product.application.usecases.DeleteVentureUseCase;
import ec.edu.uce.trade.product.application.usecases.UpdateVentureUseCase;
import ec.edu.uce.trade.product.domain.model.Venture;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Base64;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/ventures")
public class VentureController {

    private final CreateVentureUseCase createVentureUseCase;
    private final UpdateVentureUseCase updateVentureUseCase;
    private final DeleteVentureUseCase deleteVentureUseCase;

    public VentureController(CreateVentureUseCase createVentureUseCase,
                             UpdateVentureUseCase updateVentureUseCase,
                             DeleteVentureUseCase deleteVentureUseCase) {
        this.createVentureUseCase = createVentureUseCase;
        this.updateVentureUseCase = updateVentureUseCase;
        this.deleteVentureUseCase = deleteVentureUseCase;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createVenture(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @CookieValue(value = "access_token", required = false) String cookieToken,
            @ModelAttribute Venture venture,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {

        String studentId = extractStudentId(authHeader, cookieToken);
        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("The authentication token is missing or invalid.");
        }

        venture.setStudentId(studentId);
        Venture createdVenture = createVentureUseCase.execute(venture, file);
        log.info("Venture '{}' created successfully with ID: {}", createdVenture.getTitle(), createdVenture.getId());
        return ResponseEntity.status(201).body(createdVenture);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVenture(
            @PathVariable UUID id,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @CookieValue(value = "access_token", required = false) String cookieToken,
            @RequestBody Venture venture) {

        String studentId = extractStudentId(authHeader, cookieToken);
        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("The authentication token is missing or invalid.");
        }

        try {
            Venture updatedVenture = updateVentureUseCase.execute(id, venture, studentId);
            log.info("Venture '{}' updated successfully with ID: {}", updatedVenture.getTitle(), updatedVenture.getId());
            return ResponseEntity.ok(updatedVenture);
        } catch (RuntimeException e) {
            log.error("Error updating venture: {}", e.getMessage());
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            if (e.getMessage().contains("authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenture(
            @PathVariable UUID id,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @CookieValue(value = "access_token", required = false) String cookieToken) {

        String studentId = extractStudentId(authHeader, cookieToken);
        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("The authentication token is missing or invalid.");
        }

        try {
            deleteVentureUseCase.execute(id, studentId);
            log.info("Venture deleted successfully with ID: {}", id);
            return ResponseEntity.ok().body("Venture deleted successfully");
        } catch (RuntimeException e) {
            log.error("Error deleting venture: {}", e.getMessage());
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            if (e.getMessage().contains("authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    private String extractStudentId(String authHeader, String cookieToken) {
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.replace("Bearer ", "");
        } else if (cookieToken != null && !cookieToken.isEmpty()) {
            token = cookieToken;
        }

        if (token == null) {
            log.warn("Security Alert: Missing or invalid authentication token.");
            return null;
        }

        try {
            String[] chunks = token.split("\\.");
            Base64.Decoder decoder = Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));

            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(payload);

            // Extract user_id or sub (Firebase UID)
            String uid = node.has("user_id") ? node.get("user_id").asText() : "";
            if (uid.isEmpty() && node.has("sub")) {
                uid = node.get("sub").asText();
            }

            String email = node.has("email") ? node.get("email").asText() : "";

            // Validate that the user is a UCE student
            if (!email.endsWith("@uce.edu.ec")) {
                log.warn("Security Alert: Blocked venture operation attempt from external client: {}", email);
                return null;
            }

            log.info("Venture operation authorized for student: {}", email);
            return uid;

        } catch (Exception e) {
            log.error(" Token processing error: {}", e.getMessage());
            return null;
        }
    }
}