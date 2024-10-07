package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.SecuritiesHanaAccountDTO;
import hanasecurities.hanact.service.SecuritiesHanaAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accounts")
public class SecuritiesHanaAccountController {

  @Autowired
  private SecuritiesHanaAccountService service;

  @GetMapping("/{accountId}")
  public SecuritiesHanaAccountDTO getAccountById(@PathVariable String accountId) {
    return service.getAccountById(accountId);
  }
}

