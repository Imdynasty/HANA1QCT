package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.OverseasCancelContractDTO;
import hanasecurities.hanact.dto.OverseasContractDTO;
import hanasecurities.hanact.entity.OverseasCancelContract;
import hanasecurities.hanact.entity.OverseasContract;
import hanasecurities.hanact.repository.OverseasCancelContractRepository;
import hanasecurities.hanact.repository.OverseasContractRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class OverseasContractService {

  @Autowired
  private OverseasContractRepository overseasContractRepository;

  @Autowired
  private OverseasCancelContractRepository overseasCancelContractRepository;

  public List<OverseasContractDTO> getAllContracts() {
    return overseasContractRepository.findAll().stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public OverseasContractDTO convertToDTO(OverseasContract contract) {
    OverseasContractDTO dto = new OverseasContractDTO();
    dto.setOdno(contract.getOdno());
    dto.setOrdDt(contract.getOrdDt());
    dto.setOrdTmd(contract.getOrdTmd());
    dto.setSllBuyDvsnCdName(contract.getSllBuyDvsnCdName());
    dto.setPrdtName(contract.getPrdtName());
    dto.setFtOrdQty(contract.getFtOrdQty());
    dto.setFtCcldQty(contract.getFtCcldQty());
    dto.setFtCcldAmt3(contract.getFtCcldAmt3());
    dto.setPdno(contract.getPdno());
    dto.setFtOrdUnpr3(contract.getFtOrdUnpr3());
    dto.setTrCrcyCd(contract.getTrCrcyCd());
    return dto;
  }

  public List<OverseasCancelContractDTO> getAllCancelContracts() {
    return overseasCancelContractRepository.findAll().stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public OverseasCancelContractDTO convertToDTO(OverseasCancelContract contract){
    OverseasCancelContractDTO dto = new OverseasCancelContractDTO();
    dto.setOdno(contract.getOdno());
    dto.setOrdDt(contract.getOrdDt());
    dto.setOrdTmd(contract.getOrdTmd());
    dto.setSllBuyDvsnCdName(contract.getSllBuyDvsnCdName());
    dto.setPrdtName(contract.getPrdtName());
    dto.setFtOrdQty(contract.getFtOrdQty());
    dto.setFtCcldQty(contract.getFtCcldQty());
    dto.setFtCcldAmt3(contract.getFtCcldAmt3());
    dto.setPdno(contract.getPdno());
    dto.setFtOrdUnpr3(contract.getFtOrdUnpr3());
    dto.setTrCrcyCd(contract.getTrCrcyCd());
    return dto;
  }


  // Other service methods for save, update, delete
}
