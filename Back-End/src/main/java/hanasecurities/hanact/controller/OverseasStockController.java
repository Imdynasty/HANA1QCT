package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.DomesticStockDTO;
import hanasecurities.hanact.dto.OverseasStockDTO;
import hanasecurities.hanact.entity.DomesticStock;
import hanasecurities.hanact.entity.OverseasStock;
import hanasecurities.hanact.service.DomesticStockService;
import hanasecurities.hanact.service.OverseasStockService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hana/overseasstock")
public class OverseasStockController {

  @Autowired
  private OverseasStockService overseasStockService;

  @GetMapping
  public List<OverseasStockDTO> getAllStockCodes() {
    List<OverseasStock> stockCodes = overseasStockService.getAllStockCodes();
    return stockCodes.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  private OverseasStockDTO convertToDTO(  OverseasStock overseasStock) {
    OverseasStockDTO dto = new OverseasStockDTO();
    dto.setStockCode(overseasStock.getStockCode());
    dto.setStockName(overseasStock.getStockName());
    dto.setIndustry(overseasStock.getIndustry());
    dto.setIssuedShares(overseasStock.getIssuedShares());
    return dto;
  }

  @GetMapping("/{customerId}/by-capitalization")
  public ResponseEntity<List<OverseasStockDTO> >findStocksByMarketCapitalization(@PathVariable String customerId) {
    List<OverseasStockDTO> stocks = overseasStockService.findStocksByMarketCapitalization(customerId);
    return ResponseEntity.ok(stocks);
  }
}
