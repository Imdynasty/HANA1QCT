package mydata.hanacertust.controller;

import mydata.hanacertust.entity.MyDataAccount;
import mydata.hanacertust.entity.MyDataCI;
import mydata.hanacertust.service.MyDataAccountService;
import mydata.hanacertust.service.MyDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/api")
public class MyDataAccountController {

  private final MyDataAccountService myDataAccountService;
  private final MyDataService myDataService;

  @Autowired
  public MyDataAccountController(MyDataAccountService myDataAccountService,
      MyDataService myDataService) {
    this.myDataAccountService = myDataAccountService;
    this.myDataService = myDataService;
  }

  @GetMapping("/sendAccounts")
  public ResponseEntity<?> sendAccounts(@RequestParam(required = false) String ci) {
    if (ci != null) {
      Optional<MyDataCI> myDataCI = myDataAccountService.findCIById(ci);
      if (myDataCI.isPresent()) {
        List<MyDataAccount> accounts = myDataAccountService.findAccountsByCI(myDataCI.get());
        return ResponseEntity.ok(accounts);
      } else {
        return ResponseEntity.notFound().build();
      }
    } else {
      List<MyDataAccount> accounts = myDataAccountService.findAllAccounts();
      return ResponseEntity.ok(accounts);
    }
  }

  @GetMapping("/accounts")
  public String getAccounts(@RequestParam String residentNumber, Model model) {
    List<MyDataAccount> accounts = myDataService.getAccountsByResidentNumber(residentNumber);
    System.out.println("-------------received: " + accounts);
    model.addAttribute("accounts", accounts);

    return "accountDetails";  // JSP 페이지 이름
  }
}


