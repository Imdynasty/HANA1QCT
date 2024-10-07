package hanasecurities.hanact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OverseasStockPriceDifferenceDTO {

  private long volumeDifference;
  private double closePriceDifference;
}
