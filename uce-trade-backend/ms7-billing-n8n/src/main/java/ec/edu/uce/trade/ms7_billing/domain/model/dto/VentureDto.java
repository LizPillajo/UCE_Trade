package ec.edu.uce.trade.ms7_billing.domain.model.dto;

import lombok.Data;

@Data
public class VentureDto {
    private String id;
    private String studentId;
    private String title;
    private Double price;
    private OwnerDto owner;

    @Data
    public static class OwnerDto {
        private String id;
        private String fullName;
        private String email;
    }
}
