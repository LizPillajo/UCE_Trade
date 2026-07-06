package ec.edu.uce.trade.product.application.usecases;

import ec.edu.uce.trade.product.domain.model.Venture;
import ec.edu.uce.trade.product.domain.ports.out.VentureRepositoryPort;
import ec.edu.uce.trade.product.domain.ports.out.VentureEventPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import ec.edu.uce.trade.product.domain.ports.out.ImageStoragePort;

@Slf4j
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
        log.info("Starting venture creation process for title: {}", venture.getTitle());
        venture.setId(UUID.randomUUID());
        venture.setCreatedAt(LocalDateTime.now());
        venture.setStatus("PENDING");

        // 1. Upload an image to Supabase and save the public URL
        String fileName = venture.getId().toString() + "-" + file.getOriginalFilename();
        log.debug("Uploading image to Supabase: {}", fileName);
        String uploadedUrl = imageStoragePort.uploadImage(file, fileName);
        venture.setImageUrl(uploadedUrl);

        // 2. Persist in the database (MySQL)
        log.debug("Persisting venture in MySQL with ID: {}", venture.getId());
        Venture savedVenture = repositoryPort.save(venture);

        // 3. Publish the event in the Data Bus (Kafka)
        log.debug("Publishing VentureCreated event to Kafka for ID: {}", savedVenture.getId());
        eventPort.publishVentureCreatedEvent(savedVenture);

        log.info("Venture creation process completed successfully for ID: {}", savedVenture.getId());
        return savedVenture;
    }
}