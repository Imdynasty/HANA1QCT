package hanasecurities.hanact.service;


import hanasecurities.hanact.dto.OverseasStockDTO;
import hanasecurities.hanact.entity.OverseasFavorite;
import hanasecurities.hanact.entity.OverseasStock;
import hanasecurities.hanact.entity.SecuritiesOverseasBalance;
import hanasecurities.hanact.repository.OverseasStockFavoriteRepository;
import hanasecurities.hanact.repository.OverseasStockRepository;
import hanasecurities.hanact.repository.SecuritiesOverseasBalanceRepository;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class OverseasStockIndustryService {

  private final OverseasStockFavoriteRepository overseasFavoriteRepository;
  private final OverseasStockRepository overseasStockRepository;
  private final SecuritiesOverseasBalanceRepository securitiesOverseasBalanceRepository;

  public OverseasStockIndustryService(OverseasStockFavoriteRepository overseasFavoriteRepository,
      OverseasStockRepository overseasStockRepository,
      SecuritiesOverseasBalanceRepository securitiesOverseasBalanceRepository) {
    this.overseasFavoriteRepository = overseasFavoriteRepository;
    this.overseasStockRepository = overseasStockRepository;
    this.securitiesOverseasBalanceRepository = securitiesOverseasBalanceRepository;
  }

 public List<OverseasStockDTO> getFavoriteIndustries(String customerId) {
    List<OverseasFavorite> favorites = overseasFavoriteRepository.findByCustomerId(customerId);
    return favorites.stream()
        .map(favorite -> overseasStockRepository.findById(favorite.getStockCode()))
        .filter(Optional::isPresent)
        .map(optionalStock -> {
          OverseasStock stock = optionalStock.get();
          return new OverseasStockDTO(
              stock.getStockCode(),
              stock.getStockName(),
              stock.getIndustry(),
              stock.getIssuedShares()
          );
        })
        .collect(Collectors.toList());

 }

 public List<OverseasStockDTO> getTopInvestmentIndustries(String accountId) {

    List<SecuritiesOverseasBalance> balances = securitiesOverseasBalanceRepository.findByAccountId(accountId);

    return balances.stream()
        .sorted(Comparator.comparing(balance -> BigDecimal.valueOf(
            ((SecuritiesOverseasBalance) balance).getFrcrPchsAmt1())).reversed())
        .map(balance -> overseasStockRepository.findById(balance.getOvrsPdno()))
        .filter(Optional::isPresent)
        .map(optionalStock -> {
          OverseasStock stock = optionalStock.get();
          return new OverseasStockDTO(
              stock.getStockCode(),
              stock.getStockName(),
              stock.getIndustry(),
              stock.getIssuedShares()
          );
        })
        .collect(Collectors.toList());
  }
}
