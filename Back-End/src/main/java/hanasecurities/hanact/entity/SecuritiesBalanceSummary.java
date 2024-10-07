package hanasecurities.hanact.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "SECURITIES_BALANCE_SUMMARY")
@Data
public class SecuritiesBalanceSummary {

  @Id
  @Column(name = "ACCOUNT_ID")
  private String accountId;

  @Column(name = "TOT_EVLU_AMT")
  private String totEvluAmt;

  @Column(name = "PCHS_AMT_SMTL_AMT")
  private String pchsAmtSmtlAmt;

  @Column(name = "EVLU_AMT_SMTL_AMT")
  private String evluAmtSmtlAmt;

  @Column(name = "EVLU_PFLS_SMTL_AMT")
  private String evluPflsSmtlAmt;

  @Column(name = "DNCA_TOT_AMT")
  private String dncaTotAmt;

  @Column(name = "NXDY_EXCC_AMT")
  private String nxdyExccAmt;

  @Column(name = "PRVS_RCDL_EXCC_AMT")
  private String prvsRcdlExccAmt;
}