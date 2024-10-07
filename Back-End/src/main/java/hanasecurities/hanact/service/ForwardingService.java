package hanasecurities.hanact.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ForwardingService {

  private final WebClient webClient;
  private final String MY_DATA_ACCOUNT_BASE_URL = "http://3.35.153.189:8080/HanaCertusT-0.0.1-SNAPSHOT/api"; // 다른 서버의 베이스 URL로 변경 필요

  @Autowired
  public ForwardingService(WebClient webClient) {
    this.webClient = webClient;
  }

  /**
   * /sendAccounts 엔드포인트로 요청 포워딩
   */
  public Mono<ResponseEntity<Object>> forwardSendAccounts(String ci) {
    String url = MY_DATA_ACCOUNT_BASE_URL + "/sendAccounts";
    if (ci != null && !ci.isEmpty()) {
      url += "?ci=" + ci;
    }

    return webClient.get()
        .uri(url)
        .header("Authorization", "Bearer your-auth-token") // 필요한 경우 인증 헤더 추가
        .retrieve()
        .onStatus(status -> status.isError(), response -> {
          return response.bodyToMono(String.class)
              .flatMap(errorBody -> Mono.error(new RuntimeException("Error from MyDataAccountController: " + errorBody)));
        })
        .bodyToMono(Object.class)
        .map(responseBody -> ResponseEntity.ok(responseBody))
        .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error forwarding request: " + e.getMessage())));
  }

  /**
   * /accounts 엔드포인트로 요청 포워딩
   */
  public Mono<ResponseEntity<String>> forwardGetAccounts(String residentNumber) {
    String url = MY_DATA_ACCOUNT_BASE_URL + "/accounts?residentNumber=" + residentNumber;
//    System.out.println("Forwarding request to: " + url);
    return webClient.get()
        .uri(url)
        .header("Authorization", "Bearer your-auth-token") // 필요한 경우 인증 헤더 추가
        .retrieve()
        .onStatus(status -> status.isError(), response -> {
          return response.bodyToMono(String.class)
              .flatMap(errorBody -> Mono.error(new RuntimeException("Error from MyDataAccountController: " + errorBody)));
        })
        .bodyToMono(String.class) // JSP 뷰를 HTML 문자열로 받음
        .map(responseBody -> ResponseEntity.ok()
            .contentType(MediaType.TEXT_HTML) // Content-Type 설정
            .body(responseBody))
        .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error forwarding request: " + e.getMessage())));
  }

  public Mono<ResponseEntity<Map<String, String>>> forwardSendSMS(String phoneNumber) {
    String url = MY_DATA_ACCOUNT_BASE_URL + "/oauth/send";

    return webClient.post()
        .uri(url)
        .header("Authorization", "Bearer ") // 필요한 경우 인증 헤더 추가
        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
        .bodyValue("phoneNumber=" + phoneNumber)
        .retrieve()
        .onStatus(status -> status.isError(), response -> {
          return response.bodyToMono(String.class)
              .flatMap(errorBody -> Mono.error(new RuntimeException("Error from AuthController: " + errorBody)));
        })
        .bodyToMono(new ParameterizedTypeReference<Map<String, String>>() {})
        .map(responseBody -> ResponseEntity.ok(responseBody))
        .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "Error forwarding request: " + e.getMessage()))));
  }

  /**
   * /oauth/verify 엔드포인트로 요청 포워딩
   */
  public Mono<ResponseEntity<Map<String, Object>>> forwardVerifyCode(String phoneNumber, String code) {
    String url = MY_DATA_ACCOUNT_BASE_URL + "/oauth/verify";

    return webClient.post()
        .uri(url)
        .header("Authorization", "Bearer ") // 필요한 경우 인증 헤더 추가
        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
        .bodyValue("phoneNumber=" + phoneNumber + "&code=" + code)
        .retrieve()
        .onStatus(status -> status.isError(), response -> {
          return response.bodyToMono(String.class)
              .flatMap(errorBody -> Mono.error(new RuntimeException("Error from AuthController: " + errorBody)));
        })
        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        .map(responseBody -> ResponseEntity.ok(responseBody))
        .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("success", false, "message", "Error forwarding request: " + e.getMessage()))));
  }
}

