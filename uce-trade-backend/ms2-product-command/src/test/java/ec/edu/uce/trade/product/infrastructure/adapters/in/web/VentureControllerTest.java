package ec.edu.uce.trade.product.infrastructure.adapters.in.web;

import ec.edu.uce.trade.product.application.usecases.CreateVentureUseCase;
import ec.edu.uce.trade.product.domain.model.Venture;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class VentureControllerTest {

    @Mock
    private CreateVentureUseCase createVentureUseCase;

    @InjectMocks
    private VentureController ventureController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldRejectRequestWithoutToken() {
        Venture venture = new Venture();
        MultipartFile file = mock(MultipartFile.class);

        ResponseEntity<?> response = ventureController.createVenture(null, venture, file);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void shouldRejectNonStudentToken() {
        // Arrange: Fake payload masquerading as an external client
        String payload = "{\"email\":\"external.client@gmail.com\"}";
        String token = "header." + Base64.getUrlEncoder().encodeToString(payload.getBytes()) + ".signature";
        Venture venture = new Venture();
        MultipartFile file = mock(MultipartFile.class);

        // Act
        ResponseEntity<?> response = ventureController.createVenture("Bearer " + token, venture, file);

        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Access denied. Only UCE students can post business ventures.", response.getBody());
    }

    @Test
    void shouldAllowStudentToken() {
        // Arrange: Fake payload posing as a UCE student
        String payload = "{\"email\":\"estudiante@uce.edu.ec\"}";
        String token = "header." + Base64.getUrlEncoder().encodeToString(payload.getBytes()) + ".signature";
        
        Venture venture = new Venture();
        venture.setTitle("Test Venture");
        MultipartFile file = mock(MultipartFile.class);
        
        // Simulate function of the use case
        when(createVentureUseCase.execute(any(), any())).thenReturn(venture);

        // Act
        ResponseEntity<?> response = ventureController.createVenture("Bearer " + token, venture, file);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }
}