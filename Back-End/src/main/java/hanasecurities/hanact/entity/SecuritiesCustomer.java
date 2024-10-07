package hanasecurities.hanact.entity;
import jakarta.persistence.*;
import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "SECURITIES_CUSTOMERS")
@Data
@AllArgsConstructor
public class SecuritiesCustomer {

  @Id
  @Column(name = "CUSTOMER_ID")
  private String customerId;

  @Column(name = "CUSTOMER_PASSWORD")
  private String customerPassword;

  @Column(name = "NAME")
  private String name;

  @Column(name = "PHONE")
  private String phone;

  @Column(name = "ADDRESS")
  private String address;

  @Column(name = "EMAIL")
  private String email;

  @Column(name = "USER_TYPE")
  private String userType;

  @Column(name = "REGISTRATION_DATE")
  private Timestamp registrationDate;

  @Column(name = "CI")
  private String ci;

  @Column(name = "MARKET_CAPITALIZATION")
  private Double marketCapitalization;

  @Column(name = "MARKET_CAPITALIZATION_OVERSEAS")
  private Double marketCapitalizationOverseas;

  public SecuritiesCustomer() {

  }

  // Getters and Setters
}
