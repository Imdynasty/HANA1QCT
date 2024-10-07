package hanasecurities.hanact.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

@Entity
@Table(name = "SECURITIES_OVERSEAS_STOCKPRICES")
@IdClass(DomesticStockPriceId.class)
@Data
public class OverseasStockPrice implements Serializable {

  @Id
  @Column(name = "STOCKCODE")
  private String stockcode;

  @Id
  @Column(name = "TRADING_DATE")
  private Date tradingDate;

  @Column(name = "CLOSE_PRICE")
  private Double closePrice;

  @Column(name = "OPEN_PRICE")
  private Double openPrice;

  @Column(name = "HIGH_PRICE")
  private Double highPrice;

  @Column(name = "LOW_PRICE")
  private Double lowPrice;

  @Column(name = "VOLUME")
  private Long volume;

  @Column(name = "CHANGE_PERCENTAGE")
  private Double changePercentage;
}