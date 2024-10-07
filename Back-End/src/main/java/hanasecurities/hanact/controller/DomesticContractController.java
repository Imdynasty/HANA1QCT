package hanasecurities.hanact.controller;


import hanasecurities.hanact.dto.DomesticCancelContractDTO;
import hanasecurities.hanact.dto.DomesticContractDTO;
import hanasecurities.hanact.service.DomesticContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/domestic/contracts")
public class DomesticContractController {

  @Autowired
  private DomesticContractService contractService;

  @GetMapping
  public List<DomesticContractDTO> getAllContracts() {
    return contractService.getAllContracts();
  }


  @GetMapping("/cancel")
  public List<DomesticCancelContractDTO> getAllCancelContracts() {
    return contractService.getAllCancelContracts();
  }

  // 다른 API 메서드 (추가, 수정, 삭제)
}
