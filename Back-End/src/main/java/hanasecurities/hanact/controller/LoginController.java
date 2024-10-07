package hanasecurities.hanact.controller;

import hanasecurities.hanact.dto.UserLoginRequestDTO;
import hanasecurities.hanact.dto.TwoFactorAuthRequestDTO;
import hanasecurities.hanact.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hanact/login")
@RequiredArgsConstructor
public class LoginController {

  private final UserService userService;

  @PostMapping("/validate")
  public ResponseEntity<String> login(@RequestBody UserLoginRequestDTO request) {
    if (request.getUserId() == null || request.getPassword() == null) {
      return ResponseEntity.badRequest().body("User ID and password must not be null");
    }

    String response = userService.validateUser(request.getUserId(), request.getPassword());
    if (response == null) {
      return ResponseEntity.status(401).body("Invalid credentials");
    }

    return ResponseEntity.ok(response); // OTP 발송 상태 반환
  }

  @PostMapping("/2fa/validate")
  public ResponseEntity<String> validateTwoFactorAuth(@RequestBody TwoFactorAuthRequestDTO request) {
    if (request.getUserId() == null || request.getOtpCode() == null) {
      return ResponseEntity.badRequest().body("User ID and OTP code must not be null");
    }

    String jwtToken = userService.completeLogin(request.getUserId(), request.getOtpCode());
    if (jwtToken == null) {
      return ResponseEntity.status(401).body("Invalid OTP code");
    }

    return ResponseEntity.ok(jwtToken); // JWT 토큰 반환
  }
}
