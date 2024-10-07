package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.HanaAccountUpdateRequestDTO;
import hanasecurities.hanact.dto.SecuritiesHanaAccountDTO;
import hanasecurities.hanact.service.HanaAccountUpdateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hana")
public class HanaAccountUpdateController {
  @Autowired
  private HanaAccountUpdateService service;

  // POST 매핑으로 변경
  private static final Logger log = LoggerFactory.getLogger(HanaAccountUpdateController.class);

  @PostMapping("/{accountId}/addCash")
  public ResponseEntity<SecuritiesHanaAccountDTO> addCashToAccount(@PathVariable String accountId, @RequestBody HanaAccountUpdateRequestDTO request) {
    log.info("Received request for account ID: {}", accountId);
    SecuritiesHanaAccountDTO updatedAccount = service.addCash(accountId, request.getAdditionalCash());
    return ResponseEntity.ok(updatedAccount);
  }
}
