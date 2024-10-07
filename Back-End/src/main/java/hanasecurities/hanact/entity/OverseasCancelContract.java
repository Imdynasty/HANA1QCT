package hanasecurities.hanact.entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

@Entity
@Data
@Table(name = "SECURITIES_OVERSEAS_CANCELCONTRACT")
public class OverseasCancelContract {

  @Id
  @Column(name = "ODNO", nullable = false)
  private String odno;  // 주문 번호, 기본 키

  @Column(name = "ORD_DT")
  @Temporal(TemporalType.DATE)
  private Date ordDt;  // 주문 날짜

  @Column(name = "ORD_TMD", length = 6)
  private String ordTmd;  // 주문 시간

  @Column(name = "SLL_BUY_DVSN_CD_NAME", length = 50)
  private String sllBuyDvsnCdName;  // 매도/매수 구분 코드 이름

  @Column(name = "PRDT_NAME", length = 100)
  private String prdtName;  // 상품 이름

  @Column(name = "FT_ORD_QTY")
  private Integer ftOrdQty;  // 주문 수량

  @Column(name = "FT_CCLD_QTY")
  private Integer ftCcldQty;  // 총 체결 수량

  @Column(name = "FT_CCLD_AMT3", precision = 15, scale = 2)
  private BigDecimal ftCcldAmt3;  // 총 체결 금액

  @Column(name = "PDNO", length = 20)
  private String pdno;  // 종목 번호

  @Column(name = "FT_ORD_UNPR3", precision = 15, scale = 2)
  private BigDecimal ftOrdUnpr3;  // 주문 단가

  @Column(name = "TR_CRCY_CD", length = 3)
  private String trCrcyCd;  // 통화 코드

  // Getters and Setters
}

