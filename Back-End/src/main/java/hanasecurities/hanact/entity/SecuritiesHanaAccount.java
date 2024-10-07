package hanasecurities.hanact.entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Data;

@Entity
@Table(name = "SECURITIES_HANA_ACCOUNTS")
@Data
public class SecuritiesHanaAccount {

  @Id
  @Column(name = "ACCOUNT_ID", nullable = false, length = 200)
  private String accountId;

  @Column(name = "CUSTOMER_ID", nullable = false, length = 200)
  private String customerId;

  @Column(name = "FINANCIAL_COMPANY", length = 255, nullable = false)
  private String financialCompany = "HANAW";

  @Column(name = "ACCOUNT_NUMBER", length = 50)
  private String accountNumber;

  @Column(name = "CASH")
  private BigDecimal cash;

  @Column(name = "DOLLAR")
  private BigDecimal dollar;

  @Column(name = "TOTAT_ASSETS")
  private BigDecimal totalAssets;



  // Getters and setters
}
