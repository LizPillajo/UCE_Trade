package ec.edu.uce.trade.ms7_billing.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI billingOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Billing & n8n API")
                        .description("Microservice for generating PDF invoices and triggering n8n workflows")
                        .version("1.0.0"));
    }
}
