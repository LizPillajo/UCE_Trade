package ec.edu.uce.trade.ms6_payments.domain.ports.out;

import java.math.BigDecimal;

public interface StripePort {
    String createPaymentIntent(BigDecimal amount, String currency);
}