package ec.edu.uce.trade.product.domain.ports.out;

import ec.edu.uce.trade.product.domain.model.Venture;

public interface VentureRepositoryPort {
    Venture save(Venture venture);
    
}