package ec.edu.uce.trade.ms6_payments.domain.ports.out;

import ec.edu.uce.trade.ms6_payments.domain.model.Payment;

public interface PaymentEventPort {
    void publishPaymentSuccess(Payment payment);
}