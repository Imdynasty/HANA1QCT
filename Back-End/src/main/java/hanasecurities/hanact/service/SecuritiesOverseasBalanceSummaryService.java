package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.SecuritiesOverseasBalanceSummaryDTO;
import hanasecurities.hanact.entity.SecuritiesOverseasBalanceSummary;
import hanasecurities.hanact.repository.SecuritiesOverseasBalanceSummaryRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SecuritiesOverseasBalanceSummaryService {

  @Autowired
  private SecuritiesOverseasBalanceSummaryRepository repository;

  public Optional<SecuritiesOverseasBalanceSummaryDTO> getSummaryByAccountId(String accountId) {
    Optional<SecuritiesOverseasBalanceSummary> summaryOpt = repository.findById(accountId);
    if (summaryOpt.isPresent()) {
      SecuritiesOverseasBalanceSummary summary = summaryOpt.get();
      SecuritiesOverseasBalanceSummaryDTO dto = new SecuritiesOverseasBalanceSummaryDTO();
      dto.setAccountId(summary.getAccountId());
      dto.setOvrsTotPfls(summary.getOvrsTotPfls());
      dto.setTotPftrt(summary.getTotPftrt());
      dto.setFrcrBuyAmtSmtl1(summary.getFrcrBuyAmtSmtl1());
      dto.setTotAsstAmt(summary.getTotAsstAmt());
      dto.setEvluAmtSmtl(summary.getEvluAmtSmtl());
      return Optional.of(dto);
    }
    return Optional.empty();
  }

  public SecuritiesOverseasBalanceSummaryDTO updateSummary(SecuritiesOverseasBalanceSummaryDTO dto) {
    SecuritiesOverseasBalanceSummary summary = new SecuritiesOverseasBalanceSummary();
    summary.setAccountId(dto.getAccountId());
    summary.setOvrsTotPfls(dto.getOvrsTotPfls());
    summary.setTotPftrt(dto.getTotPftrt());
    summary.setFrcrBuyAmtSmtl1(dto.getFrcrBuyAmtSmtl1());
    summary.setTotAsstAmt(dto.getTotAsstAmt());
    summary.setEvluAmtSmtl(dto.getEvluAmtSmtl());

    repository.save(summary);
    return dto;
  }
}