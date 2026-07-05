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

@Slf4j
@Service
@RequiredArgsConstructor
public class GenerateInvoiceUseCase {

    private final InvoiceRepositoryPort invoiceRepositoryPort;
    private final N8nWebhookPort n8nWebhookPort;
    private final ec.edu.uce.trade.ms7_billing.infrastructure.adapters.out.pdf.PdfGenerationService pdfGenerationService;

    public void processPaymentSuccess(UUID ventureId, String studentId, BigDecimal amount) {
        log.info("Processing successful payment for Venture ID: {}", ventureId);
        
        // Check if invoice already exists to ensure idempotency
        if (invoiceRepositoryPort.findByVentureId(ventureId).isPresent()) {
            log.warn("Invoice for Venture ID {} already exists. Skipping.", ventureId);
            return;
        }

        UUID invoiceId = UUID.randomUUID();

        // 1. Generate PDF (MS7-03)
        String pdfUrl = pdfGenerationService.generatePdf(invoiceId, ventureId, studentId, amount);

        // 2. Save Invoice
        Invoice invoice = new Invoice();
        invoice.setId(invoiceId);
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
        n8nWebhookPort.sendInvoiceEmail(savedInvoice);
        log.info("n8n webhook triggered successfully for Invoice ID: {}", savedInvoice.getId());
    }

}
