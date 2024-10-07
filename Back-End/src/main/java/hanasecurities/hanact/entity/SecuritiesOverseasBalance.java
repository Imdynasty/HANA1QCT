package hanasecurities.hanact.entity;


import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import lombok.Data;

@Entity
@Table(name = "SECURITIES_OVERSEAS_BALANCE")
@IdClass(SecuritiesOverseasBalanceId.class)
@Data
public class SecuritiesOverseasBalance implements Serializable {

  @Id
  @Column(name = "accountId", length = 50, nullable = false)
  private String accountId;

  @Id
  @Column(name = "ovrs_pdno", length = 20, nullable = false)
  private String ovrsPdno;

  @Column(name = "ovrs_item_name", length = 100, nullable = false)
  private String ovrsItemName;

  @Column(name = "frcr_evlu_pfls_amt")
  private Double frcrEvluPflsAmt;

  @Column(name = "evlu_pfls_rt")
  private Double evluPflsRt;

  @Column(name = "pchs_avg_pric")
  private Double pchsAvgPric;

  @Column(name = "ovrs_stck_evlu_amt")
  private Double ovrsStckEvluAmt;

  @Column(name = "frcr_pchs_amt1")
  private Double frcrPchsAmt1;

  @Column(name = "now_pric2")
  private Double nowPric2;

  @Column(name = "ovrs_cblc_qty")
  private BigDecimal ovrsCblcQty;
}
