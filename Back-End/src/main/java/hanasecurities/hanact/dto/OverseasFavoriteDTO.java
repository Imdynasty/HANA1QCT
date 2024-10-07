package hanasecurities.hanact.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OverseasFavoriteDTO {
  private String stockName;
  private String stockCode;
}
