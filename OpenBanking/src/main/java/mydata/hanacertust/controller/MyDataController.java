package mydata.hanacertust.controller;

import com.google.gson.Gson;
import mydata.hanacertust.entity.MyDataAccount;
import mydata.hanacertust.service.MyDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import java.util.List;

@Controller
public class MyDataController {

  @Autowired
  private MyDataService myDataService;

  @GetMapping("/accounts")
  public String showSearchForm() {
    return "accounts";
  }


}

