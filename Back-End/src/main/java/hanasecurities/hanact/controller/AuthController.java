package hanasecurities.hanact.controller;

import hanasecurities.hanact.service.ForwardingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/openbanking/oauth")
@RequiredArgsConstructor
public class AuthController {

  private final ForwardingService forwardingService;

  /**
   * /api/openbanking/oauth/send 엔드포인트
   * 클라이언트로부터의 요청을 다른 서버의 /oauth/send로 포워딩
   */
  @PostMapping("/send")
  public Mono<ResponseEntity<Map<String, String>>> sendSMS(@RequestParam("phoneNumber") String phoneNumber) {
    return forwardingService.forwardSendSMS(phoneNumber);
  }

  /**
   * /api/openbanking/oauth/verify 엔드포인트
   * 클라이언트로부터의 요청을 다른 서버의 /oauth/verify로 포워딩
   */
  @PostMapping("/verify")
  public Mono<ResponseEntity<Map<String, Object>>> verifyCode(@RequestParam String phoneNumber, @RequestParam String code) {
    return forwardingService.forwardVerifyCode(phoneNumber, code);
  }
}

