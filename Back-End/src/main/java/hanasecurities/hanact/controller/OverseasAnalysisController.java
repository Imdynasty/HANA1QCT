package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.OverseasStockDTO;
import hanasecurities.hanact.service.OverseasStockIndustryService;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/overseas/analysis")
public class OverseasAnalysisController {

    @Autowired
  private OverseasStockIndustryService overseasStockIndustryService;

    @GetMapping("/{customerId}/favorite-industries")
    public ResponseEntity<List<OverseasStockDTO>> getFavoriteIndustries(@PathVariable String customerId) {
        List<OverseasStockDTO> industries = overseasStockIndustryService.getFavoriteIndustries(customerId);
        return ResponseEntity.ok(industries);
    }

    @GetMapping("/top/{accountId}/top-investment")
    public ResponseEntity<List<OverseasStockDTO>> getTopInvestmentIndustries(@PathVariable String accountId) {
        List<OverseasStockDTO> industries = overseasStockIndustryService.getTopInvestmentIndustries(accountId);
        return ResponseEntity.ok(industries);
    }
}
