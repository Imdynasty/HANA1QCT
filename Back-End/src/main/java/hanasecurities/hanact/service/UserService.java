package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.UserDTO;
import hanasecurities.hanact.entity.SecuritiesCustomer;
import hanasecurities.hanact.repository.SecuritiesCustomerRepository;
import hanasecurities.hanact.security.JwtUtil;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

  @Autowired
  private SecuritiesCustomerRepository customersRepository;

  private final JwtUtil jwtUtil;
  private final AuthService authService; // AuthService 추가

  public String validateUser(String userId, String rawPassword) {
    Optional<SecuritiesCustomer> customerOptional = customersRepository.findById(userId);
    if (customerOptional.isPresent()) {
      SecuritiesCustomer customer = customerOptional.get();
      // 비밀번호와 전화번호를 비교
      if (customer.getCustomerPassword().equals(rawPassword)) {
        // 사용자의 전화번호로 SMS 발송
        authService.sendSMS(customer.getPhone());
        return "OTP Sent"; // OTP 발송 메시지 반환
      }
    }
    return null;
  }

  public String completeLogin(String userId, String otpCode) {
    Optional<SecuritiesCustomer> customerOptional = customersRepository.findById(userId);
    if (customerOptional.isPresent()) {
      SecuritiesCustomer customer = customerOptional.get();
      if (authService.verifyCode(customer.getPhone(), otpCode)) {
        UserDTO userDTO = new UserDTO(customer.getCustomerId(), customer.getName());
        return jwtUtil.createAccessToken(userDTO); // JWT 반환
      }
    }
    return null;
  }

}
