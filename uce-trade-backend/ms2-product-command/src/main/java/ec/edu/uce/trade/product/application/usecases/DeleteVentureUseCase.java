package ec.edu.uce.trade.product.application.usecases;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import ec.edu.uce.trade.product.domain.ports.out.VentureEventPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class DeleteVentureUseCase {

    private final VentureRepositoryPort repositoryPort;
    private final VentureEventPort eventPort;

    public DeleteVentureUseCase(VentureRepositoryPort repositoryPort, VentureEventPort eventPort) {
        this.repositoryPort = repositoryPort;
        this.eventPort = eventPort;
    }

    public void execute(UUID id, String studentId) {
        log.info("Starting deletion process for venture ID: {}", id);
        // 1. Find existing venture
        Venture existingVenture = repositoryPort.findById(id)
                .orElseThrow(() -> {
                    log.error("Venture not found with id: {}", id);
                    return new RuntimeException("Venture not found with id: " + id);
                });

        // 2. Verify ownership
        if (!existingVenture.getStudentId().equals(studentId)) {
            log.warn("Unauthorized deletion attempt for venture ID: {} by student ID: {}", id, studentId);
            throw new RuntimeException("You are not authorized to delete this venture");
        }

        // 3. Delete from database
        log.debug("Deleting venture from database");
        repositoryPort.deleteById(id);

        // 4. Publish event to notify other services
        log.debug("Publishing VentureDeleted event for ID: {}", id);
        eventPort.publishVentureDeletedEvent(id.toString());
        
        log.info("Venture deletion completed successfully for ID: {}", id);
    }
}