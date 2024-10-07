package hanasecurities.hanact.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "SECURITIES_DOMESTIC_BALANCE")
@IdClass(SecuritiesDomesticBalancesId.class)
@Data
public class SecuritiesDomesticBalances {

  @Id
  @Column(name = "ACCOUNT_ID")
  private String accountId;

  @Id
  @Column(name = "PDNO")
  private String pdno;

  @Column(name = "HLDG_QTY")
  private String hldgQty;

  @Column(name = "FLTT_RT")
  private String flttRt;

  @Column(name = "PCHS_AMT")
  private String pchsAmt;

  @Column(name = "EVLU_PFLS_RT")
  private String evluPflsRt;

  @Column(name = "EVLU_PFLS_AMT")
  private String evluPflsAmt;

  @Column(name = "PRDT_NAME")
  private String prdtName;

  @Column(name = "PRPR")
  private String prpr;

  @Column(name = "PCHS_AVG_PRIC")
  private String pchsAvgPric;

  // Getters and Setters
}
