package ec.edu.uce.trade.product.domain.ports.out;

import ec.edu.uce.trade.product.domain.model.Venture;

public interface VentureEventPort {
    void publishVentureCreatedEvent(Venture venture);
}