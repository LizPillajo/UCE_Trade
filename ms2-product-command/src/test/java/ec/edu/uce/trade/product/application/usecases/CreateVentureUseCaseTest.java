package ec.edu.uce.trade.product.application.usecases;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateVentureUseCaseTest {

    @Mock
    private VentureRepositoryPort repositoryPort;

    @InjectMocks
    private CreateVentureUseCase useCase;

    @Test
    void shouldCreateVentureWithPendingStatusAndId() {
        // 1. Arrange (Prepare test data)
        Venture newVenture = new Venture();
        newVenture.setStudentId(UUID.randomUUID());
        newVenture.setTitle("Emprendimiento de Prueba");
        newVenture.setPrice(new BigDecimal("10.00"));

        // Simulate that the database returns what we sent it
        when(repositoryPort.save(any(Venture.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 2. Act (Execute the business logic)
        Venture savedVenture = useCase.execute(newVenture);

        // 3. Assert (Verify that the rules were followed)
        assertNotNull(savedVenture.getId(), "The ID should not be null");
        assertNotNull(savedVenture.getCreatedAt(), "The creation date should not be null");
        assertEquals("PENDING", savedVenture.getStatus(), "The initial status should be PENDING");

        // Verify that the database port was called exactly once
        verify(repositoryPort, times(1)).save(any(Venture.class));
    }
}