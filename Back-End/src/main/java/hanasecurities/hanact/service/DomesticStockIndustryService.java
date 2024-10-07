package hanasecurities.hanact.service;

import hanasecurities.hanact.dto.DomesticStockDTO;
import hanasecurities.hanact.entity.DomesticFavorite;
import hanasecurities.hanact.entity.DomesticStock;
import hanasecurities.hanact.entity.SecuritiesDomesticBalances;
import hanasecurities.hanact.repository.DomesticStockFavoriteRepository;
import hanasecurities.hanact.repository.DomesticStockRepository;
import hanasecurities.hanact.repository.SecuritiesDomesticBalancesRepository;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class DomesticStockIndustryService {

  private final DomesticStockFavoriteRepository domesticFavoriteRepository;

private final DomesticStockRepository domesticStockRepository;
private final SecuritiesDomesticBalancesRepository securitiesDomesticBalancesRepository;

  public DomesticStockIndustryService(DomesticStockFavoriteRepository domesticFavoriteRepository,
      DomesticStockRepository domesticStockRepository,
      SecuritiesDomesticBalancesRepository securitiesDomesticBalancesRepository) {
    this.domesticFavoriteRepository = domesticFavoriteRepository;
    this.domesticStockRepository = domesticStockRepository;
    this.securitiesDomesticBalancesRepository = securitiesDomesticBalancesRepository;
  }

  public List<DomesticStockDTO> getFavoriteIndustries(String customerId) {
    List<DomesticFavorite> favorites = domesticFavoriteRepository.findByCustomerId(customerId);
    return favorites.stream()
        .map(favorite -> domesticStockRepository.findById(favorite.getStockCode()))
        .filter(Optional::isPresent)
        .map(optionalStock -> {
          DomesticStock stock = optionalStock.get();
          return new DomesticStockDTO(
              stock.getStockCode(),
              stock.getStockName(),
              stock.getIndustry(),
              stock.getIssuedShares()
          );
        })
        .collect(Collectors.toList());
  }

  public List<DomesticStockDTO> getTopInvestmentIndustries(String accountId) {

    List<SecuritiesDomesticBalances> balances = securitiesDomesticBalancesRepository.findByAccountId(accountId);

    return balances.stream()
        .sorted(Comparator.comparing(balance -> new BigDecimal(((SecuritiesDomesticBalances)balance).getPchsAmt())).reversed())
        .map(balance -> domesticStockRepository.findById(balance.getPdno()))
        .filter(Optional::isPresent)
        .map(optionalStock -> {
          DomesticStock stock = optionalStock.get();
          return new DomesticStockDTO(
              stock.getStockCode(),
              stock.getStockName(),
              stock.getIndustry(),
              stock.getIssuedShares()
          );
        })
        .collect(Collectors.toList());
  }


  }
