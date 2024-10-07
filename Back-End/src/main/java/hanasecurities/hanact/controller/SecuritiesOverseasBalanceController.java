package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.SecuritiesOverseasBalanceDto;
import hanasecurities.hanact.dto.SecuritiesOverseasBalanceSummaryDTO;
import hanasecurities.hanact.service.SecuritiesOverseasBalanceService;
import hanasecurities.hanact.service.SecuritiesOverseasBalanceSummaryService;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/balances/overseas")
public class SecuritiesOverseasBalanceController {

  @Autowired
  private SecuritiesOverseasBalanceService service;

  @Autowired
  private SecuritiesOverseasBalanceSummaryService summaryService;
  @GetMapping
  public ResponseEntity<List<SecuritiesOverseasBalanceDto>> getAllBalances() {
    return ResponseEntity.ok(service.getAllBalances());
  }

  @GetMapping("/{accountId}/{ovrsPdno}")
  public ResponseEntity<SecuritiesOverseasBalanceDto> getBalanceById(
      @PathVariable String accountId,
      @PathVariable String ovrsPdno) {
    Optional<SecuritiesOverseasBalanceDto> balance = service.getBalanceById(accountId, ovrsPdno);
    return balance.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<SecuritiesOverseasBalanceDto> createOrUpdateBalance(@RequestBody SecuritiesOverseasBalanceDto dto) {
    SecuritiesOverseasBalanceDto updatedDto = service.createOrUpdateBalance(dto);
    return ResponseEntity.ok(updatedDto);
  }

  @DeleteMapping("/{accountId}/{ovrsPdno}")
  public ResponseEntity<Void> deleteBalance(@PathVariable String accountId, @PathVariable String ovrsPdno) {
    service.deleteBalance(accountId, ovrsPdno);
    return ResponseEntity.noContent().build();
  }

  //summary
  @GetMapping("/summary/{accountId}")
  public ResponseEntity<SecuritiesOverseasBalanceSummaryDTO> getSummary(@PathVariable String accountId) {
    Optional<SecuritiesOverseasBalanceSummaryDTO> summaryOpt = summaryService.getSummaryByAccountId(accountId);
    return summaryOpt.map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
  //summary
  @PutMapping("/summary/{accountId}")
  public ResponseEntity<SecuritiesOverseasBalanceSummaryDTO> updateSummary(
      @PathVariable String accountId,
      @RequestBody SecuritiesOverseasBalanceSummaryDTO dto) {
    if (!accountId.equals(dto.getAccountId())) {
      return ResponseEntity.badRequest().build();
    }
    SecuritiesOverseasBalanceSummaryDTO updatedDto = summaryService.updateSummary(dto);
    return ResponseEntity.ok(updatedDto);
  }
}