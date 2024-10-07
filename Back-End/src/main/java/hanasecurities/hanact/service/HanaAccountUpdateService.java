package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.SecuritiesHanaAccountDTO;
import hanasecurities.hanact.entity.SecuritiesHanaAccount;
import hanasecurities.hanact.repository.HanaAccountUpdateRepository;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class HanaAccountUpdateService {

  @Autowired
  private HanaAccountUpdateRepository repository;

  public SecuritiesHanaAccountDTO addCash(String accountId, BigDecimal additionalCash) {
    SecuritiesHanaAccount account = repository.findByAccountId(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found:  " + accountId));
    account.setCash(account.getCash().add(additionalCash));
    repository.save(account);
    return new SecuritiesHanaAccountDTO(account);
  }
}
