package ec.edu.uce.trade.ms7_billing.infrastructure.adapters.out.n8n;

import ec.edu.uce.trade.ms7_billing.domain.model.Invoice;
import ec.edu.uce.trade.ms7_billing.domain.ports.out.N8nWebhookPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class N8nWebhookAdapter implements N8nWebhookPort {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${n8n.webhook.url:http://localhost:5678/webhook/invoice}")
    private String n8nWebhookUrl;

    @Override
    public void sendInvoiceEmail(Invoice invoice) {
        log.info("Sending invoice to n8n webhook for email dispatch. Invoice ID: {}", invoice.getId());
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = new HashMap<>();
            payload.put("invoiceId", invoice.getId().toString());
            payload.put("studentId", invoice.getStudentId());
            payload.put("ventureId", invoice.getVentureId().toString());
            payload.put("amount", invoice.getAmount());
            payload.put("pdfUrl", invoice.getPdfUrl());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            
            log.debug("N8n Webhook Payload: {}", payload);
            log.info("Executing POST request to N8n URL: {}", n8nWebhookUrl);
            restTemplate.postForEntity(n8nWebhookUrl, request, String.class);
            log.info("Successfully triggered n8n workflow for invoice {}. Email dispatch initiated.", invoice.getId());
        } catch (Exception e) {
            log.error("CRITICAL: Failed to send invoice to n8n webhook at {}. Payload was for Invoice ID: {}. Cause: {}", n8nWebhookUrl, invoice.getId(), e.getMessage(), e);
        }
    }
}
