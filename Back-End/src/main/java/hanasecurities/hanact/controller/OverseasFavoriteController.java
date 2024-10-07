package hanasecurities.hanact.controller;

import hanasecurities.hanact.dto.DomesticFavoriteDTO;
import hanasecurities.hanact.dto.OverseasFavoriteDTO;
import hanasecurities.hanact.service.DomesticStockFavoriteService;
import hanasecurities.hanact.service.OverseasStockFavoriteService;
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
@RequestMapping("/overseas/favorite")
public class OverseasFavoriteController {

  @Autowired
  private OverseasStockFavoriteService overseasStockFavoriteService;

  @GetMapping
  public ResponseEntity<List<OverseasFavoriteDTO>> getFavoriteStocks(@RequestParam String customerId) {
    return ResponseEntity.ok(overseasStockFavoriteService.findAllFavoriteStocks(customerId));
  }

  @PostMapping
  public ResponseEntity<OverseasFavoriteDTO> addFavoriteStock(@RequestParam String customerId, @RequestBody OverseasFavoriteDTO favoriteStock) {
    return ResponseEntity.ok(overseasStockFavoriteService.addFavoriteStock(customerId, favoriteStock));
  }
  @DeleteMapping
  public ResponseEntity<String> removeFavoriteStock(@RequestParam String customerId, @RequestBody OverseasFavoriteDTO favoriteStock) {
    overseasStockFavoriteService.removeFavoriteStock(customerId, favoriteStock);
    return ResponseEntity.ok("Favorite stock removed successfully");
  }
}
