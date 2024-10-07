import React, { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import { Carousel, Card, Spin } from "antd";
import { Box, Typography } from "@mui/material";
import AssetDistributionChart from "./AssetDistributionChart";
import "../../css/Totalassets.css"; // CSS 파일 임포트
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssetSummary = ({ accountId }) => {
  const [domesticData, setDomesticData] = useState(null);
  const [foreignData, setForeignData] = useState(null); // 해외 자산 데이터
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cashTotal, setCashTotal] = useState(0);
  const [loadingTotalAmount, setLoadingTotalAmount] = useState(true);

  const handleCashTotalChange = (newCashTotal) => {
    setCashTotal(newCashTotal);
  };

  const handleSummaryImageClick = async () => {
    try {
      const response = await fetch(
        "http://54.180.14.45:5000/update_overseas_balance_summary",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("해외자산 업데이트 완료.");
      } else {
        toast.error("Failed to update overseas balance.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error occurred while updating overseas balance.");
    }
  };
  const updateTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24시간 형식으로 표시
    });
    setCurrentTime(formattedTime);
  };

  useEffect(() => {
    updateTime(); // 컴포넌트가 처음 렌더링될 때 시간을 설정합니다.
  }, []);

  const getSymbolImage = (profitLossRate) => {
    return profitLossRate < 0
      ? `${process.env.PUBLIC_URL}/img/stockplusminus/stockminus.png`
      : `${process.env.PUBLIC_URL}/img/stockplusminus/stockplus.png`; // 플러스 기호 이미지 경로
  };

  // 평가손익률 계산 함수
  const calculateProfitLossRate = (profitLoss, purchaseAmount) => {
    if (!profitLoss || !purchaseAmount) {
      return null;
    }
    return ((profitLoss / purchaseAmount) * 100).toFixed(2);
  };

  useEffect(() => {
    // 국내 자산 데이터 가져오기
    const fetchDomesticData = axios.get(
      `http://13.125.78.241:8081/balances/domestic/summary/${accountId}`
    );

    // 해외 자산 데이터 가져오기
    const fetchForeignData = axios.get(
      `http://13.125.78.241:8081/balances/overseas/summary/${accountId}`
    );

    axios
      .all([fetchDomesticData, fetchForeignData])
      .then(
        axios.spread((domesticRes, foreignRes) => {
          setDomesticData(domesticRes.data);
          setForeignData(foreignRes.data);

          // 데이터를 받은 후 1초 동안 스켈레톤을 보여주고 값을 렌더링
          setTimeout(() => {
            setLoadingTotalAmount(false);
          }, 2000); // 1초 지연 후 스켈레톤을 숨기고 데이터를 보여줌
        })
      )
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accountId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh">
        <Spin size="large" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh">
        <Typography variant="h6" color="error">
          데이터를 불러오는 중 오류가 발생했습니다.
        </Typography>
      </Box>
    );
  }
  // 국내 자산과 해외 자산을 합산한 총 평가 금액 및 손익 계산
  const totalEvaluationAmount =
    Number(domesticData?.totEvluAmt || 0) +
    Number(foreignData?.totAsstAmt || 0) +
    cashTotal; // 총 자산에 예수금 추가

  const totalProfitLossAmount =
    Number(domesticData?.evluPflsSmtlAmt || 0) +
    Number(foreignData?.ovrsTotPfls || 0);

  const totalPurchaseAmount =
    Number(domesticData?.pchsAmtSmtlAmt || 0) +
    Number(foreignData?.frcrBuyAmtSmtl1 || 0);

  const totalProfitLossRate = calculateProfitLossRate(
    totalProfitLossAmount,
    totalPurchaseAmount
  );

  const domesticProfitLossRate = calculateProfitLossRate(
    domesticData?.evluPflsSmtlAmt,
    domesticData?.pchsAmtSmtlAmt
  );

  const foreignProfitLossRate = calculateProfitLossRate(
    foreignData?.ovrsTotPfls,
    foreignData?.frcrBuyAmtSmtl1
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        alignContent: "center",
        width: "1000px",
        height: "90%",
        position: "relative",
      }}>
      <ToastContainer />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          width: "100%",
        }}>
        <Box className="asset-summary-container">
          <Carousel dotPosition="bottom">
            {/* 총 자산 현황 */}
            <Card className="asset-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingBottom: "20px",
                }}>
                <Typography
                  style={{
                    fontSize: "2.4em",
                    fontWeight: "500",
                    marginRight: "8px",
                    fontFamily: "Noto Sans KR",
                  }}>
                  하나증권자산
                </Typography>
                <span
                  style={{
                    color: "gray",
                    fontSize: "2.3em",
                    cursor: "pointer",
                  }}
                  className="material-symbols-outlined"
                  onClick={handleSummaryImageClick}>
                  error
                </span>
                {/* ! 아이콘 */}
                <Typography
                  style={{
                    fontSize: "1.4em",
                    marginLeft: "auto",
                    color: "gray",
                    paddingBottom: "7px",
                  }}>
                  {currentTime}
                </Typography>
                <span
                  style={{
                    color: "gray",
                    marginLeft: "6px",
                    paddingBottom: "7px",
                  }}
                  className="material-symbols-outlined"
                  onClick={updateTime}>
                  refresh
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <Box className="asset-item">
                    {loadingTotalAmount ? (
                      <Skeleton.Input
                        active
                        style={{ width: 300, height: 40, marginBottom: 20 }}
                      />
                    ) : (
                      <Typography
                        style={{
                          fontWeight: "600",
                          fontSize: "3em",
                          fontFamily: "Noto Sans KR",
                        }}
                        className="asset-value">
                        {totalEvaluationAmount
                          ? `${Number(totalEvaluationAmount).toLocaleString(
                              "ko-KR"
                            )}원`
                          : "데이터 없음"}
                      </Typography>
                    )}
                  </Box>
                  <Box className="asset-item">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={getSymbolImage(totalProfitLossRate)}
                        alt={totalProfitLossRate < 0 ? "minus" : "plus"}
                        style={{
                          width: "40px",
                          height: "43px",
                          marginRight: "8px",
                        }}
                      />
                      <Typography
                        className="profit-loss-rate"
                        style={{
                          color: totalProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                          fontSize: "1.5rem",
                        }}>
                        {totalProfitLossAmount
                          ? `${Math.abs(
                              Math.round(Number(totalProfitLossAmount))
                            ).toLocaleString("ko-KR")}원`
                          : "데이터 없음"}
                      </Typography>
                    </div>
                  </Box>
                </div>
                <Box
                  className="profit-loss-rate-circle"
                  style={{
                    backgroundColor:
                      totalProfitLossRate < 0 ? "rgb(147 227 253)" : "#ffe9ec", // 음수일 때 하늘색, 양수일 때 핑크색
                  }}>
                  <Typography
                    className="profit-loss-rate"
                    style={{
                      color: totalProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      paddingLeft: "4px",
                    }}>
                    {totalProfitLossRate !== null
                      ? `${Math.abs(totalProfitLossRate)}%`
                      : "데이터 없음"}
                  </Typography>
                </Box>
              </div>
            </Card>
          </Carousel>
        </Box>
        <Box className="asset-summary-container">
          <Carousel
            autoplay
            fade="true"
            autoplaySpeed="50"
            dotPosition="bottom">
            {/* 국내 자산 현황 */}
            <Card className="asset-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingBottom: "20px",
                }}>
                <Typography
                  style={{
                    fontSize: "2.4em",
                    fontWeight: "500",
                    marginRight: "8px",
                    fontFamily: "Noto Sans KR",
                  }}>
                  국내자산
                </Typography>
                <span
                  style={{
                    color: "gray",
                    fontSize: "2.3em",
                    paddingBottom: "3px",
                  }}
                  className="material-symbols-outlined">
                  error
                </span>
                {/* ! 아이콘 */}
                <Typography
                  style={{
                    fontSize: "1.4em",
                    marginLeft: "auto",
                    color: "gray",
                    paddingBottom: "7px",
                  }}>
                  {currentTime}
                </Typography>
                <span
                  style={{
                    color: "gray",
                    marginLeft: "6px",
                    paddingBottom: "7px",
                  }}
                  className="material-symbols-outlined"
                  onClick={updateTime}>
                  refresh
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <Box className="asset-item">
                    <Typography
                      style={{
                        fontWeight: "600",
                        fontSize: "3em",
                        fontFamily: "Noto Sans KR",
                      }}
                      className="asset-value">
                      {domesticData?.totEvluAmt
                        ? `${Number(domesticData.totEvluAmt).toLocaleString(
                            "ko-KR"
                          )}원`
                        : "데이터 없음"}
                    </Typography>
                  </Box>
                  <Box className="asset-item">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={getSymbolImage(domesticProfitLossRate)}
                        alt={domesticProfitLossRate < 0 ? "minus" : "plus"}
                        style={{
                          width: "40px",
                          height: "43px",
                          marginRight: "8px",
                        }}
                      />
                      <Typography
                        className="profit-loss-rate"
                        style={{
                          color: domesticProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                          fontSize: "1.5rem",
                        }}>
                        {domesticData?.evluPflsSmtlAmt
                          ? `${Math.abs(
                              Number(domesticData.evluPflsSmtlAmt)
                            ).toLocaleString("ko-KR")}원`
                          : "데이터 없음"}
                      </Typography>
                    </div>
                  </Box>
                </div>
                <Box
                  className="profit-loss-rate-circle"
                  style={{
                    backgroundColor:
                      domesticProfitLossRate < 0
                        ? "rgb(147 227 253)"
                        : "#ffe9ec", // 음수일 때 하늘색, 양수일 때 핑크색
                  }}>
                  <Typography
                    className="profit-loss-rate"
                    style={{
                      color: domesticProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      paddingLeft: "4px",
                    }}>
                    {domesticProfitLossRate !== null
                      ? `${Math.abs(domesticProfitLossRate)}%`
                      : "데이터 없음"}
                  </Typography>
                </Box>
              </div>
            </Card>

            {/* 해외 자산 현황 */}
            <Card className="asset-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingBottom: "20px",
                }}>
                <Typography
                  style={{
                    fontSize: "2.4em",
                    fontWeight: "500",
                    marginRight: "8px",
                    fontFamily: "Noto Sans KR",
                  }}>
                  해외자산
                </Typography>
                <span
                  style={{
                    color: "gray",
                    fontSize: "2.3em",
                    paddingBottom: "3px",
                  }}
                  className="material-symbols-outlined">
                  error
                </span>
                {/* ! 아이콘 */}
                <Typography
                  style={{
                    fontSize: "1.4em",
                    marginLeft: "auto",
                    color: "gray",
                    paddingBottom: "7px",
                  }}>
                  {currentTime}
                </Typography>
                <span
                  style={{
                    color: "gray",
                    marginLeft: "6px",
                    paddingBottom: "7px",
                  }}
                  className="material-symbols-outlined"
                  onClick={updateTime}>
                  refresh
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <Box className="asset-item">
                    <Typography
                      style={{
                        fontWeight: "600",
                        fontSize: "3em",
                        fontFamily: "Noto Sans KR",
                      }}
                      className="asset-value">
                      {foreignData?.totAsstAmt
                        ? `${Number(foreignData.totAsstAmt).toLocaleString(
                            "ko-KR"
                          )}원`
                        : "데이터 없음"}
                    </Typography>
                  </Box>
                  <Box className="asset-item">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={getSymbolImage(foreignProfitLossRate)}
                        alt={foreignProfitLossRate < 0 ? "minus" : "plus"}
                        style={{
                          width: "40px",
                          height: "43px",
                          marginRight: "8px",
                        }}
                      />
                      <Typography
                        className="profit-loss-rate"
                        style={{
                          color: foreignProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                          fontSize: "1.5rem",
                        }}>
                        {foreignData?.ovrsTotPfls
                          ? `${Math.abs(
                              Math.round(Number(foreignData.ovrsTotPfls))
                            ).toLocaleString("ko-KR")}원`
                          : "데이터 없음"}
                      </Typography>
                    </div>
                  </Box>
                </div>
                <Box
                  className="profit-loss-rate-circle"
                  style={{
                    backgroundColor:
                      foreignProfitLossRate < 0
                        ? "rgb(147 227 253)"
                        : "#ffe9ec", // 음수일 때 하늘색, 양수일 때 핑크색
                  }}>
                  <Typography
                    className="profit-loss-rate"
                    style={{
                      color: foreignProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      paddingLeft: "4px",
                    }}>
                    {foreignProfitLossRate !== null
                      ? `${Math.abs(foreignProfitLossRate)}%`
                      : "데이터 없음"}
                  </Typography>
                </Box>
              </div>
            </Card>
          </Carousel>
        </Box>
      </div>

      <AssetDistributionChart
        accountId="종합위탁"
        onCashTotalChange={handleCashTotalChange}
      />
    </div>
  );
};

export default AssetSummary;
