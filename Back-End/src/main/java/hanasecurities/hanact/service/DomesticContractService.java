package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.DomesticCancelContractDTO;
import hanasecurities.hanact.dto.DomesticContractDTO;
import hanasecurities.hanact.entity.DomesticCancelContract;
import hanasecurities.hanact.entity.DomesticContract;
import hanasecurities.hanact.repository.DomesticCancelContractRepository;
import hanasecurities.hanact.repository.DomesticContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DomesticContractService {

  @Autowired
  private DomesticContractRepository contractRepository;

  @Autowired
  private DomesticCancelContractRepository cancelContractRepository;

  public List<DomesticContractDTO> getAllContracts() {
    return contractRepository.findAll().stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public DomesticContractDTO convertToDTO(DomesticContract contract) {
    DomesticContractDTO dto = new DomesticContractDTO();
    dto.setOdno(contract.getOdno());
    dto.setOrdDt(contract.getOrdDt());
    dto.setOrdTmd(contract.getOrdTmd());
    dto.setSllBuyDvsnCdName(contract.getSllBuyDvsnCdName());
    dto.setPrdtName(contract.getPrdtName());
    dto.setOrdQty(contract.getOrdQty());
    dto.setTotCcldQty(contract.getTotCcldQty());
    dto.setTotCcldAmt(contract.getTotCcldAmt());
    dto.setPdno(contract.getPdno());
    dto.setOrdUnpr(contract.getOrdUnpr());
    dto.setAvgPrvs(contract.getAvgPrvs());
    dto.setCcldCndtName(contract.getCcldCndtName());
    return dto;
  }

  public List<DomesticCancelContractDTO> getAllCancelContracts() {
    return cancelContractRepository.findAll().stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public DomesticCancelContractDTO convertToDTO(DomesticCancelContract cancelContract) {
    DomesticCancelContractDTO dto = new DomesticCancelContractDTO();
    dto.setOdno(cancelContract.getOdno());
    dto.setOrdDt(cancelContract.getOrdDt());
    dto.setOrdTmd(cancelContract.getOrdTmd());
    dto.setSllBuyDvsnCdName(cancelContract.getSllBuyDvsnCdName());
    dto.setPrdtName(cancelContract.getPrdtName());
    dto.setOrdQty(cancelContract.getOrdQty());
    dto.setTotCcldQty(cancelContract.getTotCcldQty());
    dto.setTotCcldAmt(cancelContract.getTotCcldAmt());
    dto.setPdno(cancelContract.getPdno());
    dto.setOrdUnpr(cancelContract.getOrdUnpr());
    dto.setAvgPrvs(cancelContract.getAvgPrvs());
    dto.setCcldCndtName(cancelContract.getCcldCndtName());
    return dto;
  }


  // Other service methods for save, update, delete
}
