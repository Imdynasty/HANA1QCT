package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.SecuritiesExchangeRateDto;
import hanasecurities.hanact.entity.SecuritiesExchangeRate;
import hanasecurities.hanact.repository.SecuritiesExchangeRateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SecuritiesExchangeRateService {

  @Autowired
  private SecuritiesExchangeRateRepository repository;

  public List<SecuritiesExchangeRateDto> getAllExchangeRates() {
    List<SecuritiesExchangeRate> rates = repository.findAllByOrderByRateDateAsc();
    return rates.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  private SecuritiesExchangeRateDto convertToDto(SecuritiesExchangeRate rate) {
    SecuritiesExchangeRateDto dto = new SecuritiesExchangeRateDto();
    dto.setRateDate(rate.getRateDate());
    dto.setBuyRate(rate.getBuyRate());
    dto.setSellRate(rate.getSellRate());
    dto.setSendRate(rate.getSendRate());
    dto.setReceiveRate(rate.getReceiveRate());
    dto.setForeignCheckRate(rate.getForeignCheckRate());
    dto.setTradingStandardRate(rate.getTradingStandardRate());
    dto.setChangeRate(rate.getChangeRate());
    dto.setExchangeFee(rate.getExchangeFee());
    dto.setUsdConversionRate(rate.getUsdConversionRate());
    return dto;
  }
}
