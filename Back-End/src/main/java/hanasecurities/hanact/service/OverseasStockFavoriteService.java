package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.OverseasFavoriteDTO;
import hanasecurities.hanact.entity.OverseasFavorite;
import hanasecurities.hanact.repository.OverseasStockFavoriteRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OverseasStockFavoriteService {
  @Autowired
  private OverseasStockFavoriteRepository overseasStockFavoriteRepository;

  public List<OverseasFavoriteDTO> findAllFavoriteStocks(String customerId) {
    return overseasStockFavoriteRepository.findByCustomerId(customerId).stream()
        .map(stock -> new OverseasFavoriteDTO(stock.getStockName(), stock.getStockCode()))
        .collect(Collectors.toList());
  }

  public OverseasFavoriteDTO addFavoriteStock(String customerId, OverseasFavoriteDTO favoriteStock) {
    // 먼저 해당 종목이 이미 존재하는지 확인
    OverseasFavorite existingFavorite = overseasStockFavoriteRepository.findByCustomerIdAndStockCode(
        customerId, favoriteStock.getStockCode());

    // 이미 존재하면 null을 반환하거나, 예외를 던지는 등 적절한 처리를 합니다.
    if (existingFavorite != null) {
      System.out.println("이미 즐겨찾기에 추가된 종목입니다.");
      return null; // 또는 예외를 던질 수 있음
    }

    // 존재하지 않으면 새로 추가
    OverseasFavorite favorite = new OverseasFavorite();
    favorite.setCustomerId(customerId);
    favorite.setStockCode(favoriteStock.getStockCode());
    favorite.setStockName(favoriteStock.getStockName());
    overseasStockFavoriteRepository.save(favorite);
    return favoriteStock;
  }
  public void removeFavoriteStock(String customerId, OverseasFavoriteDTO favoriteStock) {
    OverseasFavorite favorite = overseasStockFavoriteRepository.findByCustomerIdAndStockCode(
        customerId, favoriteStock.getStockCode());
    if (favorite != null) {
      overseasStockFavoriteRepository.delete(favorite);
    }
  }

}
