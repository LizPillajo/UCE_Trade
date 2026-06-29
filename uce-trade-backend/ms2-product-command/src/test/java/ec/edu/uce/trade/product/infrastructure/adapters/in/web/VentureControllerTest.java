package ec.edu.uce.trade.product.infrastructure.adapters.in.web;

import ec.edu.uce.trade.product.application.usecases.CreateVentureUseCase;
import ec.edu.uce.trade.product.application.usecases.DeleteVentureUseCase;
import ec.edu.uce.trade.product.application.usecases.UpdateVentureUseCase;
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

    @Mock
    private UpdateVentureUseCase updateVentureUseCase;

    @Mock
    private DeleteVentureUseCase deleteVentureUseCase;

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

        ResponseEntity<?> response = ventureController.createVenture(null, null, venture, file);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void shouldRejectNonStudentToken() {
        // Arrange: Fake payload masquerading as an external client
        String payload = "{\"email\":\"external.client@gmail.com\", \"user_id\":\"user-123\"}";
        String token = "header." + Base64.getUrlEncoder().encodeToString(payload.getBytes()) + ".signature";
        Venture venture = new Venture();
        MultipartFile file = mock(MultipartFile.class);

        // Act
        ResponseEntity<?> response = ventureController.createVenture("Bearer " + token, null, venture, file);

        // Assert - The extractStudentId method returns null for non-UCE emails,
        // which triggers a 401 UNAUTHORIZED response
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void shouldAllowStudentToken() {
        // Arrange: Fake payload posing as a UCE student
        String payload = "{\"email\":\"estudiante@uce.edu.ec\", \"user_id\":\"student-123\"}";
        String token = "header." + Base64.getUrlEncoder().encodeToString(payload.getBytes()) + ".signature";

        Venture venture = new Venture();
        venture.setTitle("Test Venture");
        MultipartFile file = mock(MultipartFile.class);

        // Simulate that the use case works
        when(createVentureUseCase.execute(any(), any())).thenReturn(venture);

        // Act
        ResponseEntity<?> response = ventureController.createVenture("Bearer " + token, null, venture, file);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }
}