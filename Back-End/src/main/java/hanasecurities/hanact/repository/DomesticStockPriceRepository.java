package hanasecurities.hanact.repository;


import hanasecurities.hanact.entity.DomesticStockPrice;

import hanasecurities.hanact.entity.DomesticStockPriceId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DomesticStockPriceRepository extends JpaRepository<DomesticStockPrice, DomesticStockPriceId> {
  List<DomesticStockPrice> findByStockcode(String stockcode);
}

