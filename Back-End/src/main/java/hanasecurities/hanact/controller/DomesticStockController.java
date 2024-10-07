package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.DomesticStockDTO;
import hanasecurities.hanact.entity.DomesticStock;
import hanasecurities.hanact.service.DomesticStockService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hana/domesticstock")
public class DomesticStockController {

  @Autowired
  private DomesticStockService domesticStockService;

  @GetMapping
  public List<DomesticStockDTO> getAllStockCodes() {
    List<DomesticStock> stockCodes = domesticStockService.getAllStockCodes();
    return stockCodes.stream().map(this::convertToDTO).collect(Collectors.toList());
  }



  private DomesticStockDTO convertToDTO(  DomesticStock domesticStock) {
    DomesticStockDTO dto = new DomesticStockDTO();
    dto.setStockCode(domesticStock.getStockCode());
    dto.setStockName(domesticStock.getStockName());
    dto.setIndustry(domesticStock.getIndustry());
    dto.setIssuedShares(domesticStock.getIssuedShares());
    return dto;
  }

  @GetMapping("/{customerId}/by-capitalization")
  public ResponseEntity<List<DomesticStockDTO>> findStocksByMarketCapitalization(@PathVariable String customerId) {
    List<DomesticStockDTO> stocks = domesticStockService.findStocksByMarketCapitalization(customerId);
    return ResponseEntity.ok(stocks);
  }
}
