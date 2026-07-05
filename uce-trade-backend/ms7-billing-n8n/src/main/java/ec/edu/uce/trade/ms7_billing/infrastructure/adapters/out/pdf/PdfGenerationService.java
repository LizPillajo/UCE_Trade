package ec.edu.uce.trade.ms7_billing.infrastructure.adapters.out.pdf;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfGenerationService {

    private final TemplateEngine templateEngine;

    public String generatePdf(UUID invoiceId, UUID ventureId, String studentId, BigDecimal amount) {
        log.info("Generating PDF for Invoice ID: {}", invoiceId);
        Context context = new Context();
        context.setVariable("invoiceId", invoiceId.toString());
        context.setVariable("ventureId", ventureId.toString());
        context.setVariable("studentId", studentId);
        context.setVariable("amount", amount);
        context.setVariable("date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

        String htmlContent = templateEngine.process("invoice", context);
        
        try {
            // In a real app, this would be uploaded to S3/Supabase.
            // For now, we save it locally to a temp directory and return a fake URL or local path.
            File pdfFile = File.createTempFile("invoice-" + invoiceId, ".pdf");
            try (OutputStream os = new FileOutputStream(pdfFile)) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.useFastMode();
                builder.withHtmlContent(htmlContent, "file:///");
                builder.toStream(os);
                builder.run();
            }
            log.info("PDF generated successfully at {}", pdfFile.getAbsolutePath());
            return pdfFile.getAbsolutePath(); // Return local path for now
        } catch (Exception e) {
            log.error("Failed to generate PDF", e);
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}
