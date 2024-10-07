package mydata.hanacertust.repository;

import java.util.Optional;
import mydata.hanacertust.entity.MyDataCI;
import org.springframework.data.jpa.repository.JpaRepository;

// MyDataCIRepository.java
public interface MyDataCIRepository extends JpaRepository<MyDataCI, String> {

  Optional<MyDataCI> findByResidentNumber(String residentNumber);
}