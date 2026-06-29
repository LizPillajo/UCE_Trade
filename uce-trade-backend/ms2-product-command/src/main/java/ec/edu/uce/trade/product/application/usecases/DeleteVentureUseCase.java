package ec.edu.uce.trade.product.application.usecases;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import ec.edu.uce.trade.product.domain.ports.out.VentureEventPort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeleteVentureUseCase {

    private final VentureRepositoryPort repositoryPort;
    private final VentureEventPort eventPort;

    public DeleteVentureUseCase(VentureRepositoryPort repositoryPort, VentureEventPort eventPort) {
        this.repositoryPort = repositoryPort;
        this.eventPort = eventPort;
    }

    public void execute(UUID id, String studentId) {
        // 1. Find existing venture
        Venture existingVenture = repositoryPort.findById(id)
                .orElseThrow(() -> new RuntimeException("Venture not found with id: " + id));

        // 2. Verify ownership
        if (!existingVenture.getStudentId().equals(studentId)) {
            throw new RuntimeException("You are not authorized to delete this venture");
        }

        // 3. Delete from database
        repositoryPort.deleteById(id);

        // 4. Publish event to notify other services
        eventPort.publishVentureDeletedEvent(id.toString());
    }
}