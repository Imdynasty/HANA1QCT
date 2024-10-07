package hanasecurities.hanact.controller;

import hanasecurities.hanact.dto.OverseasCancelContractDTO;
import hanasecurities.hanact.dto.OverseasContractDTO;
import hanasecurities.hanact.service.OverseasContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/overseas/contracts")
public class OverseasContractController {

  @Autowired
  private OverseasContractService overseasContractService;

  @GetMapping
  public List<OverseasContractDTO> getAllContracts() {
    return overseasContractService.getAllContracts();
  }

  @GetMapping("/cancel")
  public List<OverseasCancelContractDTO> getAllCancelContracts() {
    return overseasContractService.getAllCancelContracts();
  }

  // 다른 API 메서드 (추가, 수정, 삭제)
}
