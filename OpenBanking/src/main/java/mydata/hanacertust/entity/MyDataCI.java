package mydata.hanacertust.entity;

// MyDataCI.java

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.Set;
import lombok.Data;

@Data
@Entity
@Table(name = "MyData_CI")
public class MyDataCI {

  @Id
  private String ci;
  private String residentNumber;

  @OneToMany(mappedBy = "myDataCI")
  private Set<MyDataAccount> myDataAccounts;

  // getters and setters
}

