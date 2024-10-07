package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.DomesticCancelContract;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DomesticCancelContractRepository extends
    JpaRepository<DomesticCancelContract, String> {

}
