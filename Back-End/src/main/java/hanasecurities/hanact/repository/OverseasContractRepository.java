package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.OverseasContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OverseasContractRepository extends JpaRepository<OverseasContract, String> {
  // 주문 번호를 기본 키로 사용
}