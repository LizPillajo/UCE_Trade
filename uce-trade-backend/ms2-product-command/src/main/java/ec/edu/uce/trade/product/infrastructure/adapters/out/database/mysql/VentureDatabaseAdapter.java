package ec.edu.uce.trade.product.infrastructure.adapters.out.database.mysql;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
public class VentureDatabaseAdapter implements VentureRepositoryPort {

    private final SpringDataVentureRepository repository;

    public VentureDatabaseAdapter(SpringDataVentureRepository repository) {
        this.repository = repository;
    }

    @Override
    public Venture save(Venture venture) {
        log.debug("Saving venture to database: {}", venture.getId());
        // 1. Convert the domain object to a database entity
        VentureEntity entity = new VentureEntity();
        entity.setId(venture.getId());
        entity.setStudentId(venture.getStudentId());
        entity.setTitle(venture.getTitle());
        entity.setCategory(venture.getCategory());
        entity.setDescription(venture.getDescription());
        entity.setPrice(venture.getPrice());
        entity.setStatus(venture.getStatus());
        entity.setCreatedAt(venture.getCreatedAt());
        entity.setImageUrl(venture.getImageUrl());

        // 2. Save in MySQL
        VentureEntity savedEntity = repository.save(entity);

        // 3. Return as a domain object
        return mapToDomain(savedEntity);
    }

    @Override
    public Optional<Venture> findById(UUID id) {
        log.debug("Finding venture by ID: {}", id);
        return repository.findById(id).map(this::mapToDomain);
    }

    @Override
    public void deleteById(UUID id) {
        log.debug("Deleting venture by ID: {}", id);
        repository.deleteById(id);
    }

    private Venture mapToDomain(VentureEntity entity) {
        Venture venture = new Venture();
        venture.setId(entity.getId());
        venture.setStudentId(entity.getStudentId());
        venture.setTitle(entity.getTitle());
        venture.setCategory(entity.getCategory());
        venture.setDescription(entity.getDescription());
        venture.setPrice(entity.getPrice());
        venture.setStatus(entity.getStatus());
        venture.setCreatedAt(entity.getCreatedAt());
        venture.setImageUrl(entity.getImageUrl());
        return venture;
    }
}