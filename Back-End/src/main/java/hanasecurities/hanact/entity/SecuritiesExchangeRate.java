package hanasecurities.hanact.entity;


import jakarta.persistence.*;
import java.util.Date;
import lombok.Data;

@Entity
@Table(name = "SECURITIES_EXCHANGE_RATE")
@Data
public class SecuritiesExchangeRate {

  @Id
  @Column(name = "RATE_DATE")
  private Date rateDate;

  @Column(name = "BUY_RATE")
  private Double buyRate;

  @Column(name = "SELL_RATE")
  private Double sellRate;

  @Column(name = "SEND_RATE")
  private Double sendRate;

  @Column(name = "RECEIVE_RATE")
  private Double receiveRate;

  @Column(name = "FOREIGN_CHECK_RATE")
  private Double foreignCheckRate;

  @Column(name = "TRADING_STANDARD_RATE")
  private Double tradingStandardRate;

  @Column(name = "CHANGE_RATE")
  private Double changeRate;

  @Column(name = "EXCHANGE_FEE")
  private Double exchangeFee;

  @Column(name = "USD_CONVERSION_RATE")
  private Double usdConversionRate;

  // Getters and Setters
}
