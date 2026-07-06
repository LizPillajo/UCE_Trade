package ec.edu.uce.trade.ms7_billing.domain.ports.out;

import ec.edu.uce.trade.ms7_billing.domain.model.Invoice;
import java.util.Optional;
import java.util.UUID;

public interface InvoiceRepositoryPort {
    Invoice save(Invoice invoice);
    Optional<Invoice> findById(UUID id);
    Optional<Invoice> findByPaymentId(UUID paymentId);
    Optional<Invoice> findFirstByVentureIdAndStudentIdOrderByCreatedAtDesc(UUID ventureId, String studentId);
}
