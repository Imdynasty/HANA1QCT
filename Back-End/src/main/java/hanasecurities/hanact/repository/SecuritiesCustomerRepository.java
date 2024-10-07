package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.SecuritiesCustomer;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecuritiesCustomerRepository extends JpaRepository<SecuritiesCustomer, String> {

    //findByCustomerId

}
