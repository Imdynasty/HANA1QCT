package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.DomesticStockDTO;
import hanasecurities.hanact.service.DomesticStockIndustryService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/domestic/analysis")
public class DomesticAnalysisController {

  @Autowired
  private DomesticStockIndustryService domesticStockIndustryService;

  @GetMapping("/{customerId}/favorite-industries")
  public ResponseEntity<List<DomesticStockDTO>> getFavoriteIndustries(@PathVariable String customerId) {
    List<DomesticStockDTO> industries = domesticStockIndustryService.getFavoriteIndustries(customerId);
    return ResponseEntity.ok(industries);
  }

  @GetMapping("/top/{accountId}/top-investment")
  public ResponseEntity<List<DomesticStockDTO>> getTopInvestmentIndustries(@PathVariable String accountId) {
    List<DomesticStockDTO> industries = domesticStockIndustryService.getTopInvestmentIndustries(accountId);
    return ResponseEntity.ok(industries);
  }


}
