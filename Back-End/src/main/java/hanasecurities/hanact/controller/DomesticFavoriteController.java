package hanasecurities.hanact.controller;

import hanasecurities.hanact.dto.DomesticFavoriteDTO;
import hanasecurities.hanact.service.DomesticStockFavoriteService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/domestic/favorite")
public class DomesticFavoriteController {

  @Autowired
  private DomesticStockFavoriteService domesticStockFavoriteService;

  @GetMapping
  public ResponseEntity<List<DomesticFavoriteDTO>> getFavoriteStocks(@RequestParam String customerId) {
    return ResponseEntity.ok(domesticStockFavoriteService.findAllFavoriteStocks(customerId));
  }

  @PostMapping
  public ResponseEntity<DomesticFavoriteDTO> addFavoriteStock(@RequestParam String customerId, @RequestBody DomesticFavoriteDTO favoriteStock) {
    return ResponseEntity.ok(domesticStockFavoriteService.addFavoriteStock(customerId, favoriteStock));
  }
  @DeleteMapping
  public ResponseEntity<String> removeFavoriteStock(@RequestParam String customerId, @RequestBody DomesticFavoriteDTO favoriteStock) {
    domesticStockFavoriteService.removeFavoriteStock(customerId, favoriteStock);
    return ResponseEntity.ok("Favorite stock removed successfully");
  }
}
