package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.DomesticFavoriteDTO;
import hanasecurities.hanact.entity.DomesticFavorite;
import hanasecurities.hanact.repository.DomesticStockFavoriteRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.*;

@Service
public class DomesticStockFavoriteService {
  @Autowired
  private DomesticStockFavoriteRepository domesticStockFavoriteRepository;

  public List<DomesticFavoriteDTO> findAllFavoriteStocks(String customerId) {
    return domesticStockFavoriteRepository.findByCustomerId(customerId).stream()
        .map(stock -> new DomesticFavoriteDTO(stock.getStockName(), stock.getStockCode()))
        .collect(Collectors.toList());
  }

  public DomesticFavoriteDTO addFavoriteStock(String customerId, DomesticFavoriteDTO favoriteStock) {
    // 먼저 해당 종목이 이미 존재하는지 확인
    DomesticFavorite existingFavorite = domesticStockFavoriteRepository.findByCustomerIdAndStockCode(
        customerId, favoriteStock.getStockCode());

    // 이미 존재하면 null을 반환하거나, 예외를 던지는 등 적절한 처리를 합니다.
    if (existingFavorite != null) {
      System.out.println("이미 즐겨찾기에 추가된 종목입니다.");
      return null; // 또는 예외를 던질 수 있음
    }

    // 존재하지 않으면 새로 추가
    DomesticFavorite favorite = new DomesticFavorite();
    favorite.setCustomerId(customerId);
    favorite.setStockCode(favoriteStock.getStockCode());
    favorite.setStockName(favoriteStock.getStockName());
    domesticStockFavoriteRepository.save(favorite);
    return favoriteStock;
  }
  public void removeFavoriteStock(String customerId, DomesticFavoriteDTO favoriteStock) {
    DomesticFavorite favorite = domesticStockFavoriteRepository.findByCustomerIdAndStockCode(
        customerId, favoriteStock.getStockCode());
    if (favorite != null) {
      domesticStockFavoriteRepository.delete(favorite);
    }
  }

}
