package hanasecurities.hanact.controller;

import hanasecurities.hanact.dto.SecuritiesBalanceSummaryDTO;
import hanasecurities.hanact.dto.SecuritiesDomesticBalancesDTO;
import hanasecurities.hanact.service.SecuritiesBalanceSummaryService;
import hanasecurities.hanact.service.SecuritiesDomesticBalancesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/balances/domestic")
public class SecuritiesDomesticBalancesController {

  @Autowired
  private SecuritiesDomesticBalancesService service;

  @GetMapping("/{accountId}")
  public List<SecuritiesDomesticBalancesDTO> getBalances(@PathVariable String accountId) {
    return service.getBalancesByAccountId(accountId);
  }

  @Autowired
  private SecuritiesBalanceSummaryService summaryservice;

  @GetMapping("/summary/{accountId}")
  public SecuritiesBalanceSummaryDTO getBalanceSummary(@PathVariable String accountId) {
    return summaryservice.getBalanceSummaryByAccountId(accountId);
  }
}

