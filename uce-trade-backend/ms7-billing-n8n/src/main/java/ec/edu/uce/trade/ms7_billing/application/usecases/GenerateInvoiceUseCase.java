package ec.edu.uce.trade.ms7_billing.application.usecases;

import ec.edu.uce.trade.ms7_billing.domain.model.Invoice;
import ec.edu.uce.trade.ms7_billing.domain.ports.out.InvoiceRepositoryPort;
import ec.edu.uce.trade.ms7_billing.domain.ports.out.N8nWebhookPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import ec.edu.uce.trade.ms7_billing.application.services.InvoiceDataEnricherService;

@Slf4j
@Service
@RequiredArgsConstructor
public class GenerateInvoiceUseCase {

    private final InvoiceRepositoryPort invoiceRepositoryPort;
    private final N8nWebhookPort n8nWebhookPort;
    private final ec.edu.uce.trade.ms7_billing.infrastructure.adapters.out.pdf.PdfGenerationService pdfGenerationService;
    private final InvoiceDataEnricherService invoiceDataEnricherService;

    public void processPaymentSuccess(UUID paymentId, UUID ventureId, String studentId, BigDecimal amount) {
        log.info("Processing successful payment for Venture ID: {} with Payment ID: {}", ventureId, paymentId);
        
        // Check if invoice already exists for this PAYMENT to ensure idempotency
        if (invoiceRepositoryPort.findByPaymentId(paymentId).isPresent()) {
            log.warn("Invoice for Payment ID {} already exists. Skipping.", paymentId);
            return;
        }

        UUID invoiceId = UUID.randomUUID();

        // Fetch enriched data with retry/fallback
        InvoiceDataEnricherService.EnrichedInvoiceData enrichedData = invoiceDataEnricherService.fetchEnrichedData(ventureId, studentId);

        // 1. Generate PDF (MS7-03)
        String pdfUrl = pdfGenerationService.generatePdf(invoiceId, ventureId, studentId, amount, enrichedData);

        // 2. Save Invoice
        Invoice invoice = new Invoice();
        invoice.setId(invoiceId);
        invoice.setPaymentId(paymentId);
        invoice.setVentureId(ventureId);
        invoice.setStudentId(studentId);
        invoice.setAmount(amount);
        invoice.setPdfUrl(pdfUrl);
        invoice.setCreatedAt(LocalDateTime.now());
        
        Invoice savedInvoice = invoiceRepositoryPort.save(invoice);
        log.info("Successfully saved invoice to database with ID: {}", savedInvoice.getId());
        log.debug("Saved Invoice details: {}", savedInvoice);

        // 3. Send email via n8n (MS7-04)
        log.info("Triggering n8n webhook for invoice email dispatch...");
        n8nWebhookPort.sendInvoiceEmail(savedInvoice, enrichedData);
        log.info("n8n webhook triggered successfully for Invoice ID: {}", savedInvoice.getId());
    }

}
