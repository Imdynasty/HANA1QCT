package hanasecurities.hanact.service;


import hanasecurities.hanact.dto.OverseasStockDTO;
import hanasecurities.hanact.entity.OverseasStock;
import hanasecurities.hanact.entity.SecuritiesCustomer;
import hanasecurities.hanact.repository.OverseasStockRepository;
import hanasecurities.hanact.repository.SecuritiesCustomerRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
@Service
public class OverseasStockService {

  @Autowired
  OverseasStockRepository overseasStockRepository;

  @Autowired
  private SecuritiesCustomerRepository securitiesCustomerRepository;

  public List<OverseasStock> getAllStockCodes() {
    return overseasStockRepository.findAll();
  }

  public List<OverseasStockDTO> findStocksByMarketCapitalization(String customerId) {
    // 1. 고객의 market_capitalization 값을 가져옴
    SecuritiesCustomer customer = securitiesCustomerRepository.findById(customerId).orElse(null);

    if (customer == null) {
      throw new IllegalArgumentException("Customer not found");
    }

    Double marketCapitalization = customer.getMarketCapitalizationOverseas();

    // 2. 해당 market_capitalization 이상인 issuedShares를 가진 DomesticStock을 찾음
    List<OverseasStock> stocks = overseasStockRepository.findAll();

    return stocks.stream()
        .filter(stock -> stock.getIssuedShares() >= marketCapitalization)
        .map(stock -> new OverseasStockDTO(
            stock.getStockCode(),
            stock.getStockName(),
            stock.getIndustry(),
            stock.getIssuedShares()
        ))
        .collect(Collectors.toList());
  }


}
