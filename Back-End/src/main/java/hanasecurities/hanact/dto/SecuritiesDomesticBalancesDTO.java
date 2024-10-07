package hanasecurities.hanact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecuritiesDomesticBalancesDTO {
  private String accountId;
  private String pdno;
  private String hldgQty;
  private String flttRt;
  private String pchsAmt;
  private String evluPflsRt;
  private String evluPflsAmt;
  private String prdtName;
  private String prpr;
  private String pchsAvgPric;

}
