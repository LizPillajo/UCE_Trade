package ec.edu.uce.trade.product.infrastructure.adapters.out.database.mysql;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SpringDataVentureRepository extends JpaRepository<VentureEntity, UUID> {
}