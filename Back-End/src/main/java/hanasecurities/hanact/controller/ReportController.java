package hanasecurities.hanact.controller;

import hanasecurities.hanact.dto.DomesticContractDTO;
import hanasecurities.hanact.dto.OverseasContractDTO;
import hanasecurities.hanact.dto.SecuritiesBalanceSummaryDTO;
import hanasecurities.hanact.dto.SecuritiesDomesticBalancesDTO;
import hanasecurities.hanact.dto.SecuritiesOverseasBalanceDto;
import hanasecurities.hanact.dto.SecuritiesOverseasBalanceSummaryDTO;
import hanasecurities.hanact.service.DomesticContractService;
import hanasecurities.hanact.service.OverseasContractService;
import hanasecurities.hanact.service.SecuritiesBalanceSummaryService;
import hanasecurities.hanact.service.SecuritiesDomesticBalancesService;
import hanasecurities.hanact.service.SecuritiesOverseasBalanceService;
import hanasecurities.hanact.service.SecuritiesOverseasBalanceSummaryService;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReportController {

  @Autowired
  private DomesticContractService contractService;

  @Autowired
  private OverseasContractService overseasContractService;

  @Autowired
  private SecuritiesDomesticBalancesService balancesService;

  @Autowired
  private SecuritiesOverseasBalanceService overseasBalanceService;

  @Autowired
  private SecuritiesBalanceSummaryService summaryService;

  @Autowired
  private SecuritiesOverseasBalanceSummaryService overseasSummaryService;


  @GetMapping("/report")
  public String getInvestmentReport(Model model) {
    // 특정 계좌 ID에 대한 Balance Summary 데이터를 가져와서 모델에 추가
    String accountId = "종합위탁"; // 실제 계좌 ID로 대체
    SecuritiesBalanceSummaryDTO balanceSummary = summaryService.getBalanceSummaryByAccountId(
        accountId);
    if (balanceSummary != null) {
      DecimalFormat formatter = new DecimalFormat("#,###");
      try {
        balanceSummary.setTotEvluAmt(
            formatter.format(Double.parseDouble(balanceSummary.getTotEvluAmt())) + " 원");
        balanceSummary.setPchsAmtSmtlAmt(
            formatter.format(Double.parseDouble(balanceSummary.getPchsAmtSmtlAmt())) + " 원");
        balanceSummary.setEvluAmtSmtlAmt(
            formatter.format(Double.parseDouble(balanceSummary.getEvluAmtSmtlAmt())) + " 원");
        balanceSummary.setEvluPflsSmtlAmt(
            formatter.format(Double.parseDouble(balanceSummary.getEvluPflsSmtlAmt())) + " 원");
      } catch (NumberFormatException e) {
        e.printStackTrace();
      }
    }
    model.addAttribute("balanceSummary", balanceSummary);

    // Balances 데이터를 가져와서 한국 원화 형식으로 표시
    List<SecuritiesDomesticBalancesDTO> balances = balancesService.getBalancesByAccountId(
        accountId);
    if (balances != null) {
      balances.forEach(balance -> {
        DecimalFormat formatter = new DecimalFormat("#,###");
        try {
          balance.setPchsAmt(formatter.format(Double.parseDouble(balance.getPchsAmt())) + " 원");
          balance.setEvluPflsAmt(
              formatter.format(Double.parseDouble(balance.getEvluPflsAmt())) + " 원");
          balance.setPrpr(formatter.format(Double.parseDouble(balance.getPrpr())) + " 원");
          balance.setPchsAvgPric(
              formatter.format(Double.parseDouble(balance.getPchsAvgPric())) + " 원");
          balance.setEvluPflsRt(balance.getEvluPflsRt() + " %");
        } catch (NumberFormatException e) {
          e.printStackTrace();
        }
      });
    }
    model.addAttribute("balances", balances);

    // 현재 달의 거래내역만 필터링하여 가져오기
    LocalDate now = LocalDate.now();
    ZoneId zoneId = ZoneId.systemDefault();
    List<DomesticContractDTO> contracts = contractService.getAllContracts().stream()
        .filter(contract -> {
          LocalDate contractDate = new java.sql.Date(contract.getOrdDt().getTime()).toLocalDate();
          return contractDate.getMonth() == now.getMonth()
              && contractDate.getYear() == now.getYear();
        })
        .collect(Collectors.toList());

    // totCcldAmt를 한국 원화로 포
    model.addAttribute("contracts", contracts);

    // HTML 템플릿을 반환
    return "InvestmentReport";
  }


  @GetMapping("/overseas/report")
  public String getInvestmentOverseasReport(Model model) {
    // 특정 계좌 ID에 대한 해외 Balance Summary 데이터를 가져와서 모델에 추가
    String accountId = "종합위탁"; // 실제 계좌 ID로 대체
    Optional<SecuritiesOverseasBalanceSummaryDTO> overseasBalanceSummaryOpt = overseasSummaryService.getSummaryByAccountId(accountId);
    overseasBalanceSummaryOpt.ifPresent(overseasBalanceSummary -> {
      DecimalFormat formatter = new DecimalFormat("#,###");

      try {
        // BigDecimal -> String 변환 후 포맷팅
        String ovrsTotPflsFormatted = formatter.format(overseasBalanceSummary.getOvrsTotPfls()) + " 원";
        String totPftrtFormatted = overseasBalanceSummary.getTotPftrt() + " %";
        String frcrBuyAmtSmtl1Formatted = formatter.format(overseasBalanceSummary.getFrcrBuyAmtSmtl1()) + " 원";
        String totAsstAmtFormatted = formatter.format(overseasBalanceSummary.getTotAsstAmt()) + " 원";
        String evluAmtSmtlFormatted = formatter.format(overseasBalanceSummary.getEvluAmtSmtl()) + " 원";

        // 모델에 포맷된 문자열을 추가
        model.addAttribute("ovrsTotPflsFormatted", ovrsTotPflsFormatted);
        model.addAttribute("totPftrtFormatted", totPftrtFormatted);
        model.addAttribute("frcrBuyAmtSmtl1Formatted", frcrBuyAmtSmtl1Formatted);
        model.addAttribute("totAsstAmtFormatted", totAsstAmtFormatted);
        model.addAttribute("evluAmtSmtlFormatted", evluAmtSmtlFormatted);

      } catch (NumberFormatException e) {
        e.printStackTrace();
      }
    });


    // 해외 Balances 데이터를 가져와서 한국 원화 형식으로 표시
    List<SecuritiesOverseasBalanceDto> overseasBalances = overseasBalanceService.getAllBalances();
    List<String> frcrPchsAmt1FormattedList = new ArrayList<>();
    List<String> frcrEvluPflsAmtFormattedList = new ArrayList<>();
    List<String> nowPric2FormattedList = new ArrayList<>();
    List<String> pchsAvgPricFormattedList = new ArrayList<>();
    List<String> evluPflsRtFormattedList = new ArrayList<>();

    if (overseasBalances != null) {
      overseasBalances.forEach(balance -> {
        DecimalFormat formatter = new DecimalFormat("#,###.##");
        try {
          // BigDecimal -> String 변환 후 포맷팅
          String frcrPchsAmt1Formatted = formatter.format(balance.getFrcrPchsAmt1().doubleValue()) ;
          frcrPchsAmt1FormattedList.add(frcrPchsAmt1Formatted);

          String frcrEvluPflsAmtFormatted = formatter.format(balance.getFrcrEvluPflsAmt().doubleValue()) ;
          frcrEvluPflsAmtFormattedList.add(frcrEvluPflsAmtFormatted);

          String nowPric2Formatted = formatter.format(balance.getNowPric2().doubleValue());
          nowPric2FormattedList.add(nowPric2Formatted);

          String pchsAvgPricFormatted = formatter.format(balance.getPchsAvgPric().doubleValue());
          pchsAvgPricFormattedList.add(pchsAvgPricFormatted);

          String evluPflsRtFormatted = balance.getEvluPflsRt().toString() + " %";
          evluPflsRtFormattedList.add(evluPflsRtFormatted);

        } catch (NumberFormatException e) {
          e.printStackTrace();
        }
      });
    }
    model.addAttribute("overseasBalances", overseasBalances);
    model.addAttribute("frcrPchsAmt1FormattedList", frcrPchsAmt1FormattedList);
    model.addAttribute("frcrEvluPflsAmtFormattedList", frcrEvluPflsAmtFormattedList);
    model.addAttribute("nowPric2FormattedList", nowPric2FormattedList);
    model.addAttribute("pchsAvgPricFormattedList", pchsAvgPricFormattedList);
    model.addAttribute("evluPflsRtFormattedList", evluPflsRtFormattedList);


      // 현재 달의 해외 거래내역만 필터링하여 가져오기
    LocalDate now = LocalDate.now();
    List<OverseasContractDTO> overseasContracts = overseasContractService.getAllContracts()
        .stream()
        .filter(contract -> {
          LocalDate contractDate = new java.sql.Date(contract.getOrdDt().getTime()).toLocalDate();
          return contractDate.getMonth() == now.getMonth() && contractDate.getYear() == now.getYear();
        })
        .collect(Collectors.toList());

// 포맷된 총 체결 금액과 주문 단가를 저장할 리스트
    List<String> formattedFtCcldAmt3List = new ArrayList<>();
    List<String> formattedFtOrdUnpr3List = new ArrayList<>();

// 총 체결 금액과 주문 단가를 포맷팅하여 리스트에 추가
    overseasContracts.forEach(contract -> {
      DecimalFormat formatter = new DecimalFormat("#,###");
      try {
        String formattedFtCcldAmt3 = formatter.format(contract.getFtCcldAmt3().doubleValue()) + " USD";
        formattedFtCcldAmt3List.add(formattedFtCcldAmt3);

        String formattedFtOrdUnpr3 = formatter.format(contract.getFtOrdUnpr3().doubleValue()) + " USD";
        formattedFtOrdUnpr3List.add(formattedFtOrdUnpr3);

      } catch (NumberFormatException e) {
        e.printStackTrace();
      }
    });

// 모델에 포맷된 리스트 추가
    model.addAttribute("formattedFtCcldAmt3List", formattedFtCcldAmt3List);
    model.addAttribute("formattedFtOrdUnpr3List", formattedFtOrdUnpr3List);
    model.addAttribute("contracts", overseasContracts);



    // HTML 템플릿을 반환
      return "OverseasInvestmentReport";
    }
  }
