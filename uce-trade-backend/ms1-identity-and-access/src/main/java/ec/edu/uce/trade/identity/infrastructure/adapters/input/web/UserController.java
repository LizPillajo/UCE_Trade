package ec.edu.uce.trade.identity.infrastructure.adapters.input.web;

import ec.edu.uce.trade.identity.application.services.AuthService;
import ec.edu.uce.trade.identity.domain.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/{uid}")
    public ResponseEntity<User> getProfile(@PathVariable String uid) {
        try {
            return ResponseEntity.ok(authService.getUserProfile(uid));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{uid}")
    public ResponseEntity<User> updateProfile(@PathVariable String uid, @RequestBody User userData) {
        try {
            return ResponseEntity.ok(authService.updateProfile(uid, userData));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}