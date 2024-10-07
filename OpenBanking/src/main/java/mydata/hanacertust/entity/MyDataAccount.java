package mydata.hanacertust.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
// MyDataAccount.java
@Entity
@Table(name = "MyData_Account")
public class MyDataAccount {

  @Id
  private String accountNumber;
  private String financialInstitution;
  private Double accounts;

  @ManyToOne
  @JoinColumn(name = "CI" )
  private MyDataCI myDataCI;
  @Override
  public String toString() {
    return "MyDataAccount{" +
        "accountNumber=" + accountNumber +
        ", financialInstitution='" + financialInstitution + '\'' +
        ", accounts=" + accounts +
        ", myDataCI=" + (myDataCI != null ? myDataCI.getCi() : "null") +
        '}';
  }
  // getters and setters
}
