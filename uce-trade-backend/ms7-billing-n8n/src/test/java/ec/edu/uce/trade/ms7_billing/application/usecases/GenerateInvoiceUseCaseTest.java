package ec.edu.uce.trade.ms7_billing.application.usecases;

import ec.edu.uce.trade.ms7_billing.domain.model.Invoice;
import ec.edu.uce.trade.ms7_billing.domain.ports.out.InvoiceRepositoryPort;
import ec.edu.uce.trade.ms7_billing.domain.ports.out.N8nWebhookPort;
import ec.edu.uce.trade.ms7_billing.infrastructure.adapters.out.pdf.PdfGenerationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import ec.edu.uce.trade.ms7_billing.application.services.InvoiceDataEnricherService;

@ExtendWith(MockitoExtension.class)
public class GenerateInvoiceUseCaseTest {

    @Mock
    private InvoiceRepositoryPort invoiceRepositoryPort;

    @Mock
    private N8nWebhookPort n8nWebhookPort;

    @Mock
    private PdfGenerationService pdfGenerationService;

    @Mock
    private InvoiceDataEnricherService invoiceDataEnricherService;

    @InjectMocks
    private GenerateInvoiceUseCase generateInvoiceUseCase;

    private UUID paymentId;
    private UUID ventureId;
    private String studentId;
    private BigDecimal amount;
    private InvoiceDataEnricherService.EnrichedInvoiceData enrichedData;

    @BeforeEach
    void setUp() {
        paymentId = UUID.randomUUID();
        ventureId = UUID.randomUUID();
        studentId = "STD-001";
        amount = new BigDecimal("150.00");
        enrichedData = new InvoiceDataEnricherService.EnrichedInvoiceData();
    }

    @Test
    void testProcessPaymentSuccess_NewInvoice() {
        // Arrange
        when(invoiceRepositoryPort.findByPaymentId(paymentId)).thenReturn(Optional.empty());
        when(invoiceDataEnricherService.fetchEnrichedData(ventureId, studentId)).thenReturn(enrichedData);
        when(pdfGenerationService.generatePdf(any(), eq(ventureId), eq(studentId), eq(amount), eq(enrichedData)))
                .thenReturn("https://s3.url/invoice.pdf");
        
        Invoice mockSavedInvoice = new Invoice();
        mockSavedInvoice.setId(UUID.randomUUID());
        when(invoiceRepositoryPort.save(any(Invoice.class))).thenReturn(mockSavedInvoice);

        // Act
        generateInvoiceUseCase.processPaymentSuccess(paymentId, ventureId, studentId, amount);

        // Assert
        verify(invoiceRepositoryPort, times(1)).findByPaymentId(paymentId);
        verify(invoiceDataEnricherService, times(1)).fetchEnrichedData(ventureId, studentId);
        verify(pdfGenerationService, times(1)).generatePdf(any(), eq(ventureId), eq(studentId), eq(amount), eq(enrichedData));
        verify(invoiceRepositoryPort, times(1)).save(any(Invoice.class));
        verify(n8nWebhookPort, times(1)).sendInvoiceEmail(mockSavedInvoice, enrichedData);
    }

    @Test
    void testProcessPaymentSuccess_DuplicateEvent() {
        // Arrange
        Invoice existingInvoice = new Invoice();
        when(invoiceRepositoryPort.findByPaymentId(paymentId)).thenReturn(Optional.of(existingInvoice));

        // Act
        generateInvoiceUseCase.processPaymentSuccess(paymentId, ventureId, studentId, amount);

        // Assert
        verify(invoiceRepositoryPort, times(1)).findByPaymentId(paymentId);
        verify(invoiceDataEnricherService, never()).fetchEnrichedData(any(), any());
        verify(pdfGenerationService, never()).generatePdf(any(), any(), any(), any(), any());
        verify(invoiceRepositoryPort, never()).save(any(Invoice.class));
        verify(n8nWebhookPort, never()).sendInvoiceEmail(any(), any());
    }
}
