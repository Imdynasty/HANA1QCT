import React, { useState, useEffect } from "react";
import axios from "axios";

import { Card, Spin, Modal, Button, Skeleton } from "antd";
import { Box, Typography } from "@mui/material";
import AssetBalanceOverview from "./AssetTotalBalanceOverview";
import AssetDetail from "./DomesticAssetDetail.js";
import OverseasAssetDetail from "./OverseasAssetDetail.js";
import CircularProgress from "@mui/material/CircularProgress";
import "../../css/Trading.css"; // 필요한 CSS 파일

const won = `${process.env.PUBLIC_URL}/img/moneyicon/won.png`;
const us = `${process.env.PUBLIC_URL}/img/moneyicon/us.png`;
const TotalAssetsOverview = ({ accountId }) => {
  const [exchangeRate, setExchangeRate] = useState(1);
  const [domesticData, setDomesticData] = useState(null);
  const [foreignData, setForeignData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stockDetails, setStockDetails] = useState([]);
  const [stockOverseasDetails, setstockOverseasDetails] = useState([]);
  const [modalContent, setModalContent] = useState(null); // 추가: 모달에 들어갈 콘텐츠 상태
  const [cashTotal, setCashTotal] = useState(0);

  const handleCashTotalChange = (newCashTotal) => {
    setCashTotal(newCashTotal);
  };

  const showModal = (content) => {
    setModalContent(content); // 모달 콘텐츠 설정
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const getSymbolImage = (profitLossRate) => {
    return profitLossRate < 0
      ? `${process.env.PUBLIC_URL}/img/stockplusminus/stockminus.png`
      : `${process.env.PUBLIC_URL}/img/stockplusminus/stockplus.png`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 로딩 시작
      try {
        // 모든 비동기 요청을 병렬로 실행
        const [
          exchangeRateResponse,
          domesticDataResponse,
          foreignDataResponse,
          stockDetailsResponse,
          overseasStockDetailsResponse,
        ] = await Promise.all([
          axios.get("http://13.125.78.241:8081/securities/exchangerates"),
          axios.get(
            `http://13.125.78.241:8081/balances/domestic/summary/${accountId}`
          ),
          axios.get(
            `http://13.125.78.241:8081/balances/overseas/summary/${accountId}`
          ),
          axios.get(`http://13.125.78.241:8081/balances/domestic/${accountId}`),
          axios.get(`http://13.125.78.241:8081/balances/overseas`),
        ]);

        // 환율 데이터 처리
        const rates = exchangeRateResponse.data;
        if (rates && rates.length > 0) {
          const latestRate = rates[rates.length - 1];
          setExchangeRate(latestRate.tradingStandardRate);
        }

        // 국내 및 해외 데이터 처리
        setDomesticData(domesticDataResponse.data);
        setForeignData(foreignDataResponse.data);

        // 국내 및 해외 주식 상세 데이터 처리
        setStockDetails(stockDetailsResponse.data);
        setstockOverseasDetails(overseasStockDetailsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        // setLoading(false);
      } finally {
        // setTimeout을 사용해 820ms 후에 로딩 종료
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchData();
  }, [accountId]);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "200px",
        }}>
        <CircularProgress
          disableShrink
          size={100}
          color="inherit"
          thickness={2}
        />
      </div>
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
  const calculateProfitLossRate = (profitLoss, purchaseAmount) => {
    if (!profitLoss || !purchaseAmount) {
      return null;
    }
    return ((profitLoss / purchaseAmount) * 100).toFixed(2);
  };
  const totalEvaluationAmount =
    Number(domesticData?.totEvluAmt || 0) +
    Number(foreignData?.totAsstAmt || 0) +
    cashTotal;

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
    <div>
      <AssetBalanceOverview
        accountId="종합위탁"
        onCashTotalChange={handleCashTotalChange}
      />
      {/* 총자산현황 */}
      <div className="tradingcard" style={{ marginTop: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "0 20px 0 20px",
            padding: "20px",
            paddingTop: "40px",
            alignItems: "center",
          }}>
          <div>
            <div
              style={{
                borderRadius: "20px",
                width: "30%",
                height: "30px",
                backgroundColor: "#f0f0f0",
                fontSize: "1.2em",

                marginBottom: "10px",
              }}>
              총자산
            </div>

            <Box
              style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <div
                style={{
                  fontSize: "24px",
                  paddingRight: "15px",
                  display: "flex",
                  alignItems: "center",
                }}>
                <img
                  src={won}
                  style={{
                    width: "50px",
                    height: "50px",
                    marginRight: "5px",
                  }}
                />
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "1.5em",
                    paddingTop: "8px",
                    fontFamily: "Noto Sans KR",
                  }}
                  className="asset-value">
                  {totalEvaluationAmount
                    ? `${Number(totalEvaluationAmount).toLocaleString(
                        "ko-KR"
                      )}원`
                    : "데이터 없음"}
                </Typography>
              </div>
            </Box>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <span style={{ fontSize: "1.5rem", marginRight: "20px" }}>
                평가손익
              </span>
              <img
                src={getSymbolImage(totalProfitLossRate)}
                alt={totalProfitLossRate < 0 ? "minus" : "plus"}
                style={{
                  width: "30px",
                  height: "33px",
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
            <div
              style={{
                width: "100%",
                borderTop: "1px dashed #ccc",
                margin: "20px 0",
              }}></div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <span style={{ fontSize: "1.5rem", marginRight: "20px" }}>
                평가손익률
              </span>
              <div style={{ display: "flex" }}>
                <img
                  src={getSymbolImage(totalProfitLossRate)}
                  alt={totalProfitLossRate < 0 ? "minus" : "plus"}
                  style={{
                    width: "30px",
                    height: "33px",
                    marginRight: "8px",
                  }}
                />
                <Typography
                  className="profit-loss-rate"
                  style={{
                    color: totalProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                    fontSize: "1.5rem",
                  }}>
                  {totalProfitLossRate !== null
                    ? `${Math.abs(totalProfitLossRate)}%`
                    : "데이터 없음"}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 국내,해외 자산 현황 */}
      <div style={{ display: "flex" }}>
        <Box className="asset-summary-container assetsummary1 ">
          <Card className="asset-card assetcard">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingBottom: "20px",
                width: "100%",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <div
                  style={{
                    borderRadius: "20px",
                    width: "30%",
                    height: "30px",
                    backgroundColor: "#f0f0f0",
                    fontSize: "1.2em",
                    paddingTop: "2px",
                  }}>
                  국내주식
                </div>
                <div
                  className="asset-detail"
                  style={{
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "auto", // 추가: 이 속성으로 요소가 최대한 오른쪽으로 이동하도록 함
                  }}
                  onClick={() =>
                    showModal(
                      <AssetDetail
                        summary={domesticData}
                        stockDetails={stockDetails}
                      />
                    )
                  }>
                  <span>자세히보기</span>
                  <span
                    style={{ paddingLeft: "5px" }}
                    className="material-symbols-outlined">
                    loupe
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              {/* 국내자산 현황 */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ marginBottom: "30px" }}>
                  <div>
                    <div
                      style={{
                        fontSize: "24px",
                        paddingRight: "15px",
                        display: "flex",
                        alignItems: "center",
                      }}>
                      <img
                        src={won}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "5px",
                        }}
                      />
                      <Typography
                        style={{
                          fontWeight: "600",
                          fontSize: "2rem",
                          fontFamily: "Noto Sans KR",
                          marginBottom: "10px",
                          paddingTop: "15px",
                        }}
                        className="asset-value">
                        {domesticData?.totEvluAmt
                          ? `${Number(domesticData.totEvluAmt).toLocaleString(
                              "ko-KR"
                            )}원`
                          : "데이터 없음"}
                      </Typography>
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "left",
                      paddingLeft: "8px",
                      color: "grey",
                    }}>
                    50112746-01
                  </div>
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingTop: "10px",
                  }}>
                  <div style={{ display: "flex" }}>
                    <img
                      src={getSymbolImage(domesticProfitLossRate)}
                      alt={domesticProfitLossRate < 0 ? "minus" : "plus"}
                      style={{
                        width: "30px",
                        height: "33px",
                        marginRight: "8px",
                      }}
                    />
                    <Typography
                      className="profit-loss-rate"
                      style={{
                        color: domesticProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                        fontFamily: "Noto Sans KR",
                        fontSize: "1.6rem",
                        paddingLeft: "4px",
                        fontWeight: "600",
                      }}>
                      {domesticProfitLossRate !== null
                        ? `${Math.abs(domesticProfitLossRate)}%`
                        : "데이터 없음"}
                    </Typography>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    borderTop: "1px dashed #ccc",
                    margin: "10px 0",
                  }}></div>
                <Box className="asset-item">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      marginTop: "10px",
                    }}>
                    <img
                      src={getSymbolImage(domesticProfitLossRate)}
                      alt={domesticProfitLossRate < 0 ? "minus" : "plus"}
                      style={{
                        width: "30px",
                        height: "33px",
                        marginRight: "8px",
                      }}
                    />
                    <Typography
                      className="profit-loss-rate"
                      style={{
                        color: domesticProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                        fontSize: "1.5rem",
                        fontFamily: "Noto Sans KR",
                        fontWeight: "600",
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
            </div>
          </Card>
        </Box>
        {/* 국내자산 모달 */}
        <Modal
          title={
            <div
              style={{
                textAlign: "left", // 중앙 정렬
                fontSize: "30px", // 글씨 크기
                marginLeft: "20px",
                fontWeight: "bold", // 굵은 글씨
                fontFamily: "Noto Sans KR", // 한글 폰트 적용
                display: "flex", // 요소를 가로로 나열
                alignItems: "center", // 요소를 수직 가운데로 정렬
              }}>
              <span
                style={{ paddingRight: "10px" }}
                className="material-symbols-outlined">
                arrow_back_ios
              </span>
              <span style={{ paddingTop: "3px" }}>세부 자산현황</span>{" "}
            </div>
          }
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}>
          {modalContent}
        </Modal>
        {/* 국내자산 모달끝 */}
        {/* 해외 자산 현황 */}
        <Box className="asset-summary-container assetsummary">
          <Card className="asset-card assetcard">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingBottom: "20px",
                width: "100%",
              }}>
              <div
                style={{
                  borderRadius: "20px",
                  width: "30%",
                  height: "30px",
                  backgroundColor: "#f0f0f0",
                  fontSize: "1.2em",
                  paddingTop: "2px",
                }}>
                해외주식
              </div>
              <div
                className="asset-detail"
                style={{
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto", // 추가: 이 속성으로 요소가 최대한 오른쪽으로 이동하도록 함
                }}
                onClick={() =>
                  showModal(
                    <OverseasAssetDetail
                      summary={foreignData}
                      stockDetails={stockOverseasDetails}
                      exchangeRate={exchangeRate}
                    />
                  )
                }>
                <span>자세히보기</span>
                <span
                  style={{ paddingLeft: "5px" }}
                  className="material-symbols-outlined">
                  loupe
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              {/* 해외자산 현황 */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ marginBottom: "30px" }}>
                  <div>
                    <div
                      style={{
                        fontSize: "24px",
                        paddingRight: "15px",
                        display: "flex",
                        alignItems: "center",
                      }}>
                      <img
                        src={won}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "5px",
                        }}
                      />
                      <Typography
                        style={{
                          fontWeight: "600",
                          fontSize: "2rem",
                          fontFamily: "Noto Sans KR",
                          marginBottom: "10px",
                          paddingTop: "15px",
                        }}
                        className="asset-value">
                        {foreignData?.totAsstAmt
                          ? `${Number(foreignData.totAsstAmt).toLocaleString(
                              "ko-KR"
                            )}원`
                          : "데이터 없음"}
                      </Typography>
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "left",
                      paddingLeft: "8px",
                      color: "grey",
                    }}>
                    50112746-01
                  </div>
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingTop: "10px",
                  }}>
                  <div style={{ display: "flex" }}>
                    <img
                      src={getSymbolImage(foreignProfitLossRate)}
                      alt={foreignProfitLossRate < 0 ? "minus" : "plus"}
                      style={{
                        width: "30px",
                        height: "33px",
                        marginRight: "8px",
                      }}
                    />
                    <Typography
                      className="profit-loss-rate"
                      style={{
                        color: foreignProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                        fontFamily: "Noto Sans KR",
                        fontSize: "1.6rem",
                        paddingLeft: "4px",
                        fontWeight: "600",
                      }}>
                      {foreignProfitLossRate !== null
                        ? `${Math.abs(foreignProfitLossRate)}%`
                        : "데이터 없음"}
                    </Typography>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    borderTop: "1px dashed #ccc",
                    margin: "10px 0",
                  }}></div>
                <Box className="asset-item">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      marginTop: "10px",
                    }}>
                    <img
                      src={getSymbolImage(foreignProfitLossRate)}
                      alt={foreignProfitLossRate < 0 ? "minus" : "plus"}
                      style={{
                        width: "30px",
                        height: "33px",
                        marginRight: "8px",
                      }}
                    />
                    <Typography
                      className="profit-loss-rate"
                      style={{
                        color: foreignProfitLossRate < 0 ? "blue" : "red", // 음수일 때 파란색, 양수일 때 빨간색
                        fontSize: "1.5rem",
                        fontFamily: "Noto Sans KR",
                        fontWeight: "600",
                        paddingTop: "5px",
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
            </div>
          </Card>
        </Box>
      </div>
    </div>
  );
};

export default TotalAssetsOverview;
