package ec.edu.uce.trade.ms7_billing.infrastructure.adapters.in.web;

import ec.edu.uce.trade.ms7_billing.application.usecases.GetInvoiceUseCase;
import ec.edu.uce.trade.ms7_billing.domain.model.Invoice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
public class BillingController {
    
    private final GetInvoiceUseCase getInvoiceUseCase;

    @GetMapping("/invoice/{ventureId}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable UUID ventureId) {
        log.info("REST Request to get invoice for ventureId: {}", ventureId);
        return getInvoiceUseCase.getInvoiceByVentureId(ventureId)
                .map(invoice -> {
                    log.info("Invoice found for ventureId {}: {}", ventureId, invoice.getId());
                    return ResponseEntity.ok(invoice);
                })
                .orElseGet(() -> {
                    log.warn("No invoice found for ventureId: {}", ventureId);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/mock-invoices/{fileName}")
    public ResponseEntity<org.springframework.core.io.Resource> getMockInvoice(@PathVariable String fileName) {
        try {
            java.nio.file.Path file = java.nio.file.Paths.get(System.getProperty("java.io.tmpdir"), "mock-invoices", fileName);
            if (!java.nio.file.Files.exists(file)) {
                return ResponseEntity.notFound().build();
            }
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(file.toUri());
            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "application/pdf")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
