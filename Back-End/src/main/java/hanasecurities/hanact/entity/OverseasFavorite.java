package hanasecurities.hanact.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "SECURITIES_OVERSEAS_FAVORITES")
@Data
public class OverseasFavorite {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ID")
  private Long id;

  @Column(name = "CUSTOMER_ID", nullable = false)
  private String customerId;

  @Column(name = "STOCK_NAME", nullable = false)
  private String stockName;

  @Column(name = "STOCK_CODE", nullable = false)
  private String stockCode;
}
