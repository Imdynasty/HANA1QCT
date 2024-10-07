package hanasecurities.hanact.service;


import hanasecurities.hanact.dto.SecuritiesDomesticBalancesDTO;
import hanasecurities.hanact.entity.SecuritiesDomesticBalances;
import hanasecurities.hanact.repository.SecuritiesDomesticBalancesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SecuritiesDomesticBalancesService {

  @Autowired
  private SecuritiesDomesticBalancesRepository repository;

  public List<SecuritiesDomesticBalancesDTO> getBalancesByAccountId(String accountId) {
    List<SecuritiesDomesticBalances> balances = repository.findByAccountId(accountId);
    return balances.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  private SecuritiesDomesticBalancesDTO convertToDto(SecuritiesDomesticBalances balance) {
    SecuritiesDomesticBalancesDTO dto = new SecuritiesDomesticBalancesDTO();
    dto.setAccountId(balance.getAccountId());
    dto.setPdno(balance.getPdno());
    dto.setHldgQty(balance.getHldgQty());
    dto.setFlttRt(balance.getFlttRt());
    dto.setPchsAmt(balance.getPchsAmt());
    dto.setEvluPflsRt(balance.getEvluPflsRt());
    dto.setEvluPflsAmt(balance.getEvluPflsAmt());
    dto.setPrdtName(balance.getPrdtName());
    dto.setPrpr(balance.getPrpr());
    dto.setPchsAvgPric(balance.getPchsAvgPric());
    return dto;
  }
}