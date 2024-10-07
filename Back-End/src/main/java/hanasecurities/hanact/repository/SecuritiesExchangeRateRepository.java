package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.SecuritiesExchangeRate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecuritiesExchangeRateRepository extends
    JpaRepository<SecuritiesExchangeRate, String> {
  List<SecuritiesExchangeRate> findAllByOrderByRateDateAsc();

}
