package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.DomesticFavorite;
import hanasecurities.hanact.entity.OverseasFavorite;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OverseasStockFavoriteRepository extends JpaRepository<OverseasFavorite, Long> {
 List<OverseasFavorite> findByCustomerId(String customerId);

 OverseasFavorite findByCustomerIdAndStockCode(String customerId, String stockCode);
}
