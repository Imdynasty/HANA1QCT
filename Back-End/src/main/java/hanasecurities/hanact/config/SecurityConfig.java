package hanasecurities.hanact.config;

import hanasecurities.hanact.security.JwtFilter;
import hanasecurities.hanact.security.JwtUtil;
import hanasecurities.hanact.service.SecuritiesCustomerService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

  private final SecuritiesCustomerService customUserDetailsService;
  private final JwtUtil jwtUtil;

  private static final String[] AUTH_WHITELIST = {
      "/**"
  };

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .csrf(csrf -> csrf.disable()) // CSRF 공격에 대한 필터는 임시로 비활성
        .formLogin(AbstractHttpConfigurer::disable) // Spring Security의 기본 로그인 화면 비활성
        .httpBasic(AbstractHttpConfigurer::disable) // 클라이언트가 id, pw를 http 헤더에 인코딩하는 인증 방법인 http basic을 비활성화
        .addFilterBefore(new JwtFilter(jwtUtil, customUserDetailsService), UsernamePasswordAuthenticationFilter.class);

    // 권한 규칙 작성
    http.authorizeHttpRequests(authorize -> authorize
        .requestMatchers(AUTH_WHITELIST).permitAll()
        .anyRequest().permitAll()
    );

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }
}
