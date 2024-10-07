package hanasecurities.hanact.dto;



import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecuritiesExchangeRateDto {
  private Date rateDate;
  private Double buyRate;
  private Double sellRate;
  private Double sendRate;
  private Double receiveRate;
  private Double foreignCheckRate;
  private Double tradingStandardRate;
  private Double changeRate;
  private Double exchangeFee;
  private Double usdConversionRate;

  // Getters and Setters
}

