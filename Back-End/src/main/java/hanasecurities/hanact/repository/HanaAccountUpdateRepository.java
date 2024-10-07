package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.SecuritiesHanaAccount;
import java.util.Optional;
import java.util.function.Function;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery;

public interface HanaAccountUpdateRepository extends JpaRepository<SecuritiesHanaAccount, String> {

  //findByAccountId
  Optional<SecuritiesHanaAccount> findByAccountId(String accountId);
}
