package hanasecurities.hanact.dto;


import java.math.BigDecimal;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DomesticCancelContractDTO {

  private String odno;  // 주문 번호
  private Date ordDt;   // 주문 날짜
  private String ordTmd; // 주문 시간
  private String sllBuyDvsnCdName;  // 매도/매수 구분 코드 이름
  private String prdtName;  // 상품 이름
  private Integer ordQty;  // 주문 수량
  private Integer totCcldQty;  // 총 체결 수량
  private BigDecimal totCcldAmt;  // 총 체결 금액
  private String pdno;  // 종목 번호
  private BigDecimal ordUnpr;  // 주문 단가
  private BigDecimal avgPrvs;  // 평균 이전 가격
  private String ccldCndtName;  // 체결 조건 이름

  // Getters and Setters
}

