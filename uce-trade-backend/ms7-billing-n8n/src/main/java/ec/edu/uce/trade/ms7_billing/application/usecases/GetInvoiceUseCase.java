package ec.edu.uce.trade.ms7_billing.application.usecases;

import ec.edu.uce.trade.ms7_billing.domain.model.Invoice;
import ec.edu.uce.trade.ms7_billing.domain.ports.out.InvoiceRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetInvoiceUseCase {

    private final InvoiceRepositoryPort invoiceRepositoryPort;

    public Optional<Invoice> getLatestInvoiceByVentureIdAndStudentId(UUID ventureId, String studentId) {
        return invoiceRepositoryPort.findFirstByVentureIdAndStudentIdOrderByCreatedAtDesc(ventureId, studentId);
    }
}
