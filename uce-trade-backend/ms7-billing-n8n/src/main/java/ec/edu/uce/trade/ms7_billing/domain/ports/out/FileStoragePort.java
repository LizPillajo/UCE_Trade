package ec.edu.uce.trade.ms7_billing.domain.ports.out;

import java.io.File;

public interface FileStoragePort {
    String uploadFile(File file, String fileName);
}
