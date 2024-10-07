package hanasecurities.hanact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OverseasStockDTO {
  private String stockCode;
  private String stockName;
  private String industry;
  private Double issuedShares;


}
