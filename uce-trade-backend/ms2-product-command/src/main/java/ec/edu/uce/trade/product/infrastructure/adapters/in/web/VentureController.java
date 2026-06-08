package ec.edu.uce.trade.product.infrastructure.adapters.in.web;

import ec.edu.uce.trade.product.application.usecases.CreateVentureUseCase;
import ec.edu.uce.trade.product.domain.model.Venture;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ventures")
public class VentureController {

    private final CreateVentureUseCase createVentureUseCase;

    public VentureController(CreateVentureUseCase createVentureUseCase) {
        this.createVentureUseCase = createVentureUseCase;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Venture> createVenture(
            @ModelAttribute Venture venture, 
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        
        Venture createdVenture = createVentureUseCase.execute(venture, file);
        return ResponseEntity.status(201).body(createdVenture);
    }
}
