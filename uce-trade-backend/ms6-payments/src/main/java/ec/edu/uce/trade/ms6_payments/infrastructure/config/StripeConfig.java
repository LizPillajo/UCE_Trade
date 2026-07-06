package ec.edu.uce.trade.ms6_payments.infrastructure.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class StripeConfig {

    @Value("${stripe.secret-key}")
    private String secretKey;

    @Value("${stripe.webhook-secret:}")
    private String webhookSecret;

    public String getWebhookSecret() {
        return webhookSecret;
    }

    @PostConstruct
    public void init() {
        if (secretKey == null || secretKey.trim().isEmpty()) {
            log.warn("Stripe Secret Key is missing or empty. Payments will fail.");
        } else {
            Stripe.apiKey = secretKey;
            log.info("Stripe SDK initialized successfully.");
        }
    }
}