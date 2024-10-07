package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.DomesticStockDTO;
import hanasecurities.hanact.entity.DomesticStock;
import hanasecurities.hanact.entity.SecuritiesCustomer;
import hanasecurities.hanact.repository.DomesticStockRepository;
import hanasecurities.hanact.repository.SearchDomesticRepository;
import hanasecurities.hanact.repository.SecuritiesCustomerRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

@Service
public class DomesticStockService {
  @Autowired
  private DomesticStockRepository stockCodeRepository;

  @Autowired
  private SearchDomesticRepository searchDomesticRepository;

  @Autowired
  private SecuritiesCustomerRepository securitiesCustomerRepository;

  public List<DomesticStock> getAllStockCodes() {
    return stockCodeRepository.findAll();
  }

  public List<DomesticStock> getStocksByQuery(String query) {
    return searchDomesticRepository.findByStockName(query);
  }

  public List<DomesticStockDTO> findStocksByMarketCapitalization(String customerId) {
    // 1. 고객의 market_capitalization 값을 가져옴
    SecuritiesCustomer customer = securitiesCustomerRepository.findById(customerId).orElse(null);

    if (customer == null) {
      throw new IllegalArgumentException("Customer not found");
    }

    Double marketCapitalization = customer.getMarketCapitalization();

    // 2. 해당 market_capitalization 이상인 issuedShares를 가진 DomesticStock을 찾음
    List<DomesticStock> stocks = stockCodeRepository.findAll();

    return stocks.stream()
        .filter(stock -> stock.getIssuedShares() >= marketCapitalization)
        .map(stock -> new DomesticStockDTO(
            stock.getStockCode(),
            stock.getStockName(),
            stock.getIndustry(),
            stock.getIssuedShares()
        ))
        .collect(Collectors.toList());
  }
}
