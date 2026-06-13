package ec.edu.uce.trade.product.infrastructure.adapters.out.database.mysql;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import org.springframework.stereotype.Component;

@Component
public class VentureDatabaseAdapter implements VentureRepositoryPort {

    private final SpringDataVentureRepository repository;

    public VentureDatabaseAdapter(SpringDataVentureRepository repository) {
        this.repository = repository;
    }

    @Override
    public Venture save(Venture venture) {
        // 1. Convert the domain object to a database entity
        VentureEntity entity = new VentureEntity();
        entity.setId(venture.getId());
        entity.setStudentId(venture.getStudentId());
        entity.setTitle(venture.getTitle());
        entity.setDescription(venture.getDescription());
        entity.setPrice(venture.getPrice());
        entity.setStatus(venture.getStatus());
        entity.setCreatedAt(venture.getCreatedAt());

        // 2. Save in MySQL
        VentureEntity savedEntity = repository.save(entity);

        // 3. Return as a domain object
        Venture savedVenture = new Venture();
        savedVenture.setId(savedEntity.getId());
        savedVenture.setStudentId(savedEntity.getStudentId());
        savedVenture.setTitle(savedEntity.getTitle());
        savedVenture.setDescription(savedEntity.getDescription());
        savedVenture.setPrice(savedEntity.getPrice());
        savedVenture.setStatus(savedEntity.getStatus());
        savedVenture.setCreatedAt(savedEntity.getCreatedAt());

        return savedVenture;
    }
}