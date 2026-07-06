package ec.edu.uce.trade.ms6_payments.application.usecases;

import ec.edu.uce.trade.ms6_payments.domain.model.Payment;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.PaymentEventPort;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.PaymentRepositoryPort;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.StripePort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class ProcessPaymentUseCaseTest {

    @Mock
    private PaymentRepositoryPort repositoryPort;

    @Mock
    private StripePort stripePort;

    @Mock
    private PaymentEventPort eventPort;

    @InjectMocks
    private ProcessPaymentUseCase processPaymentUseCase;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateIntent() {
        UUID ventureId = UUID.randomUUID();
        String ventureName = "Awesome Project";
        String studentId = "student-123";
        BigDecimal amount = new BigDecimal("25.00");
        String expectedClientSecret = "pi_123_secret_456";

        when(stripePort.createPaymentIntent(eq(amount), eq("USD"), eq("Pay for service: Awesome Project"), any()))
                .thenReturn(expectedClientSecret);

        String actualClientSecret = processPaymentUseCase.createIntent(ventureId, ventureName, studentId, amount);

        assertEquals(expectedClientSecret, actualClientSecret);
        verify(stripePort, times(1)).createPaymentIntent(any(), any(), any(), any());
    }

    @Test
    void testConfirmPayment() {
        UUID ventureId = UUID.randomUUID();
        String studentId = "student-123";
        BigDecimal amount = new BigDecimal("25.00");

        Payment mockSavedPayment = new Payment();
        mockSavedPayment.setId(UUID.randomUUID());
        mockSavedPayment.setVentureId(ventureId);
        mockSavedPayment.setStudentId(studentId);
        mockSavedPayment.setAmount(amount);
        mockSavedPayment.setStatus("SUCCEEDED");

        when(repositoryPort.save(any(Payment.class))).thenReturn(mockSavedPayment);
        doNothing().when(eventPort).publishPaymentSuccess(any(Payment.class));

        Payment actualPayment = processPaymentUseCase.confirmPayment(ventureId, studentId, amount);

        assertNotNull(actualPayment);
        assertEquals("SUCCEEDED", actualPayment.getStatus());
        assertEquals(ventureId, actualPayment.getVentureId());
        
        verify(repositoryPort, times(1)).save(any(Payment.class));
        verify(eventPort, times(1)).publishPaymentSuccess(any(Payment.class));
    }
}
