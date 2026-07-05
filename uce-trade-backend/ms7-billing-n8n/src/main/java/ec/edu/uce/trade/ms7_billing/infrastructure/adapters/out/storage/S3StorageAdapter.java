package ec.edu.uce.trade.ms7_billing.infrastructure.adapters.out.storage;

import ec.edu.uce.trade.ms7_billing.domain.ports.out.FileStoragePort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;

@Slf4j
@Component
public class S3StorageAdapter implements FileStoragePort {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket:uce-trade-qa-bucket}")
    private String bucketName;

    public S3StorageAdapter() {
        this.s3Client = S3Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }

    @Override
    public String uploadFile(File file, String fileName) {
        log.info("Uploading file {} to S3 bucket {}", fileName, bucketName);
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key("invoices/" + fileName)
                    .contentType("application/pdf")
                    .build();

            s3Client.putObject(putObjectRequest, file.toPath());
            
            // Constructing the public URL for the file
            String url = String.format("https://%s.s3.us-east-1.amazonaws.com/invoices/%s", bucketName, fileName);
            log.info("Successfully uploaded file to S3: {}", url);
            return url;
        } catch (Exception e) {
            log.error("Error uploading file to S3", e);
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }
}
