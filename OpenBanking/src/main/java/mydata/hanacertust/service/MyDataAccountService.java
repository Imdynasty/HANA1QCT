package mydata.hanacertust.service;

import mydata.hanacertust.entity.MyDataAccount;
import mydata.hanacertust.entity.MyDataCI;
import mydata.hanacertust.repository.MyDataAccountRepository;
import mydata.hanacertust.repository.MyDataCIRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MyDataAccountService {

  private final MyDataAccountRepository accountRepository;
  private final MyDataCIRepository ciRepository;

  @Autowired
  public MyDataAccountService(MyDataAccountRepository accountRepository,
      MyDataCIRepository ciRepository) {
    this.accountRepository = accountRepository;
    this.ciRepository = ciRepository;
  }

  public List<MyDataAccount> findAllAccounts() {
    return accountRepository.findAll();
  }

  public Optional<MyDataCI> findCIById(String ci) {
    return ciRepository.findById(ci);
  }

  public List<MyDataAccount> findAccountsByCI(MyDataCI ci) {
    return accountRepository.findByMyDataCI(ci);
  }
}
