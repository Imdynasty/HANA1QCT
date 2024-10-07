package hanasecurities.hanact.controller;

import hanasecurities.hanact.dto.DomesticStockDTO;
import hanasecurities.hanact.entity.DomesticStock;
import hanasecurities.hanact.service.DomesticStockService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search")
public class SearchDomesticStockController {

  @Autowired
  private DomesticStockService domesticStockService;


  @GetMapping("/domesticstocks")
  public List<DomesticStock> searchStocks(@RequestParam String query) {
    return domesticStockService.getStocksByQuery(query);
  }


}
