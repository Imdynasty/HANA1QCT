package hanasecurities.hanact.service;



import hanasecurities.hanact.dto.SecuritiesOverseasBalanceDto;
import hanasecurities.hanact.entity.SecuritiesOverseasBalance;
import hanasecurities.hanact.entity.SecuritiesOverseasBalanceId;
import hanasecurities.hanact.repository.SecuritiesOverseasBalanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SecuritiesOverseasBalanceService {

  @Autowired
  private SecuritiesOverseasBalanceRepository repository;

  public List<SecuritiesOverseasBalanceDto> getAllBalances() {
    return repository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
  }

  public Optional<SecuritiesOverseasBalanceDto> getBalanceById(String accountId, String ovrsPdno) {
    Optional<SecuritiesOverseasBalance> balance = repository.findById(new SecuritiesOverseasBalanceId(accountId, ovrsPdno));
    return balance.map(this::convertToDto);
  }

  public SecuritiesOverseasBalanceDto createOrUpdateBalance(SecuritiesOverseasBalanceDto dto) {
    SecuritiesOverseasBalance balance = convertToEntity(dto);
    balance = repository.save(balance);
    return convertToDto(balance);
  }

  public void deleteBalance(String accountId, String ovrsPdno) {
    repository.deleteById(new SecuritiesOverseasBalanceId(accountId, ovrsPdno));
  }

  private SecuritiesOverseasBalanceDto convertToDto(SecuritiesOverseasBalance entity) {
    SecuritiesOverseasBalanceDto dto = new SecuritiesOverseasBalanceDto();
    dto.setAccountId(entity.getAccountId());
    dto.setOvrsPdno(entity.getOvrsPdno());
    dto.setOvrsItemName(entity.getOvrsItemName());
    dto.setFrcrEvluPflsAmt(entity.getFrcrEvluPflsAmt());
    dto.setEvluPflsRt(entity.getEvluPflsRt());
    dto.setPchsAvgPric(entity.getPchsAvgPric());
    dto.setOvrsStckEvluAmt(entity.getOvrsStckEvluAmt());
    dto.setFrcrPchsAmt1(entity.getFrcrPchsAmt1());
    dto.setNowPric2(entity.getNowPric2());
    dto.setOvrsCblcQty(entity.getOvrsCblcQty());
    return dto;
  }

  private SecuritiesOverseasBalance convertToEntity(SecuritiesOverseasBalanceDto dto) {
    SecuritiesOverseasBalance entity = new SecuritiesOverseasBalance();
    entity.setAccountId(dto.getAccountId());
    entity.setOvrsPdno(dto.getOvrsPdno());
    entity.setOvrsItemName(dto.getOvrsItemName());
    entity.setFrcrEvluPflsAmt(dto.getFrcrEvluPflsAmt());
    entity.setEvluPflsRt(dto.getEvluPflsRt());
    entity.setPchsAvgPric(dto.getPchsAvgPric());
    entity.setOvrsStckEvluAmt(dto.getOvrsStckEvluAmt());
    entity.setFrcrPchsAmt1(dto.getFrcrPchsAmt1());
    entity.setNowPric2(dto.getNowPric2());
    entity.setOvrsCblcQty(dto.getOvrsCblcQty());
    return entity;
  }
}
