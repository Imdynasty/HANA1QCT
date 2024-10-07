package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.DomesticFavorite;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DomesticStockFavoriteRepository extends JpaRepository<DomesticFavorite, Long> {
 List<DomesticFavorite> findByCustomerId(String customerId);

 DomesticFavorite findByCustomerIdAndStockCode(String customerId, String stockCode);
}
