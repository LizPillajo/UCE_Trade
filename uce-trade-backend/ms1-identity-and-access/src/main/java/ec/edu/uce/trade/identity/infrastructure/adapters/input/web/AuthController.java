package ec.edu.uce.trade.identity.infrastructure.adapters.input.web;

import ec.edu.uce.trade.identity.application.services.AuthService; 
import ec.edu.uce.trade.identity.domain.model.User; 
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestHeader("Authorization") String token) {
        log.info("Received login request.");
        try {
            String idToken = token.replace("Bearer ", "");
            User user = authService.authenticate(idToken);
            log.info("Login successful for user: {}", user.getEmail());

            ResponseCookie cookie = ResponseCookie.from("access_token", idToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(3600) // 1 hora
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(user);
        } catch (Exception e) {
            log.error("Error de autenticación: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }
}