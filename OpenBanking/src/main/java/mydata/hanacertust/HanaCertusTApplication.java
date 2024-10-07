package mydata.hanacertust;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class HanaCertusTApplication extends SpringBootServletInitializer {

  public static void main(String[] args) {
    SpringApplication.run(HanaCertusTApplication.class, args);
  }

  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(HanaCertusTApplication.class);
  }
}
