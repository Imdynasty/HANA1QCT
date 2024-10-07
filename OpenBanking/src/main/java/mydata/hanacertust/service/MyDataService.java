package mydata.hanacertust.service;

import jakarta.transaction.Transactional;
import mydata.hanacertust.entity.MyDataAccount;
import mydata.hanacertust.entity.MyDataCI;
import mydata.hanacertust.repository.MyDataCIRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import  mydata.hanacertust.repository.MyDataAccountRepository;
import java.util.*;

@Service
@Transactional
public class MyDataService {
  private static final Logger log = LoggerFactory.getLogger(MyDataService.class);
  @Autowired
  private MyDataCIRepository ciRepository;

  @Autowired
  private MyDataAccountRepository accountRepository;


  public List<MyDataAccount> getAccountsByResidentNumber(String residentNumber) {
    Optional<MyDataCI> ci = ciRepository.findByResidentNumber(residentNumber);
    if (ci.isPresent()) {
      List<MyDataAccount> accounts = accountRepository.findByMyDataCI(ci.get());
      return accounts;
    } else {
      return new ArrayList<>();
    }
  }
}

