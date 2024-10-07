package hanasecurities.hanact;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class HanaCtApplication {

  public static void main(String[] args) {
    SpringApplication.run(HanaCtApplication.class, args);
  }

}
