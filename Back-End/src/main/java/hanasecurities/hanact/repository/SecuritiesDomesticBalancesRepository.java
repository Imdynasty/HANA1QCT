package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.SecuritiesDomesticBalances;
import hanasecurities.hanact.entity.SecuritiesDomesticBalancesId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SecuritiesDomesticBalancesRepository extends JpaRepository<SecuritiesDomesticBalances, SecuritiesDomesticBalancesId> {
  List<SecuritiesDomesticBalances> findByAccountId(String accountId);
}
