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
public class OverseasStockPriceId implements Serializable {
  private String stockcode;
  private Date tradingDate;

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    OverseasStockPriceId that = (OverseasStockPriceId) o;
    return Objects.equals(stockcode, that.stockcode) && Objects.equals(
        tradingDate, that.tradingDate);
  }

  @Override
  public int hashCode() {
    return Objects.hash(stockcode, tradingDate);
  }
}
