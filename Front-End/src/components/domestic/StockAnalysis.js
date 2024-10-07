import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more"; // Packed Bubble charts 지원
import { Badge } from "antd";
import ReactModal from "react-modal";
import "../../css/StockAnalysis.css";
import { to } from "react-spring";

HighchartsMore(Highcharts);

const StockAnalysisComponent = () => {
  const [matchingIndustries, setMatchingIndustries] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [priceDifferences, setPriceDifferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const currentDate = new Date().toISOString().slice(2, 10).replace(/-/g, "-");
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center", // 세로로 중앙 정렬
      gap: "10px", // 배지와 날짜 사이의 간격
      marginRight: "20px", // 오른쪽 여백x
      color: "grey", // 글자 색상
      fontSize: "14px", // 글자 크기
    },
    date: {
      fontSize: "14px", // 날짜 텍스트 크기
      fontWeight: "normal", // 날짜 텍스트 굵기
    },
  };
  useEffect(() => {
    const fetchMatchingIndustries = async () => {
      try {
        const [topInvestmentResponse, favoriteIndustriesResponse] =
          await Promise.all([
            axios.get(
              "http://13.125.78.241:8081/domestic/analysis/top/종합위탁/top-investment"
            ),
            axios.get(
              "http://13.125.78.241:8081/domestic/analysis/1qct/favorite-industries"
            ),
          ]);

        const topIndustries = new Set(
          topInvestmentResponse.data.map((stock) => stock.industry.trim())
        );
        const favoriteIndustries = new Set(
          favoriteIndustriesResponse.data.map((stock) => stock.industry.trim())
        );

        const matchingIndustries = [...topIndustries].filter((industry) =>
          favoriteIndustries.has(industry)
        );
        setMatchingIndustries(matchingIndustries);

        if (matchingIndustries.length === 0) {
          setLoading(false);
          return;
        }

        const byCapitalizationResponse = await axios.get(
          "http://13.125.78.241:8081/hana/domesticstock/1qct/by-capitalization"
        );

        const filteredStocks = byCapitalizationResponse.data.filter((stock) =>
          matchingIndustries.includes(stock.industry.trim())
        );
        setFilteredStocks(filteredStocks);

        const priceDifferencePromises = filteredStocks.map((stock) =>
          axios
            .get(
              `http://13.125.78.241:8081/hanact/domesticstockprices/${stock.stockCode}/price-difference`
            )
            .catch((error) => {
              if (error.response && error.response.status === 404) {
                console.warn(
                  `Price difference data not found for stock ${stock.stockCode}`
                );
                return null; // 데이터를 무시하고 null로 설정
              }
              throw error; // 다른 에러는 그대로 throw
            })
        );

        const priceDifferencesResponses = await Promise.all(
          priceDifferencePromises
        );

        const priceDifferencesData = priceDifferencesResponses
          .filter((res) => res !== null) // null 데이터를 필터링
          .map((res) => res.data);
        setPriceDifferences(priceDifferencesData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingIndustries();
  }, []);

  const showModal = (index) => {
    if (priceDifferences.length > index && filteredStocks.length > index) {
      setSelectedStock({
        ...filteredStocks[index],
        ...priceDifferences[index],
      });
      setIsModalVisible(true);
    } else {
      console.error(
        "Price differences not available for this stock or stock data not fully loaded"
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedStock(null);
  };
  const colors = ["#ff99c8", "#fcf6bd", "#d0f4de", "#a9def9", "#e4c1f9"];
  const getStabilityBadge = () => {
    if (!selectedStock) return null;
    const { volumeDifference, closePriceDifference } = selectedStock;
    if (volumeDifference < 0 && closePriceDifference > 0) {
      return <CustomBadge color="orange" text="안정성 중간" />;
    } else if (volumeDifference > 0 && closePriceDifference > 0) {
      return <CustomBadge color="lightgreen" text="안정성 다소높음" />;
    } else if (volumeDifference > 0 && closePriceDifference < 0) {
      return <CustomBadge color="orange" text="안정성 중간" />;
    } else if (volumeDifference < 0 && closePriceDifference < 0) {
      return <CustomBadge color="yellow" text="안정성 다소낮음" />;
    }

    return null;
  };

  const chartOptions = {
    chart: {
      type: "packedbubble",
      height: "100%",
    },
    title: false,
    legend: {
      enabled: false,
    },
    tooltip: false,
    plotOptions: {
      packedbubble: {
        minSize: "30%",
        maxSize: "85%",
        zMin: 0,
        zMax: Math.max(...filteredStocks.map((stock) => stock.value)),
        layoutAlgorithm: {
          gravitationalConstant: 0.05,
          splitSeries: false,
        },
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          style: {
            color: "black",
            textOutline: "none",
            fontWeight: "600",
            fontSize: "20px",
          },
        },
        events: {
          click: function (event) {
            showModal(event.point.index);
          },
        },
      },
    },
    series: [
      {
        name: false,
        data: filteredStocks.map((stock, index) => ({
          name: stock.stockName,
          value: stock.issuedShares * Math.random() * 2, // 버블 크기를 랜덤하게 조정
          color: colors[index % colors.length], // 색상 다양화
          index,
        })),
      },
    ],
  };

  const chart2Options = selectedStock
    ? {
        chart: {
          zoomType: "xy",
          height: 450,
          width: 400,
        },
        title: false,
        xAxis: [
          {
            crosshair: true,
            labels: {
              enabled: false, // x축 레이블 비활성화
            },
          },
        ],
        yAxis: [
          {
            // Primary yAxis (왼쪽 y축)
            labels: {
              formatter: function () {
                return `${this.value.toLocaleString("ko-KR")}K 주`; // 콤마 구분 추가
              },
              style: {
                // color: "#D96C6C",
              },
            },
            title: {
              text: "거래량 차이",
              style: {
                // color: "#D96C6C",
              },
            },
            opposite: false, // 왼쪽에 표시
          },
          {
            // Secondary yAxis (오른쪽 y축)
            labels: {
              formatter: function () {
                return `${this.value.toLocaleString("ko-KR")}원`; // 콤마 구분 추가
              },
              style: {
                // color: "#6C7AD9",
              },
            },
            title: {
              text: "주가 차이",
              style: {
                // color: "#6C7AD9",
              },
            },
            opposite: true, // 오른쪽에 표시
          },
        ],
        tooltip: {
          shared: true,
          formatter: function () {
            let tooltipHtml = "";
            this.points.forEach(function (point) {
              if (point.series.name === "거래량 차이") {
                tooltipHtml += `<span style="color:${
                  point.color
                }; font-size:16px">\u25CF</span> <span style="font-size:16px">${
                  point.series.name
                }:</span> <b style="font-size:16px">${point.y.toLocaleString(
                  "ko-KR"
                )}K</b><br/>`;
              } else if (point.series.name === "주가 차이") {
                tooltipHtml += `<span style="color:${
                  point.color
                }; font-size:16px">\u25CF</span> <span style="font-size:16px">${
                  point.series.name
                }:</span> <b style="font-size:16px">${point.y.toLocaleString(
                  "ko-KR"
                )}원</b><br/>`;
              }
            });
            return tooltipHtml;
          },
        },
        series: [
          {
            name: "거래량 차이",
            type: "column",
            data: [selectedStock.volumeDifference],
            yAxis: 0, // 왼쪽 y축과 연결
            color: "#D96C6C",
          },
          {
            name: "주가 차이",
            type: "column",
            data: [selectedStock.closePriceDifference],
            yAxis: 1, // 오른쪽 y축과 연결
            color: "#6C7AD9",
          },
        ],
      }
    : null;

  if (loading) {
    return (
      <div className="mts-loading">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    );
  }

  return (
    <div className="mainBubble">
      <div className="fence"></div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <ReactModal
        isOpen={isModalVisible}
        onRequestClose={handleCancel}
        contentLabel="Stock Price Differences"
        style={{
          content: {
            width: "480px",
            height: "600px",
            margin: "auto",
            borderRadius: "15px",
            padding: "20px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // 오버레이 색상 변경
          },
        }}>
        {selectedStock && (
          <div style={{ marginLeft: "20px" }}>
            <div style={styles.container}>
              <div>{getStabilityBadge()}</div>
              <div style={styles.date}>{currentDate} ~ 22-12-31</div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
                marginRight: "20px",
                marginLeft: "10px",
                marginBottom: "10px",
                position: "relative",
              }}>
              <span style={{ fontSize: "20px" }}>
                {selectedStock.stockName}
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}>
                <span style={{ color: "grey" }}>산업</span>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "grey" }}>
                  arrow_right
                </span>
                <span style={{ fontSize: "20px" }}>
                  {selectedStock.industry}
                </span>
              </div>
            </div>
            {chart2Options && (
              <HighchartsReact
                highcharts={Highcharts}
                options={chart2Options}
              />
            )}
          </div>
        )}
        <div
          style={{
            backgroundColor: "white",
            position: "absolute",
            left: "360px",
            width: "100px",
            height: "30px",
            bottom: "15px",
            zIndex: "100",
          }}></div>
      </ReactModal>
    </div>
  );
};
const CustomBadge = ({ color, text }) => {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.badge, backgroundColor: color }}></div>
      <span style={styles.text}>{text}</span>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
  },
  badge: {
    width: "15px", // 원의 너비
    height: "15px", // 원의 높이
    borderRadius: "50%", // 원형 모양
    display: "inline-block",
    marginRight: "8px", // 텍스트와의 간격
  },
  text: {
    fontSize: "24px", // 텍스트 크기
    fontWeight: "600", // 텍스트 굵기
    fontFamily: "Arial", // 텍스트 글꼴
  },
};

export default StockAnalysisComponent;
