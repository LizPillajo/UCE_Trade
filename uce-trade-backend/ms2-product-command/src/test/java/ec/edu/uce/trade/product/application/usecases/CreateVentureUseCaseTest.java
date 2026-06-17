package ec.edu.uce.trade.product.application.usecases;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.ImageStoragePort;
import ec.edu.uce.trade.product.domain.ports.out.VentureEventPort;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class CreateVentureUseCaseTest {

    @Mock
    private VentureRepositoryPort repositoryPort;

    @Mock
    private VentureEventPort eventPort;

    @Mock
    private ImageStoragePort imageStoragePort;

    @InjectMocks
    private CreateVentureUseCase createVentureUseCase;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateVentureAndUploadImageSuccessfully() {
        // 1. Fake data
        Venture newVenture = new Venture();
        newVenture.setStudentId("firebase-uid-test-123"); 
        newVenture.setTitle("Emprendimiento de Prueba");
        newVenture.setPrice(new BigDecimal("15.50"));

        // Create a fake photo
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("foto.jpg");

        // Assume that Supabase returns a valid URL
        when(imageStoragePort.uploadImage(any(), anyString()))
                .thenReturn("https://supabase.com/foto.jpg");

        // Assume that the database saves and returns the same object
        when(repositoryPort.save(any(Venture.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 2. Execute the use case (Act)
        Venture savedVenture = createVentureUseCase.execute(newVenture, mockFile);

        // 3. Verify the results (Assert)
        assertNotNull(savedVenture.getId());
        assertNotNull(savedVenture.getCreatedAt());
        assertEquals("PENDING", savedVenture.getStatus());
        assertEquals("https://supabase.com/foto.jpg", savedVenture.getImageUrl());

        // Verify that the ports were called exactly once
        verify(imageStoragePort, times(1)).uploadImage(any(), anyString());
        verify(repositoryPort, times(1)).save(any(Venture.class));
        verify(eventPort, times(1)).publishVentureCreatedEvent(any(Venture.class));
    }
}