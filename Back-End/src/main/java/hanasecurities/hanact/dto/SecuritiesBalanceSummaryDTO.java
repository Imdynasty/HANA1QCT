package hanasecurities.hanact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecuritiesBalanceSummaryDTO {
  private String accountId;
  private String totEvluAmt;
  private String pchsAmtSmtlAmt;
  private String evluAmtSmtlAmt;
  private String evluPflsSmtlAmt;
  private String dncaTotAmt;
  private String nxdyExccAmt;
  private String prvsRcdlExccAmt;
}