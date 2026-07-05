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
}
