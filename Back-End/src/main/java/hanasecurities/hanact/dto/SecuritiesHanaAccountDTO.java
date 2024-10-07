package hanasecurities.hanact.dto;
import hanasecurities.hanact.entity.SecuritiesHanaAccount;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class SecuritiesHanaAccountDTO {

  private String accountId;
  private String customerId;
  private String financialCompany;
  private String accountNumber;
  private BigDecimal cash;
  private BigDecimal dollar;
  private BigDecimal totalAssets;
  // Constructors
  public SecuritiesHanaAccountDTO() {}

public SecuritiesHanaAccountDTO(SecuritiesHanaAccount account){
    this.accountId = account.getAccountId();
    this.customerId = account.getCustomerId();
    this.financialCompany = account.getFinancialCompany();
    this.accountNumber = account.getAccountNumber();
    this.cash = account.getCash();
    this.dollar = account.getDollar();
    this.totalAssets = account.getTotalAssets();
}

}
