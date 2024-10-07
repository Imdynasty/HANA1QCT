package hanasecurities.hanact.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DomesticStockPriceId implements Serializable {
  private String stockcode;
  private Date tradingDate;

  @Override
  public int hashCode() {
    return Objects.hash(stockcode, tradingDate);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null || getClass() != obj.getClass()) return false;
    DomesticStockPriceId that = (DomesticStockPriceId) obj;
    return Objects.equals(stockcode, that.stockcode) &&
        Objects.equals(tradingDate, that.tradingDate);
  }
}
