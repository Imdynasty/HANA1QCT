package hanasecurities.hanact.entity;

import java.io.Serializable;
import java.util.Objects;


public class SecuritiesDomesticBalancesId implements Serializable {

  private String accountId;
  private String pdno;

  // 기본 생성자
  public SecuritiesDomesticBalancesId() {}

  // 모든 필드를 포함한 생성자
  public SecuritiesDomesticBalancesId(String accountId, String pdno) {
    this.accountId = accountId;
    this.pdno = pdno;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    SecuritiesDomesticBalancesId that = (SecuritiesDomesticBalancesId) o;
    return Objects.equals(accountId, that.accountId) &&
        Objects.equals(pdno, that.pdno);
  }

  @Override
  public int hashCode() {
    return Objects.hash(accountId, pdno);
  }
}
