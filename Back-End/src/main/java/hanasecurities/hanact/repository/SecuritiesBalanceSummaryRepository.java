package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.SecuritiesBalanceSummary;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecuritiesBalanceSummaryRepository extends
    JpaRepository<SecuritiesBalanceSummary, String> {
  Optional<SecuritiesBalanceSummary> findByAccountId(String accountId);
}