package hanasecurities.hanact.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecuritiesOverseasBalanceDto {

  private String accountId;
  private String ovrsPdno;
  private String ovrsItemName;
  private Double frcrEvluPflsAmt;
  private Double evluPflsRt;
  private Double pchsAvgPric;
  private Double ovrsStckEvluAmt;
  private Double frcrPchsAmt1;
  private Double nowPric2;
  private BigDecimal ovrsCblcQty;

  // Getters and Setters
}
