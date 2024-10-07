package hanasecurities.hanact.service;
import hanasecurities.hanact.dto.SecuritiesCustomerDTO;
import hanasecurities.hanact.entity.SecuritiesCustomer;
import hanasecurities.hanact.repository.SecuritiesCustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SecuritiesCustomerService {

  @Autowired
  private SecuritiesCustomerRepository repository;

  public SecuritiesCustomerDTO getCustomerById(String customerId) {
    return repository.findById(customerId).map(customer -> new SecuritiesCustomerDTO(
        customer.getCustomerId(),
        customer.getCustomerPassword(),
        customer.getName(),
        customer.getPhone(),
        customer.getAddress(),
        customer.getEmail(),
        customer.getUserType(),
        customer.getRegistrationDate(),
        customer.getCi(),
        customer.getMarketCapitalization(),
        customer.getMarketCapitalizationOverseas()
    )).orElse(null);

  }

  @Transactional
  public SecuritiesCustomer updateMarketCapitalization(String customerId, Double newMarketCapitalization) {
    SecuritiesCustomer customer = repository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
    customer.setMarketCapitalization(newMarketCapitalization);
    return repository.save(customer);
  }

  @Transactional
  public SecuritiesCustomer updateMarketCapitalizationOverseas(String customerId, Double newMarketCapitalization) {
    SecuritiesCustomer customer = repository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
    customer.setMarketCapitalizationOverseas(newMarketCapitalization);
    return repository.save(customer);
  }
}
