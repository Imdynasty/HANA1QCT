package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.DomesticStock;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SearchDomesticRepository extends JpaRepository<DomesticStock, String> {
 List<DomesticStock> findByStockName(String name);
}
