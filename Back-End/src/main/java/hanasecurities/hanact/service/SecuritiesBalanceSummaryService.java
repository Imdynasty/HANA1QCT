package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.SecuritiesBalanceSummaryDTO;
import hanasecurities.hanact.entity.SecuritiesBalanceSummary;
import hanasecurities.hanact.repository.SecuritiesBalanceSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class SecuritiesBalanceSummaryService {

  @Autowired
  private SecuritiesBalanceSummaryRepository repository;



  public SecuritiesBalanceSummaryDTO getBalanceSummaryByAccountId(String accountId) {
    Optional<SecuritiesBalanceSummary> balanceSummary = repository.findByAccountId(accountId);
    return balanceSummary.map(this::convertToDto).orElse(null);
  }

  private SecuritiesBalanceSummaryDTO convertToDto(SecuritiesBalanceSummary balance) {
    SecuritiesBalanceSummaryDTO dto = new SecuritiesBalanceSummaryDTO();
    dto.setAccountId(balance.getAccountId());
    dto.setTotEvluAmt(balance.getTotEvluAmt());
    dto.setPchsAmtSmtlAmt(balance.getPchsAmtSmtlAmt());
    dto.setEvluAmtSmtlAmt(balance.getEvluAmtSmtlAmt());
    dto.setEvluPflsSmtlAmt(balance.getEvluPflsSmtlAmt());
    dto.setDncaTotAmt(balance.getDncaTotAmt());
    dto.setNxdyExccAmt(balance.getNxdyExccAmt());
    dto.setPrvsRcdlExccAmt(balance.getPrvsRcdlExccAmt());
    return dto;
  }
}