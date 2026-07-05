package ec.edu.uce.trade.product.application.usecases;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import ec.edu.uce.trade.product.domain.ports.out.VentureEventPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class UpdateVentureUseCase {

    private final VentureRepositoryPort repositoryPort;
    private final VentureEventPort eventPort;

    public UpdateVentureUseCase(VentureRepositoryPort repositoryPort, VentureEventPort eventPort) {
        this.repositoryPort = repositoryPort;
        this.eventPort = eventPort;
    }

    public Venture execute(UUID id, Venture updatedVenture, String studentId) {
        log.info("Starting update process for venture ID: {}", id);
        // 1. Find existing venture
        Venture existingVenture = repositoryPort.findById(id)
                .orElseThrow(() -> {
                    log.error("Venture not found with id: {}", id);
                    return new RuntimeException("Venture not found with id: " + id);
                });

        // 2. Verify ownership
        if (!existingVenture.getStudentId().equals(studentId)) {
            log.warn("Unauthorized update attempt for venture ID: {} by student ID: {}", id, studentId);
            throw new RuntimeException("You are not authorized to update this venture");
        }

        // 3. Update fields
        existingVenture.setTitle(updatedVenture.getTitle());
        existingVenture.setCategory(updatedVenture.getCategory());
        existingVenture.setDescription(updatedVenture.getDescription());
        existingVenture.setPrice(updatedVenture.getPrice());

        // 4. Persist changes
        log.debug("Persisting updated venture to database");
        Venture savedVenture = repositoryPort.save(existingVenture);

        // 5. Publish event to notify other services
        log.debug("Publishing VentureUpdated event for ID: {}", savedVenture.getId());
        eventPort.publishVentureUpdatedEvent(savedVenture);

        log.info("Venture update completed successfully for ID: {}", savedVenture.getId());
        return savedVenture;
    }
}