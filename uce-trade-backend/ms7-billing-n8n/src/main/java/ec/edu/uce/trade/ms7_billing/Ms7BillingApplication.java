package ec.edu.uce.trade.ms7_billing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@EnableRetry
public class Ms7BillingApplication {

    public static void main(String[] args) {
        SpringApplication.run(Ms7BillingApplication.class, args);
    }

}
