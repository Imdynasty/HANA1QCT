package hanasecurities.hanact.controller;

import hanasecurities.hanact.dto.SecuritiesCustomerDTO;
import hanasecurities.hanact.entity.SecuritiesCustomer;
import hanasecurities.hanact.service.SecuritiesCustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/customers")
public class SecuritiesCustomerController {

  @Autowired
  private SecuritiesCustomerService service;

  @GetMapping("/{customerId}")
  public SecuritiesCustomerDTO getCustomerById(@PathVariable String customerId) {
return service.getCustomerById(customerId);
  }

  @PostMapping("/{customerId}/update")
  public ResponseEntity<SecuritiesCustomer> updateMarketCapitalization(@PathVariable String customerId, @RequestParam
      ("newMarketCapitalization") Double newMarketCapitalization) {
    SecuritiesCustomer updatedCustomer = service.updateMarketCapitalization(customerId, newMarketCapitalization);
    return ResponseEntity.ok(updatedCustomer);
  }

  @PostMapping("/{customerId}/overseasupdate")
  public ResponseEntity<SecuritiesCustomer> updateMarketCapitalizationOverseas(@PathVariable String customerId, @RequestParam
      ("newMarketCapitalization") Double newMarketCapitalization) {
    SecuritiesCustomer updatedCustomer = service.updateMarketCapitalizationOverseas(customerId, newMarketCapitalization);
    return ResponseEntity.ok(updatedCustomer);
  }
}




