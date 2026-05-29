package ec.edu.uce.trade.product.application.usecases;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CreateVentureUseCase {

    private final VentureRepositoryPort repositoryPort;

    public CreateVentureUseCase(VentureRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    public Venture execute(Venture venture) {
        venture.setId(UUID.randomUUID());
        venture.setCreatedAt(LocalDateTime.now());
        venture.setStatus("PENDING"); 
        return repositoryPort.save(venture);
    }
}
