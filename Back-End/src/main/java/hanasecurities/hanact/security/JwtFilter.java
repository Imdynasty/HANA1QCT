package hanasecurities.hanact.security;

import hanasecurities.hanact.dto.SecuritiesCustomerDTO;
import hanasecurities.hanact.service.SecuritiesCustomerService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
  private final JwtUtil jwtUtil;

  private final SecuritiesCustomerService customUserDetailsService;

  /**
   * JWT 토큰 검증 필터 수행
   */
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    String authorization = request.getHeader("Authorization"); // 헤더에서 인증 부분을 변수에 저장
    if (authorization != null && authorization.startsWith("Bearer ")) { // 해당 authorization에 토큰이 없다면 토큰 검증을 실행하지 않음
      String token = authorization.substring(7); // 인증 부분의 7자리만 추출해서 token에 저장
      if (jwtUtil.validateToken(token)) { // 검증로직을 통과하면
        String userId = jwtUtil.getUserId(token); //
        SecuritiesCustomerDTO userDTO = customUserDetailsService.getCustomerById(userId);
        if (userDTO != null) {
          UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDTO, null, null);
          SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
        }
      }
    }
    try {
      filterChain.doFilter(request, response);
    } catch (IOException e) {
      System.out.println("doFilter 토큰 인증 로직 수행중 에러 발생");
      throw new RuntimeException(e);
    }
  }

}