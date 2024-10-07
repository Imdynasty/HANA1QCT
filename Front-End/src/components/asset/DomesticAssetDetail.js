import React, { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";
import "../../css/AssetDetail.css"; // 필요에 따라 CSS 파일을 생성하여 스타일을 조정하세요.
import { Carousel, Button } from "antd";
const won = `${process.env.PUBLIC_URL}/img/moneyicon/won.png`;
const stockqty = `${process.env.PUBLIC_URL}/img/stockplusminus/stockqty.png`;
const AssetDetail = ({ summary, stockDetails }) => {
  const carouselRef = useRef();

  const nextSlide = () => {
    carouselRef.current.next(); // 다음 슬라이드로 이동
  };

  const prevSlide = () => {
    carouselRef.current.prev(); // 이전 슬라이드로 이동
  };

  const COLORS = [
    "#fdda42",
    "#079887",
    "#83b666",
    "#ff8385",
    "#faa681",
    "#be81fa",
    "#81c2fa",
  ];
  // 전체 보유 주식 수량 합계 계산
  const totalQuantity = stockDetails.reduce(
    (sum, stock) => sum + Number(stock.hldgQty),
    0
  );
  const getSymbolImage = (profitLossRate) => {
    return profitLossRate < 0
      ? `${process.env.PUBLIC_URL}/img/stockplusminus/stockminus.png`
      : `${process.env.PUBLIC_URL}/img/stockplusminus/stockplus.png`;
  };

  // 각 주식의 보유 수량 비율로 파이차트 데이터 생성
  const pieData = stockDetails.map((stock) => ({
    name: stock.prdtName,
    value: Number(((Number(stock.hldgQty) / totalQuantity) * 100).toFixed(2)), // 보유 수량 비율 계산, 숫자로 변환
  }));

  const calculateProfitLossRate = (profitLoss, purchaseAmount) => {
    if (!profitLoss || !purchaseAmount) {
      return null;
    }
    return ((profitLoss / purchaseAmount) * 100).toFixed(2);
  };
  const domesticProfitLossRate = calculateProfitLossRate(
    summary?.evluPflsSmtlAmt,
    summary?.pchsAmtSmtlAmt
  );

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central">
        {/* {`${(percent * 100).toFixed(0)}%`} */}
      </text>
    );
  };

  return (
    <div className="asset-detail-container">
      <div className="asset-summary">
        <h2>국내주식 평가금액</h2>
        <div
          style={{
            fontSize: "27px",
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
            {summary?.totEvluAmt
              ? `${Number(summary.totEvluAmt).toLocaleString("ko-KR")}원`
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
          <span
            style={{
              fontSize: "1.5rem",
              marginRight: "20px",
              fontWeight: "700",
            }}>
            손익률
          </span>

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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
          }}>
          <span
            style={{
              fontSize: "1.5rem",
              marginRight: "20px",
              fontWeight: "700",
            }}>
            평가손익금액
          </span>
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
                fontSize: "1.5rem",
                fontFamily: "Noto Sans KR",
                fontWeight: "600",
              }}>
              {summary?.evluPflsSmtlAmt
                ? `${Math.abs(Number(summary.evluPflsSmtlAmt)).toLocaleString(
                    "ko-KR"
                  )}원`
                : "데이터 없음"}
            </Typography>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            borderTop: "1px dashed #ccc",
            margin: "20px 0",
          }}></div>

        <div className="pie-chart-container">
          <div style={{ textAlign: "left", width: "100%" }}>
            <span
              style={{
                fontSize: "2rem",
                marginRight: "20px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}>
              종목별 비중
              <span
                style={{
                  color: "grey",
                  marginLeft: "10px",
                  fontSize: "2rem",
                }}
                className="material-symbols-outlined">
                error
              </span>
            </span>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}>
            <ResponsiveContainer width="35%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="legend-list">
              {pieData.map((entry, index) => (
                <li key={`item-${index}`}>
                  <span
                    className="legend-color"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}></span>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}>
                    <span>{entry.name}</span>
                    <span>{entry.value}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="stock-detail">
        <div className="havestock">
          <span style={{ color: "white", fontWeight: "500" }}> 국내주식</span>{" "}
          <span style={{ color: "rgb(236 212 89)", fontWeight: "700" }}>
            {stockDetails.length}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            borderTop: "1px dashed #ccc",
            margin: "20px 0",
          }}></div>
        <Carousel
          ref={carouselRef}
          dots={false}
          style={{ height: "300px", overflow: "auto" }}>
          {stockDetails.map((stock, index) => (
            <div key={index} className="stock-item">
              <div
                style={{
                  fontSize: "18px",
                  marginBottom: "10px",
                  marginRight: "25px",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "grey",
                  marginLeft: "2px",
                }}>
                <span style={{ marginLeft: "25px" }}>코스피</span>
                <span style={{ marginLeft: "10px" }}>50112746-01</span>
              </div>
              <div className="stock-header">
                <h3
                  style={{
                    fontWeight: "700",
                    fontFamily: "Noto Sans KR",
                    marginLeft: "25px",
                  }}>
                  {stock.prdtName}
                </h3>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginRight: "25px",
                  }}>
                  <div
                    style={{
                      display: "flex",

                      marginRight: "20px",
                    }}>
                    <img
                      src={won}
                      style={{
                        width: "33px",
                        height: "33px",
                        marginRight: "5px",
                      }}
                    />
                    <h3 style={{ fontWeight: "bold" }}>
                      {(
                        Number(stock.pchsAmt) + Number(stock.evluPflsAmt)
                      ).toLocaleString()}
                      원
                    </h3>
                  </div>
                  <div
                    style={{
                      border: "1px solid pink",
                      borderRadius: "10px",
                      width: "40px",
                      textAlign: "center",
                      backgroundColor: "pink",
                      fontWeight: "bold",
                      fontSize: "15px",
                      height: "28px",
                      paddingTop: "1px",
                      color: "#cb132a",
                      marginTop: "5px",
                    }}>
                    현금
                  </div>
                </div>
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
                  justifyContent: "space-between",
                  fontSize: "18px",
                  marginLeft: "25px",
                }}>
                <p>보유수량</p>
                <div style={{ display: "flex", marginRight: "25px" }}>
                  <img
                    src={stockqty}
                    style={{
                      width: "33px",
                      height: "30px",
                      marginRight: "5px",
                    }}
                  />
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {Number(stock.hldgQty).toLocaleString()}주
                  </span>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  borderTop: "1px dashed #ccc",
                  marginBottom: "20px",
                }}></div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  marginLeft: "25px",
                }}>
                <span>평균단가</span>
                <div style={{ display: "flex", marginRight: "25px" }}>
                  <img
                    src={won}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "5px",
                      marginBottom: "3px",
                    }}
                  />
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {Math.round(Number(stock.pchsAvgPric)).toLocaleString()}원
                  </span>
                </div>
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
                  justifyContent: "space-between",
                  fontSize: "18px",
                  marginLeft: "25px",
                }}>
                <span>평가손익</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "25px",
                  }}>
                  <img
                    src={getSymbolImage(Number(stock.evluPflsAmt))}
                    alt="profit-loss"
                    style={{ width: "20px", marginRight: "5px" }}
                  />
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: Number(stock.evluPflsAmt) < 0 ? "blue" : "red",
                    }}>
                    {Math.abs(Number(stock.evluPflsAmt)).toLocaleString()}원
                  </span>
                </div>
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
                  justifyContent: "space-between",
                  fontSize: "18px",
                  marginLeft: "25px",
                }}>
                <span>손익률</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "25px",
                  }}>
                  <img
                    src={getSymbolImage(Number(stock.evluPflsRt))}
                    alt="profit-loss-rate"
                    style={{ width: "20px", marginRight: "5px" }}
                  />
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: Number(stock.evluPflsRt) < 0 ? "blue" : "red",
                    }}>
                    {Math.abs(Number(stock.evluPflsRt)).toLocaleString()}%
                  </span>
                </div>
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
                  justifyContent: "space-between",
                  fontSize: "18px",
                  marginLeft: "25px",
                }}>
                <span>매입금액</span>
                <div style={{ display: "flex", marginRight: "25px" }}>
                  <img
                    src={won}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "5px",
                      marginBottom: "3px",
                    }}
                  />
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {Number(stock.pchsAmt).toLocaleString()}원
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  borderTop: "1px dashed #ccc",
                  marginTop: "20px",
                }}></div>
            </div>
          ))}
        </Carousel>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
            marginRight: "20px",
          }}>
          <Button style={{ marginRight: "10px" }} onClick={prevSlide}>
            <span className="material-symbols-outlined">
              line_start_arrow_notch
            </span>
          </Button>
          <Button onClick={nextSlide}>
            <span className="material-symbols-outlined">
              line_end_arrow_notch
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
