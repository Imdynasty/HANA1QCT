package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.SecuritiesOverseasBalance;
import hanasecurities.hanact.entity.SecuritiesOverseasBalanceId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecuritiesOverseasBalanceRepository extends JpaRepository<SecuritiesOverseasBalance, SecuritiesOverseasBalanceId>{

  List<SecuritiesOverseasBalance> findByAccountId(String accountId);
}
