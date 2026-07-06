package ec.edu.uce.trade.ms7_billing.application.services;

import ec.edu.uce.trade.ms7_billing.domain.model.dto.UserDto;
import ec.edu.uce.trade.ms7_billing.domain.model.dto.VentureDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceDataEnricherService {

    private final RestTemplate restTemplate;

    @Value("${gateway.url:http://localhost:8000}")
    private String gatewayUrl;

    public static class EnrichedInvoiceData {
        public String ventureTitle;
        public String buyerName;
        public String buyerEmail;
        public String sellerName;
        public String sellerEmail;
    }

    @Retryable(
            value = { Exception.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000, multiplier = 2)
    )
    public EnrichedInvoiceData fetchEnrichedData(UUID ventureId, String studentId) {
        log.info("Fetching enriched data for ventureId: {} and studentId: {}", ventureId, studentId);
        EnrichedInvoiceData data = new EnrichedInvoiceData();

        // 1. Fetch Buyer Details from MS1
        try {
            UserDto buyer = restTemplate.getForObject(gatewayUrl + "/api/v1/users/" + studentId, UserDto.class);
            if (buyer != null) {
                data.buyerName = buyer.getFullName() != null ? buyer.getFullName() : "Unknown Buyer";
                data.buyerEmail = buyer.getEmail() != null ? buyer.getEmail() : "N/A";
            }
        } catch (Exception e) {
            log.error("Failed to fetch buyer details from MS1 for studentId {}: {}", studentId, e.getMessage());
            throw e; // throw to trigger retry
        }

        // 2. Fetch Venture Details from MS4
        try {
            VentureDto venture = restTemplate.getForObject(gatewayUrl + "/api/ventures/" + ventureId, VentureDto.class);
            if (venture != null) {
                data.ventureTitle = venture.getTitle() != null ? venture.getTitle() : "Unknown Product";
                if (venture.getOwner() != null) {
                    data.sellerName = venture.getOwner().getFullName() != null ? venture.getOwner().getFullName() : "Unknown Seller";
                    data.sellerEmail = venture.getOwner().getEmail() != null ? venture.getOwner().getEmail() : "N/A";
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch venture details from MS4 for ventureId {}: {}", ventureId, e.getMessage());
            throw e; // throw to trigger retry
        }

        return data;
    }

    @Recover
    public EnrichedInvoiceData recoverFetchEnrichedData(Exception e, UUID ventureId, String studentId) {
        log.warn("All retries failed while fetching enriched data. Using fallback 'Unknown' data. Error: {}", e.getMessage());
        EnrichedInvoiceData fallback = new EnrichedInvoiceData();
        fallback.ventureTitle = "Unknown Product";
        fallback.buyerName = "Unknown Buyer";
        fallback.buyerEmail = "N/A";
        fallback.sellerName = "Unknown Seller";
        fallback.sellerEmail = "N/A";
        return fallback;
    }
}
