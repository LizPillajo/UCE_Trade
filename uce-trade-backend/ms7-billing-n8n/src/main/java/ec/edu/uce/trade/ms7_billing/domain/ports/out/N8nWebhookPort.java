package ec.edu.uce.trade.ms7_billing.domain.ports.out;

import ec.edu.uce.trade.ms7_billing.domain.model.Invoice;

public interface N8nWebhookPort {
    void sendInvoiceEmail(Invoice invoice);
}
