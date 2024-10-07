package hanasecurities.hanact.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OverseasStockPriceDTO {
  private String stockcode;
  private Date tradingDate;
  private Double closePrice;
  private Double openPrice;
  private Double highPrice;
  private Double lowPrice;
  private Long volume;
  private Double changePercentage;
}
