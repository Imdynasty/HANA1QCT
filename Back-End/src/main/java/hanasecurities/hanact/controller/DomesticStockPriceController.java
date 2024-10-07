package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.DomesticStockPriceDTO;
import hanasecurities.hanact.dto.StockPriceDifferenceDTO;
import hanasecurities.hanact.service.DomesticStockPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hanact/domesticstockprices")
public class DomesticStockPriceController {

  @Autowired
  private DomesticStockPriceService service;

  @GetMapping
  public ResponseEntity<List<DomesticStockPriceDTO>> getStockPricesByCode(@RequestParam String stockcode) {
    List<DomesticStockPriceDTO> stockPrices = service.getStockPricesByCode(stockcode);
    if (stockPrices.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(stockPrices);
  }
  @GetMapping("/{stockCode}/price-difference")
  public ResponseEntity<StockPriceDifferenceDTO> getStockPriceDifference(@PathVariable String stockCode) {
    StockPriceDifferenceDTO differenceDTO = service.getStockPriceDifference(stockCode);

    if (differenceDTO == null) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(differenceDTO);
  }
}
