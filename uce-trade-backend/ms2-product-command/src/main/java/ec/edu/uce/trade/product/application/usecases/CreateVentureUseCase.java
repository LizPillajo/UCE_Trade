package ec.edu.uce.trade.product.application.usecases;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import ec.edu.uce.trade.product.domain.ports.out.VentureEventPort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import ec.edu.uce.trade.product.domain.ports.out.ImageStoragePort;

@Service
public class CreateVentureUseCase {

    private final VentureRepositoryPort repositoryPort;
    private final ImageStoragePort imageStoragePort;
    private final VentureEventPort eventPort; // Kafka port

    // Spring Boot automatically injects MySQL and Kafka 
    public CreateVentureUseCase(VentureRepositoryPort repositoryPort, ImageStoragePort imageStoragePort, VentureEventPort eventPort) {
        this.repositoryPort = repositoryPort;
        this.imageStoragePort = imageStoragePort;
        this.eventPort = eventPort;
    }

    public Venture execute(Venture venture, org.springframework.web.multipart.MultipartFile file) {
        venture.setId(UUID.randomUUID());
        venture.setCreatedAt(LocalDateTime.now());
        venture.setStatus("PENDING");

        // 1. Upload an image to Supabase and save the public URL
        String fileName = venture.getId().toString() + "-" + file.getOriginalFilename();
        String uploadedUrl = imageStoragePort.uploadImage(file, fileName);
        venture.setImageUrl(uploadedUrl);

        // 2. Persist in the database (MySQL)
        Venture savedVenture = repositoryPort.save(venture);

        // 3. Publish the event in the Data Bus (Kafka)
        eventPort.publishVentureCreatedEvent(savedVenture);

        return savedVenture;
    }
}