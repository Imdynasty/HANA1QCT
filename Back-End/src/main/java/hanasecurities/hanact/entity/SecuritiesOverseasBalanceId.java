package hanasecurities.hanact.entity;
import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecuritiesOverseasBalanceId implements Serializable {

  private String accountId;
  private String ovrsPdno;

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    SecuritiesOverseasBalanceId that = (SecuritiesOverseasBalanceId) o;
    return Objects.equals(accountId, that.accountId) && Objects.equals(ovrsPdno,
        that.ovrsPdno);
  }

  @Override
  public int hashCode() {
    return Objects.hash(accountId, ovrsPdno);
  }
// Constructors, Getters, Setters, equals(), and hashCode() methods
}