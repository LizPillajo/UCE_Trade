package ec.edu.uce.trade.ms6_payments.infrastructure.adapters.out.stripe;

import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import ec.edu.uce.trade.ms6_payments.domain.ports.out.StripePort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
public class StripePaymentAdapter implements StripePort {

    @Override
    public String createPaymentIntent(BigDecimal amount, String currency) {
        try {
            log.debug("Communicating with Stripe API to create PaymentIntent for amount: {}", amount);
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount.multiply(new BigDecimal("100")).longValue()) 
                    .setCurrency(currency.toLowerCase())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            return intent.getClientSecret();
        } catch (Exception e) {
            log.error("Stripe API communication failed: {}", e.getMessage(), e);
            throw new RuntimeException("Error communicating with Stripe", e);
        }
    }
}