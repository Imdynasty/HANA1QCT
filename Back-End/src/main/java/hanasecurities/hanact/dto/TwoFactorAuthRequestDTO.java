package hanasecurities.hanact.dto;

import lombok.Data;

@Data
public class TwoFactorAuthRequestDTO {
  private String userId;
  private String otpCode;
}
