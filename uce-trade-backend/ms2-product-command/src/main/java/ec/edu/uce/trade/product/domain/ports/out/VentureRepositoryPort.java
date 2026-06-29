package ec.edu.uce.trade.product.domain.ports.out;

import ec.edu.uce.trade.product.domain.model.Venture;

import java.util.Optional;
import java.util.UUID;

public interface VentureRepositoryPort {
    Venture save(Venture venture);
    Optional<Venture> findById(UUID id);
    void deleteById(UUID id);
}