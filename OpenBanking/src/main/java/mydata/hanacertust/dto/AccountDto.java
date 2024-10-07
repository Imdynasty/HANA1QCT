package mydata.hanacertust.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AccountDto {

  private Long accountNumber;
  private String financialInstitution;
  private Double accounts;

  // Constructor, getters and setters
}
