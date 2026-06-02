package ec.edu.uce.trade.product.domain.ports.out;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStoragePort {
    String uploadImage(MultipartFile file, String fileName);
}