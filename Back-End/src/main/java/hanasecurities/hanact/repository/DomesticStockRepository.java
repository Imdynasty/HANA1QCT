package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.DomesticStock;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DomesticStockRepository extends JpaRepository<DomesticStock, String> {

}
