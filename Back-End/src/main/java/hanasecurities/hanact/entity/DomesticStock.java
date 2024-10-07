package hanasecurities.hanact.entity;


import jakarta.persistence.*;
import java.sql.Timestamp;
import lombok.Data;

@Entity
@Data
@Table(name = "SECURITIES_DOMESTIC_STOCKCODES")
public class DomesticStock {

  @Id
  @Column(name = "STOCK_CODE")
  private String stockCode;

  @Column(name = "STOCK_NAME")
  private String stockName;

  @Column(name = "INDUSTRY")
  private String industry;

  @Column(name = "ISSUED_SHARES")
  private Double issuedShares;

  @Column(name = "REFERENCE_DATE")
  private Timestamp referenceDate;
}
