package ec.edu.uce.trade.ms7_billing.infrastructure.adapters.out.database;

import ec.edu.uce.trade.ms7_billing.domain.model.Invoice;
import ec.edu.uce.trade.ms7_billing.domain.ports.out.InvoiceRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class InvoiceRepositoryAdapter implements InvoiceRepositoryPort {

    private final SpringDataInvoiceRepository repository;

    @Override
    public Invoice save(Invoice invoice) {
        InvoiceEntity entity = toEntity(invoice);
        InvoiceEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Invoice> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Invoice> findByPaymentId(UUID paymentId) {
        return repository.findByPaymentId(paymentId).map(this::toDomain);
    }

    @Override
    public Optional<Invoice> findFirstByVentureIdAndStudentIdOrderByCreatedAtDesc(UUID ventureId, String studentId) {
        return repository.findFirstByVentureIdAndStudentIdOrderByCreatedAtDesc(ventureId, studentId).map(this::toDomain);
    }

    private InvoiceEntity toEntity(Invoice domain) {
        InvoiceEntity entity = new InvoiceEntity();
        entity.setId(domain.getId());
        entity.setPaymentId(domain.getPaymentId());
        entity.setVentureId(domain.getVentureId());
        entity.setStudentId(domain.getStudentId());
        entity.setAmount(domain.getAmount());
        entity.setPdfUrl(domain.getPdfUrl());
        entity.setCreatedAt(domain.getCreatedAt());
        return entity;
    }

    private Invoice toDomain(InvoiceEntity entity) {
        Invoice domain = new Invoice();
        domain.setId(entity.getId());
        domain.setPaymentId(entity.getPaymentId());
        domain.setVentureId(entity.getVentureId());
        domain.setStudentId(entity.getStudentId());
        domain.setAmount(entity.getAmount());
        domain.setPdfUrl(entity.getPdfUrl());
        domain.setCreatedAt(entity.getCreatedAt());
        return domain;
    }
}
