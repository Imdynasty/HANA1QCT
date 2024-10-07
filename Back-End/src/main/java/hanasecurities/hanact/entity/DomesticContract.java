package hanasecurities.hanact.entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

@Entity
@Table(name = "SECURITIES_DOMESTIC_CONTRACT")
@Data
public class DomesticContract {

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

  @Column(name = "ORD_QTY")
  private Integer ordQty;  // 주문 수량

  @Column(name = "TOT_CCLD_QTY")
  private Integer totCcldQty;  // 총 체결 수량

  @Column(name = "TOT_CCLD_AMT", precision = 15, scale = 2)
  private BigDecimal totCcldAmt;  // 총 체결 금액

  @Column(name = "PDNO", length = 20)
  private String pdno;  // 종목 번호

  @Column(name = "ORD_UNPR", precision = 15, scale = 2)
  private BigDecimal ordUnpr;  // 주문 단가

  @Column(name = "AVG_PRVS", precision = 15, scale = 2)
  private BigDecimal avgPrvs;  // 평균 이전 가격

  @Column(name = "CCLD_CNDT_NAME", length = 50)
  private String ccldCndtName;  // 체결 조건 이름

  // Getters and Setters
}

