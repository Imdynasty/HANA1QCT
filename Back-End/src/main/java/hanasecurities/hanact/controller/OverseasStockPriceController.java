package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.OverseasStockPriceDTO;
import hanasecurities.hanact.dto.OverseasStockPriceDifferenceDTO;
import hanasecurities.hanact.service.OverseasStockPriceService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hanact/overseasstockprices")
public class OverseasStockPriceController {
    @Autowired
    private OverseasStockPriceService service;

    @GetMapping
    public ResponseEntity<List<OverseasStockPriceDTO>> getStockPricesByCode(@RequestParam String stockcode) {
        List<OverseasStockPriceDTO> stockPrices = service.getStockPricesByCode(stockcode);
        if (stockPrices.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(stockPrices);
    }

    @GetMapping("/{stockCode}/price-difference")
    public ResponseEntity<OverseasStockPriceDifferenceDTO> getStockPriceDifference(@PathVariable String stockCode) {
        OverseasStockPriceDifferenceDTO differenceDTO = service.getStockPriceDifference(stockCode);

        if (differenceDTO == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(differenceDTO);
    }
}
