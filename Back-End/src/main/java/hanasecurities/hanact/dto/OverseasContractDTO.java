package hanasecurities.hanact.dto;


import java.math.BigDecimal;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OverseasContractDTO {

  private String odno;  // 주문 번호
  private Date ordDt;   // 주문 날짜
  private String ordTmd; // 주문 시간
  private String sllBuyDvsnCdName;  // 매도/매수 구분 코드 이름
  private String prdtName;  // 상품 이름
  private Integer ftOrdQty;  // 주문 수량
  private Integer ftCcldQty;  // 총 체결 수량
  private BigDecimal ftCcldAmt3;  // 총 체결 금액
  private String pdno;  // 종목 번호
  private BigDecimal ftOrdUnpr3;  // 주문 단가
  private String trCrcyCd;  // 통화 코드

  // Getters and Setters
}
