package hanasecurities.hanact.controller;
import hanasecurities.hanact.service.ForwardingService;
import java.net.URI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Controller
@RequestMapping("/api/openbanking")
public class MainServerController {

  @Value("${mydata.account.base-url}") // application.properties에 설정
  private String MY_DATA_ACCOUNT_BASE_URL;

  private final ForwardingService forwardingService;

  @Autowired
  public MainServerController(ForwardingService forwardingService) {
    this.forwardingService = forwardingService;
  }

  /**
   * /api/openbanking/sendAccounts 엔드포인트 클라이언트로부터의 요청을 다른 서버의 /api/sendAccounts로 포워딩
   */
  @GetMapping("/sendAccounts")
  public Mono<ResponseEntity<Object>> forwardSendAccounts(@RequestParam(required = false) String ci) {
    return forwardingService.forwardSendAccounts(ci);
  }

  /**
   * /api/openbanking/accounts 엔드포인트 클라이언트로부터의 요청을 다른 서버의 /api/accounts로 포워딩
   */
//  @GetMapping("/accounts")
//  public ResponseEntity<Void> redirectToAccounts(@RequestParam String residentNumber) {
//    String redirectUrl = MY_DATA_ACCOUNT_BASE_URL + "/accounts?residentNumber=" + residentNumber;
//    HttpHeaders headers = new HttpHeaders();
//    headers.setLocation(URI.create(redirectUrl));
//    return new ResponseEntity<>(headers, HttpStatus.FOUND); // 302 Redirect
//  }
//  @GetMapping("/accounts")
//  public Mono<ResponseEntity<String>> forwardGetAccounts(@RequestParam String residentNumber) {
//    return forwardingService.forwardGetAccounts(residentNumber);
//  }

  @GetMapping("/accounts")
  public Mono<ResponseEntity<Void>> redirectToAccounts(@RequestParam String residentNumber) {
    String redirectUrl = MY_DATA_ACCOUNT_BASE_URL + "/accounts?residentNumber=" + residentNumber;
    HttpHeaders headers = new HttpHeaders();
    headers.setLocation(URI.create(redirectUrl));
    return Mono.just(new ResponseEntity<>(headers, HttpStatus.FOUND)); // 302 Redirect
  }

}

