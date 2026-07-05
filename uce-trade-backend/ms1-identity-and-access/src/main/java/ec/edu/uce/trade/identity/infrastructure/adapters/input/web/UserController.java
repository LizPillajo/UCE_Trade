package ec.edu.uce.trade.identity.infrastructure.adapters.input.web;

import ec.edu.uce.trade.identity.application.services.AuthService;
import ec.edu.uce.trade.identity.domain.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/{uid}")
    public ResponseEntity<User> getProfile(@PathVariable String uid) {
        log.info("Fetching profile for user ID: {}", uid);
        try {
            User user = authService.getUserProfile(uid);
            log.info("Successfully fetched profile for user ID: {}", uid);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Failed to fetch profile for user ID: {}. Error: {}", uid, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{uid}")
    public ResponseEntity<User> updateProfile(@PathVariable String uid, @RequestBody User userData) {
        log.info("Updating profile for user ID: {}", uid);
        try {
            User updatedUser = authService.updateProfile(uid, userData);
            log.info("Successfully updated profile for user ID: {}", uid);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("Failed to update profile for user ID: {}. Error: {}", uid, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}