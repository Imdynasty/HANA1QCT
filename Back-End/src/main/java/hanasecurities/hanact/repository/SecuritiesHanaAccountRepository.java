package hanasecurities.hanact.repository;


import hanasecurities.hanact.entity.SecuritiesHanaAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecuritiesHanaAccountRepository extends
    JpaRepository<SecuritiesHanaAccount, String> {
}
