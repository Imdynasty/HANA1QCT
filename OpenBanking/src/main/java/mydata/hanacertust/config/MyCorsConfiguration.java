package mydata.hanacertust.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MyCorsConfiguration implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")  // This applies CORS settings to all routes
        .allowedOrigins("*")  // Allowing access from your React app
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Allowing these methods
        .allowedHeaders("*");  // Allowing all headers
  }
}