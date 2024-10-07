package hanasecurities.hanact.controller;

import hanasecurities.hanact.service.EmailService;
import jakarta.mail.MessagingException;
import java.sql.SQLOutput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.util.Map;

@RestController
public class EmailController {

  @Autowired
  private EmailService emailService;

  @PostMapping("/send-email")
  public String sendEmail(@RequestBody Map<String, Object> payload) {
    String to = (String) payload.get("to");
    String subject = (String) payload.get("subject");
    Map<String, Object> variables = (Map<String, Object>) payload.get("variables");

    try {
      // 스케줄 시작
      emailService.startScheduledEmailTask(to, subject, variables);
      return "Scheduled email task started successfully";
    } catch (Exception e) {
      e.printStackTrace();
      return "Failed to start scheduled email task";
    }
  }

  @PostMapping("/stop-email")
  public String stopEmail() {
    // 스케줄 중지
    emailService.stopScheduledEmailTask();
    return "Scheduled email task stopped successfully";
  }
}