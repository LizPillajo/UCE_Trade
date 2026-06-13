package ec.edu.uce.trade.product.infrastructure.adapters.out;

import ec.edu.uce.trade.product.domain.ports.out.ImageStoragePort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Component
public class SupabaseStorageAdapter implements ImageStoragePort {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    @Override
    public String uploadImage(MultipartFile file, String fileName) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            // Supabase Storage REST API Endpoint
            String url = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(supabaseKey);
            headers.setContentType(MediaType.valueOf(file.getContentType()));

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);
            restTemplate.postForEntity(url, requestEntity, String.class);

            // Return the public URL to save it in MySQL
            return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Error uploading image to Supabase", e);
        }
    }
}