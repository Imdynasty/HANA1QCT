package hanasecurities.hanact.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import net.nurigo.java_sdk.api.Message;
import net.nurigo.java_sdk.exceptions.CoolsmsException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class AuthService {
  private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();
  @Value("${coolsms.apikey}")
  private String apiKey;

  @Value("${coolsms.apisecret}")
  private String apiSecret;

  @Value("${coolsms.fromnumber}")
  private String fromNumber;
  // 인증번호 전송하기
  public String sendSMS(String phoneNumber) {
    System.out.println("Received phone number: " + phoneNumber + " for sending SMS");
    Message coolsms = new Message(apiKey, apiSecret);
    String randomNum = createRandomNumber();
    System.out.println("Generated Random Number: " + randomNum);
    HashMap<String, String> params = makeParams(phoneNumber, randomNum);

    try {
      JSONObject obj = (JSONObject) coolsms.send(params);
      System.out.println("Response from CoolSMS: " + obj.toString());
      verificationCodes.put(phoneNumber, randomNum);
    } catch (CoolsmsException e) {
      System.out.println("Error: " + e.getMessage());
      System.out.println("Code: " + e.getCode());
      return "문자 전송 실패: " + e.getMessage();
    }

    return "문자 전송이 완료되었습니다.";
  }

  private String createRandomNumber() {
    Random rand = new Random();
    StringBuilder randomNum = new StringBuilder();
    for (int i = 0; i < 6; i++) {
      String random = Integer.toString(rand.nextInt(10));
      randomNum.append(random);
    }
    return randomNum.toString();
  }
  private HashMap<String, String> makeParams(String to, String randomNum) {
    HashMap<String, String> params = new HashMap<>();
    params.put("from", fromNumber);
    params.put("type", "SMS");
    params.put("app_version", "test app 1.2");
    params.put("to", to);
    params.put("text", "[하나1QCT] 본인확인 OTP[" + randomNum+"]를 입력해주세요.");
    return params;
  }

  public boolean verifyCode(String phoneNumber, String code) {
    String storedCode = verificationCodes.get(phoneNumber);
    return storedCode != null && storedCode.equals(code);
  }
}
