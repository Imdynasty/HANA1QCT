package mydata.hanacertust.repository;

import java.util.List;
import mydata.hanacertust.entity.MyDataAccount;
import mydata.hanacertust.entity.MyDataCI;
import org.springframework.data.jpa.repository.JpaRepository;

// MyDataAccountRepository.java
public interface MyDataAccountRepository extends JpaRepository<MyDataAccount, String> {

  List<MyDataAccount> findByMyDataCI(MyDataCI myDataCI);
}
