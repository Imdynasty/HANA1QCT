package hanasecurities.hanact.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "SECURITIES_OVERSEAS_BALANCE_SUMMARY")
public class SecuritiesOverseasBalanceSummary {

  @Id
  private String accountId;
  private BigDecimal ovrsTotPfls;
  private BigDecimal totPftrt;
  private BigDecimal frcrBuyAmtSmtl1;
  private BigDecimal totAsstAmt;
  private BigDecimal evluAmtSmtl;

  // Getters and Setters
  public String getAccountId() {
    return accountId;
  }

  public void setAccountId(String accountId) {
    this.accountId = accountId;
  }

  public BigDecimal getOvrsTotPfls() {
    return ovrsTotPfls;
  }

  public void setOvrsTotPfls(BigDecimal ovrsTotPfls) {
    this.ovrsTotPfls = ovrsTotPfls;
  }

  public BigDecimal getTotPftrt() {
    return totPftrt;
  }

  public void setTotPftrt(BigDecimal totPftrt) {
    this.totPftrt = totPftrt;
  }

  public BigDecimal getFrcrBuyAmtSmtl1() {
    return frcrBuyAmtSmtl1;
  }

  public void setFrcrBuyAmtSmtl1(BigDecimal frcrBuyAmtSmtl1) {
    this.frcrBuyAmtSmtl1 = frcrBuyAmtSmtl1;
  }

  public BigDecimal getTotAsstAmt() {
    return totAsstAmt;
  }

  public void setTotAsstAmt(BigDecimal totAsstAmt) {
    this.totAsstAmt = totAsstAmt;
  }

  public BigDecimal getEvluAmtSmtl() {
    return evluAmtSmtl;
  }

  public void setEvluAmtSmtl(BigDecimal evluAmtSmtl) {
    this.evluAmtSmtl = evluAmtSmtl;
  }
}