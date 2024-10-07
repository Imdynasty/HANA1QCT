package hanasecurities.hanact.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import hanasecurities.hanact.dto.DomesticContractDTO;
import hanasecurities.hanact.dto.SecuritiesBalanceSummaryDTO;
import hanasecurities.hanact.dto.SecuritiesDomesticBalancesDTO;
import hanasecurities.hanact.dto.OverseasContractDTO;
import hanasecurities.hanact.dto.SecuritiesOverseasBalanceDto;
import hanasecurities.hanact.dto.SecuritiesOverseasBalanceSummaryDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.File;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.URL;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Optional;
import java.util.concurrent.ScheduledFuture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EmailService {

  @Autowired
  private JavaMailSender mailSender;

  @Autowired
  private TemplateEngine templateEngine;

  @Autowired
  private DomesticContractService contractService;

  @Autowired
  private OverseasContractService overseascontractService;

  @Autowired
  private SecuritiesDomesticBalancesService securitiesDomesticBalancesService;

  @Autowired
  private SecuritiesOverseasBalanceService securitiesOverseasBalanceService;

  @Autowired
  private SecuritiesOverseasBalanceSummaryService securitiesOverseasBalanceSummaryService;

  @Autowired
  private SecuritiesBalanceSummaryService securitiesBalanceSummaryService;

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final TaskScheduler taskScheduler;
  private ScheduledFuture<?> scheduledTask;

  public EmailService() {
    this.taskScheduler = new ThreadPoolTaskScheduler();
    ((ThreadPoolTaskScheduler) taskScheduler).initialize();
  }

  public void startScheduledEmailTask(String to, String subject, Map<String, Object> variables)
      throws MessagingException, IOException {
    // 현재 날짜와 시간
    LocalDateTime now = LocalDateTime.now();

    // 다음 이메일 전송 시간을 계산 (이번 달 1일 16시 30분)
    LocalDateTime nextTriggerTime = now.withDayOfMonth(4).withHour(22).withMinute(45).withSecond(0).withNano(0);

    // 만약 현재 시간이 이미 이번 달 1일 16:30을 지난 경우 다음 달로 설정
    if (now.isAfter(nextTriggerTime)) {
      nextTriggerTime = nextTriggerTime.plusMonths(1);
    }

    Date triggerDate = Date.from(nextTriggerTime.atZone(ZoneId.systemDefault()).toInstant());

    scheduledTask = taskScheduler.schedule(() -> {
      try {
        // 이전 달의 데이터를 가져옴
        Map<String, Object> previousMonthVariables = new HashMap<>(variables);
        sendEmailWithHtmlTemplates(to, subject, previousMonthVariables);
      } catch (MessagingException | IOException e) {
        e.printStackTrace();
      }
    }, triggerDate);
  }

  public void stopScheduledEmailTask() {
    if (scheduledTask != null) {
      scheduledTask.cancel(false);
    }
  }

  public void sendEmailWithHtmlTemplates(String to, String subject, Map<String, Object> variables) throws MessagingException, IOException {
    // 이전 달 계산
    LocalDate now = LocalDate.now();
    LocalDate previousMonthDate = now.minusMonths(1);
    int year = previousMonthDate.getYear();
    int month = previousMonthDate.getMonthValue();

    // 국내주식 DTO 변환 및 데이터 포맷팅
    SecuritiesBalanceSummaryDTO balanceSummary = objectMapper.convertValue(variables.get("balanceSummary"), SecuritiesBalanceSummaryDTO.class);
    List<SecuritiesDomesticBalancesDTO> balances = objectMapper.convertValue(variables.get("balances"), objectMapper.getTypeFactory().constructCollectionType(List.class, SecuritiesDomesticBalancesDTO.class));
    formatBalanceData(balanceSummary, balances);
    filterTransactionsByMonth(year, month, variables);
    variables.put("balanceSummary", balanceSummary);
    variables.put("balances", balances);

    // 해외주식 DTO 변환 및 데이터 포맷팅
    SecuritiesOverseasBalanceSummaryDTO overseasSummary = objectMapper.convertValue(variables.get("overseasSummary"), SecuritiesOverseasBalanceSummaryDTO.class);
    List<SecuritiesOverseasBalanceDto> overseasBalances = objectMapper.convertValue(variables.get("overseasBalances"), objectMapper.getTypeFactory().constructCollectionType(List.class, SecuritiesOverseasBalanceDto.class));
    formatOverseasBalanceData(overseasSummary, overseasBalances, variables);  // variables를 추가로 전달

    // 이전 달의 거래 내역 필터링
    filterOverseasTransactionsByMonth(year, month, variables);

    // Thymeleaf Context에 데이터 설정
    Context context = new Context();
    context.setVariables(variables);

    // 국내 주식 리포트 HTML 템플릿 렌더링
    String htmlContent1 = templateEngine.process("InvestmentReport", context);
    Path htmlFilePath1 = saveHtmlToFile(htmlContent1, "saved_investment_report.html");

    // 해외 주식 리포트 HTML 템플릿 렌더링
    String htmlContent2 = templateEngine.process("OverseasInvestmentReport", context);
    Path htmlFilePath2 = saveHtmlToFile(htmlContent2, "saved_overseas_investment_report.html");

    // 저장된 HTML 파일을 이메일로 전송 (본문에 이미지 포함)
    sendEmailWithHtmlFiles(to, subject, htmlFilePath1, htmlFilePath2);
  }

  @Value("${file.upload-dir}")
  private String uploadDir;

  private Path saveHtmlToFile(String htmlContent, String fileName) throws IOException {
    Path directoryPath = Paths.get(uploadDir);
    if (Files.notExists(directoryPath)) {
      Files.createDirectories(directoryPath);
    }

    Path filePath = directoryPath.resolve(fileName);
    Files.write(filePath, htmlContent.getBytes(StandardCharsets.UTF_8));
    return filePath;
  }

  private void sendEmailWithHtmlFiles(String to, String subject, Path htmlFilePath1, Path htmlFilePath2) throws MessagingException, IOException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

    helper.setFrom("hana1qct@naver.com");
    helper.setTo(to);
    helper.setSubject(subject);

    // 첨부할 HTML 파일
    FileSystemResource file1 = new FileSystemResource(htmlFilePath1.toFile());
    helper.addAttachment("InvestmentReport.html", file1);

    FileSystemResource file2 = new FileSystemResource(htmlFilePath2.toFile());
    helper.addAttachment("OverseasInvestmentReport.html", file2);

    // 이메일 본문에 이미지 포함
    String emailMessage = "<html><body>"
        + "<img src='cid:reportImage' alt='Report Image' style='width: 700px; height: auto;'/>"
        + "</body></html>";
    helper.setText(emailMessage, true);

    // URL에서 이미지 다운로드 후 임시 파일로 저장
    Path tempImagePath = downloadImage("https://github.com/Imdynasty/HanaCT-KoreaLogo/blob/main/investmentreport.png?raw=true", "investmentreport.png");

    // 다운로드한 이미지를 임베드
    FileSystemResource res = new FileSystemResource(tempImagePath.toFile());
    helper.addInline("reportImage", res);

    mailSender.send(message);

    // 이메일 전송 후 임시 파일 삭제
    Files.delete(tempImagePath);
  }

  // URL에서 이미지를 다운로드하고 임시 파일로 저장하는 함수
  private Path downloadImage(String urlString, String fileName) throws IOException {
    URL url = new URL(urlString);
    InputStream in = url.openStream();
    Path tempFilePath = Files.createTempFile(fileName, ".png");
    Files.copy(in, tempFilePath, StandardCopyOption.REPLACE_EXISTING);
    in.close();
    return tempFilePath;
  }

  private void formatBalanceData(SecuritiesBalanceSummaryDTO balanceSummary, List<SecuritiesDomesticBalancesDTO> balances) {
    DecimalFormat formatter = new DecimalFormat("#,###");

    if (balanceSummary != null) {
      balanceSummary.setTotEvluAmt(formatter.format(Double.parseDouble(removeNonNumericCharacters(balanceSummary.getTotEvluAmt()))) + " 원");
      balanceSummary.setPchsAmtSmtlAmt(formatter.format(Double.parseDouble(removeNonNumericCharacters(balanceSummary.getPchsAmtSmtlAmt()))) + " 원");
      balanceSummary.setEvluAmtSmtlAmt(formatter.format(Double.parseDouble(removeNonNumericCharacters(balanceSummary.getEvluAmtSmtlAmt()))) + " 원");
      balanceSummary.setEvluPflsSmtlAmt(formatter.format(Double.parseDouble(removeNonNumericCharacters(balanceSummary.getEvluPflsSmtlAmt()))) + " 원");
    }

    if (balances != null) {
      balances.forEach(balance -> {
        balance.setPchsAmt(formatter.format(Double.parseDouble(removeNonNumericCharacters(balance.getPchsAmt()))) + " 원");
        balance.setEvluPflsAmt(formatter.format(Double.parseDouble(removeNonNumericCharacters(balance.getEvluPflsAmt()))) + " 원");
        balance.setPrpr(formatter.format(Double.parseDouble(removeNonNumericCharacters(balance.getPrpr()))) + " 원");
        balance.setPchsAvgPric(formatter.format(Double.parseDouble(removeNonNumericCharacters(balance.getPchsAvgPric()))) + " 원");
        balance.setEvluPflsRt(balance.getEvluPflsRt());
      });
    }
  }

  private String removeNonNumericCharacters(String str) {
    if (str != null) {
      return str.replaceAll("[^\\d.]", ""); // 숫자와 소수점을 제외한 모든 문자 제거
    }
    return str;
  }

  private void formatOverseasBalanceData(SecuritiesOverseasBalanceSummaryDTO overseasSummary, List<SecuritiesOverseasBalanceDto> overseasBalances, Map<String, Object> variables) {
    DecimalFormat formatter = new DecimalFormat("#,###");

    if (overseasSummary != null) {
      String totAsstAmtFormatted = overseasSummary.getTotAsstAmt() != null ? formatter.format(overseasSummary.getTotAsstAmt().doubleValue()) + " 원" : "데이터 없음";
      String ovrsTotPflsFormatted = overseasSummary.getOvrsTotPfls() != null ? formatter.format(overseasSummary.getOvrsTotPfls().doubleValue()) + " 원" : "데이터 없음";
      String evluAmtSmtlFormatted = overseasSummary.getEvluAmtSmtl() != null ? formatter.format(overseasSummary.getEvluAmtSmtl().doubleValue()) + " 원" : "데이터 없음";
      String totPftrtFormatted = overseasSummary.getTotPftrt() != null ? formatter.format(overseasSummary.getTotPftrt()) + " %" : "데이터 없음";
      String frcrBuyAmtSmtl1Formatted = overseasSummary.getFrcrBuyAmtSmtl1() != null ? formatter.format(overseasSummary.getFrcrBuyAmtSmtl1().doubleValue()) + " 원" : "데이터 없음";

      variables.put("totAsstAmtFormatted", totAsstAmtFormatted);
      variables.put("ovrsTotPflsFormatted", ovrsTotPflsFormatted);
      variables.put("evluAmtSmtlFormatted", evluAmtSmtlFormatted);
      variables.put("totPftrtFormatted", totPftrtFormatted);
      variables.put("frcrBuyAmtSmtl1Formatted", frcrBuyAmtSmtl1Formatted);
    }

    if (overseasBalances != null) {
      List<String> frcrEvluPflsAmtFormattedList = overseasBalances.stream()
          .map(balance -> balance.getFrcrEvluPflsAmt() != null ? formatter.format(balance.getFrcrEvluPflsAmt()) + " USD" : "데이터 없음")
          .collect(Collectors.toList());

      List<String> frcrPchsAmt1FormattedList = overseasBalances.stream()
          .map(balance -> balance.getFrcrPchsAmt1() != null ? formatter.format(balance.getFrcrPchsAmt1()) + " USD" : "데이터 없음")
          .collect(Collectors.toList());

      List<String> nowPric2FormattedList = overseasBalances.stream()
          .map(balance -> balance.getNowPric2() != null ? formatter.format(balance.getNowPric2()) + " USD" : "데이터 없음")
          .collect(Collectors.toList());

      List<String> pchsAvgPricFormattedList = overseasBalances.stream()
          .map(balance -> balance.getPchsAvgPric() != null ? formatter.format(balance.getPchsAvgPric()) + " USD" : "데이터 없음")
          .collect(Collectors.toList());

      variables.put("frcrEvluPflsAmtFormattedList", frcrEvluPflsAmtFormattedList);
      variables.put("frcrPchsAmt1FormattedList", frcrPchsAmt1FormattedList);
      variables.put("nowPric2FormattedList", nowPric2FormattedList);
      variables.put("pchsAvgPricFormattedList", pchsAvgPricFormattedList);
    }
  }

  private void filterTransactionsByMonth(int year, int month, Map<String, Object> variables) {
    List<DomesticContractDTO> contracts = contractService.getAllContracts().stream()
        .filter(contract -> {
          LocalDate contractDate = LocalDate.parse(contract.getOrdDt().toString());
          return contractDate.getMonthValue() == month && contractDate.getYear() == year;
        })
        .collect(Collectors.toList());

    variables.put("contracts", contracts);
  }

  private void filterOverseasTransactionsByMonth(int year, int month, Map<String, Object> variables) {
    List<OverseasContractDTO> contracts = overseascontractService.getAllContracts().stream()
        .filter(contract -> {
          LocalDate contractDate = LocalDate.parse(contract.getOrdDt().toString());
          return contractDate.getMonthValue() == month && contractDate.getYear() == year;
        })
        .collect(Collectors.toList());

    variables.put("overseascontracts", contracts);
  }

}

