package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.OverseasStockPriceDTO;
import hanasecurities.hanact.dto.OverseasStockPriceDifferenceDTO;
import hanasecurities.hanact.entity.OverseasStockPrice;
import hanasecurities.hanact.repository.OverseasStockPriceRepository;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OverseasStockPriceService {

    @Autowired
    private OverseasStockPriceRepository repository;

    public List<OverseasStockPriceDTO> getStockPricesByCode(String stockcode) {
        List<OverseasStockPrice> stockPrices = repository.findByStockcode(stockcode);
        return stockPrices.stream().map(this::convertToDto).collect(Collectors.toList());
    }

  private OverseasStockPriceDTO convertToDto(OverseasStockPrice overseasStockPrice) {
    OverseasStockPriceDTO dto = new OverseasStockPriceDTO();
    dto.setStockcode(overseasStockPrice.getStockcode());
    dto.setTradingDate(overseasStockPrice.getTradingDate());
    dto.setClosePrice(overseasStockPrice.getClosePrice());
    dto.setOpenPrice(overseasStockPrice.getOpenPrice());
    dto.setHighPrice(overseasStockPrice.getHighPrice());
    dto.setLowPrice(overseasStockPrice.getLowPrice());
    dto.setVolume(overseasStockPrice.getVolume());
    dto.setChangePercentage(overseasStockPrice.getChangePercentage());
    return dto;
  }

  public OverseasStockPriceDifferenceDTO getStockPriceDifference(String stockCode) {
    List<OverseasStockPrice> prices = repository.findByStockcode(stockCode);

    if (prices.isEmpty()) {
      return null; // 또는 예외 처리
    }
prices.sort(Comparator.comparing(OverseasStockPrice::getTradingDate));
    OverseasStockPrice first = prices.get(0);
    OverseasStockPrice last = prices.get(prices.size() - 1);

    long volumeDifference = last.getVolume() - first.getVolume();
    double closePriceDifference = last.getClosePrice() - first.getClosePrice();

    return new OverseasStockPriceDifferenceDTO(volumeDifference, closePriceDifference);
  }

}
