package hanasecurities.hanact.repository;

import hanasecurities.hanact.entity.OverseasStockPrice;
import hanasecurities.hanact.entity.OverseasStockPriceId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OverseasStockPriceRepository extends
    JpaRepository<OverseasStockPrice, OverseasStockPriceId> {
    List<OverseasStockPrice> findByStockcode(String stockcode);
}
