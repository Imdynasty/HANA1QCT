package hanasecurities.hanact.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.sql.Timestamp;
import lombok.Data;

@Entity
@Data
@Table(name = "SECURITIES_OVERSEAS_STOCKCODES")
public class OverseasStock {
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
