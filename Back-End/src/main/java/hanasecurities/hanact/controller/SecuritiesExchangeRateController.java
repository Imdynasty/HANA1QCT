package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.SecuritiesExchangeRateDto;
import hanasecurities.hanact.service.SecuritiesExchangeRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/securities/exchangerates")
public class SecuritiesExchangeRateController {

  @Autowired
  private SecuritiesExchangeRateService service;

  @GetMapping
  public List<SecuritiesExchangeRateDto> getAllExchangeRates() {
    return service.getAllExchangeRates();
  }
}

