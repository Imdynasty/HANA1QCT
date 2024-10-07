package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.DomesticStockPriceDTO;
import hanasecurities.hanact.dto.StockPriceDifferenceDTO;
import hanasecurities.hanact.entity.DomesticStockPrice;
import hanasecurities.hanact.repository.DomesticStockPriceRepository;
import java.util.Comparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DomesticStockPriceService {

  @Autowired
  private DomesticStockPriceRepository repository;

  public List<DomesticStockPriceDTO> getStockPricesByCode(String stockcode) {
    List<DomesticStockPrice> stockPrices = repository.findByStockcode(stockcode);
    return stockPrices.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  private DomesticStockPriceDTO convertToDto(DomesticStockPrice stockPrice) {
    DomesticStockPriceDTO dto = new DomesticStockPriceDTO();
    dto.setStockcode(stockPrice.getStockcode());
    dto.setTradingDate(stockPrice.getTradingDate());
    dto.setClosePrice(stockPrice.getClosePrice());
    dto.setOpenPrice(stockPrice.getOpenPrice());
    dto.setHighPrice(stockPrice.getHighPrice());
    dto.setLowPrice(stockPrice.getLowPrice());
    dto.setVolume(stockPrice.getVolume());
    dto.setChangePercentage(stockPrice.getChangePercentage());
    return dto;
  }

  public StockPriceDifferenceDTO getStockPriceDifference(String stockCode) {
    List<DomesticStockPrice> prices = repository.findByStockcode(stockCode);

    if (prices.isEmpty()) {
      return null; // 또는 예외 처리
    }

    // prices를 tradingDate 기준으로 오름차순 정렬 (가장 오래된 날짜부터 최신 날짜까지)
    prices.sort(Comparator.comparing(DomesticStockPrice::getTradingDate));

    DomesticStockPrice first = prices.get(0); // 가장 오래된 데이터
    DomesticStockPrice last = prices.get(prices.size() - 1); // 가장 최신 데이터

    long volumeDifference = last.getVolume() - first.getVolume();
    double closePriceDifference = last.getClosePrice() - first.getClosePrice();

    return new StockPriceDifferenceDTO(volumeDifference, closePriceDifference);
  }

}
