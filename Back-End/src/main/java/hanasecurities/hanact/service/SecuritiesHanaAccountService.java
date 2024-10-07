package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.SecuritiesHanaAccountDTO;
import hanasecurities.hanact.repository.SecuritiesHanaAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SecuritiesHanaAccountService {

  @Autowired
  private SecuritiesHanaAccountRepository repository;

  public SecuritiesHanaAccountDTO getAccountById(String accountId) {
    return repository.findById(accountId)
        .map(account -> new SecuritiesHanaAccountDTO(
            account.getAccountId(),
            account.getCustomerId(),
            account.getFinancialCompany(),
            account.getAccountNumber(),
            account.getCash(),
            account.getDollar(),
            account.getTotalAssets()))
        .orElse(null);
  }
}