package hanasecurities.hanact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DomesticStockPriceDTO {
  private String stockcode;
  private Date tradingDate;
  private Double closePrice;
  private Double openPrice;
  private Double highPrice;
  private Double lowPrice;
  private Long volume;
  private Double changePercentage;
}
