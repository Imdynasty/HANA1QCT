package hanasecurities.hanact.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "SECURITIES_DOMESTIC_FAVORITES")
@Data
public class DomesticFavorite {

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
