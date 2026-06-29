package ec.edu.uce.trade.product.application.usecases;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import ec.edu.uce.trade.product.domain.ports.out.VentureEventPort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UpdateVentureUseCase {

    private final VentureRepositoryPort repositoryPort;
    private final VentureEventPort eventPort;

    public UpdateVentureUseCase(VentureRepositoryPort repositoryPort, VentureEventPort eventPort) {
        this.repositoryPort = repositoryPort;
        this.eventPort = eventPort;
    }

    public Venture execute(UUID id, Venture updatedVenture, String studentId) {
        // 1. Find existing venture
        Venture existingVenture = repositoryPort.findById(id)
                .orElseThrow(() -> new RuntimeException("Venture not found with id: " + id));

        // 2. Verify ownership
        if (!existingVenture.getStudentId().equals(studentId)) {
            throw new RuntimeException("You are not authorized to update this venture");
        }

        // 3. Update fields
        existingVenture.setTitle(updatedVenture.getTitle());
        existingVenture.setCategory(updatedVenture.getCategory());
        existingVenture.setDescription(updatedVenture.getDescription());
        existingVenture.setPrice(updatedVenture.getPrice());

        // 4. Persist changes
        Venture savedVenture = repositoryPort.save(existingVenture);

        // 5. Publish event to notify other services
        eventPort.publishVentureUpdatedEvent(savedVenture);

        return savedVenture;
    }
}