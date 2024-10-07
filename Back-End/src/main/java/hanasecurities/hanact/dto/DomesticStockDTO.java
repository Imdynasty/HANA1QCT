package hanasecurities.hanact.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class DomesticStockDTO {
  private String stockCode;
  private String stockName;
  private String industry;
  private Double issuedShares;

  public DomesticStockDTO(){

  }

  public DomesticStockDTO(String stockCode, String stockName, String industry,
      Double issuedShares) {
    this.stockCode = stockCode;
    this.stockName = stockName;
    this.industry = industry;
    this.issuedShares = issuedShares;
  }
}
