package hanasecurities.hanact.dto;


import hanasecurities.hanact.entity.SecuritiesCustomer;
import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SecuritiesCustomerDTO {
  private String customerId;
  private String customerPassword;
  private String name;
  private String phone;
  private String address;
  private String email;
  private String userType;
  private Timestamp registrationDate;
  private String ci;
  private Double marketCapitalization;
  private Double marketCapitalizationOverseas;


  // Getters and Setters
}
