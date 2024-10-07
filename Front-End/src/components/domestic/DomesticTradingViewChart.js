import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Avatar } from "antd";

const StockChart = ({ stockcode, stockName }) => {
  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const stockNameToImageName = {
    삼성전자: "samsung",
    SK하이닉스: "sk",
    LG에너지솔루션: "lg",
    현대차: "hyundai",
    기아: "kia",
    셀트리온: "celltrion",
    KB금융: "kb",
    신한지주: "shinhan",
    POSCO홀딩스: "posco",
    NAVER: "naver",
    현대모비스: "mobis",
    하나금융지주: "logo",
    LG전자: "lg",
    메리츠금융지주: "meritz",
    카카오: "kakao",
  };
  const imageName = stockNameToImageName[stockName] + ".png";
  const imageUrl = `${process.env.PUBLIC_URL}/img/KoreaLogo/${imageName}`;
  useEffect(() => {
    setLoading(true);
    // Simulate a delay for loading
    setTimeout(() => {
      axios
        .get(
          `http://13.125.78.241:8081/hanact/domesticstockprices?stockcode=${stockcode}`
        )
        .then((response) => {
          // 데이터를 tradingDate 기준으로 오름차순 정렬
          const sortedData = response.data.sort((a, b) => {
            return new Date(a.tradingDate) - new Date(b.tradingDate);
          });

          setData(sortedData);
          // console.log(sortedData);

          // Assume the last data point is the current price
          setCurrentPrice(sortedData[sortedData.length - 1].closePrice);
          setLoading(false); // Stop loading after data is fetched
        })
        .catch((error) => {
          console.error("There was an error fetching the stock data!", error);
          setLoading(false); // Stop loading even if there is an error
        });
    }, 500); // 500ms delay to simulate loading
  }, [stockcode]);

  const formattedData = data.map((item, index) => {
    // 만약 거래량이 한자리수라면 1000을 곱해줌
    const volume = parseFloat(item.volume);

    // 만약 거래량이 한 자리수라면 1000을 곱해줌
    // const adjustedVolume = volume < 60 ? volume * 1000 : volume;
    const adjustedVolume = volume;
    // console.log(item.volume, adjustedVolume);
    return {
      date: new Date(item.tradingDate).toLocaleDateString("ko-KR", {
        month: "short",
        year: "numeric",
        day: "numeric",
      }),
      month: new Date(item.tradingDate).toLocaleDateString("ko-KR", {
        month: "short",
        year:
          index > 0 &&
          new Date(item.tradingDate).getFullYear() !==
            new Date(data[index - 1].tradingDate).getFullYear()
            ? "numeric"
            : undefined,
      }),
      all: new Date(item.tradingDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      closePrice: item.closePrice,
      volume: adjustedVolume / 50, // Adjusted for better readability
      originalVolume: adjustedVolume, // Store original volume for tooltip
      previousVolume: index > 0 ? data[index - 1].volume / 50 : null, // Store previous volume for color comparison
    };
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
        }}>
        <CircularProgress size={60} thickness={1.5} />
      </div>
    );
  }

  // To prevent repeating months on X-axis
  let lastDisplayedMonth = "";

  return (
    <div>
      <div
        className="dataField"
        style={{
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #e0e0e0",
          paddingLeft: "15px",
          paddingRight: "20px",
          justifyContent: "space-between",
          fontFamily: "Arial, sans-serif",
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}>
          <Avatar
            size="middle"
            src={imageUrl}
            style={{
              marginRight: "10px",
            }}
          />

          <div style={{ fontWeight: "600", fontSize: "20px" }}>{stockName}</div>
        </div>
        <div
          style={{
            marginLeft: "10px",
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
          }}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                fontWeight: "600",
                border: "1px solid #e0e0e0",
                borderRadius: "20px",
                backgroundColor: "#f6f6f6",
                marginRight: "20px",
                width: "50px",
                textAlign: "center",
                height: "23px",
              }}>
              최신
            </div>
            <p
              style={{
                color: "black", // 한글 부분은 검은색으로 설정
              }}>
              종가{" "}
              <span
                style={{
                  color:
                    data[data.length - 1]?.changePercentage > 0
                      ? "red"
                      : "blue",
                }}>
                {currentPrice.toLocaleString("ko-KR")}원 (
                {data[data.length - 1]?.changePercentage !== undefined
                  ? data[data.length - 1].changePercentage
                  : "N/A"}
                %)
              </span>
            </p>
          </div>

          {/* 구분선 */}
          <div
            style={{
              borderLeft: "1px solid #e0e0e0",
              height: "20px",
              marginLeft: "20px",
              marginBottom: "15px",
            }}></div>

          {/* 거래량 표시 */}
          <p
            style={{
              paddingLeft: "20px",
              color: "black", // 한글 부분은 검은색으로 설정
              marginTop: "3px",
            }}>
            거래량{" "}
            <span
              style={{
                color:
                  data.length > 1 &&
                  formattedData[formattedData.length - 1].originalVolume >
                    formattedData[formattedData.length - 2].originalVolume
                    ? "red"
                    : "green",
              }}>
              {data.length > 0
                ? formattedData[
                    formattedData.length - 1
                  ].originalVolume.toLocaleString("ko-KR")
                : "-"}
              K
            </span>
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={480}>
        <ComposedChart
          data={formattedData}
          width={formattedData.length * 10} // Set width based on the data length
          margin={{
            top: 20,
            right: 23,
          }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2862ff" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#2862ff" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* XAxis with year display when year changes */}
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            axisLine={false} // Remove X-axis line
            tickLine={false} // Remove X-axis ticks
            tickFormatter={(month) => {
              if (month === lastDisplayedMonth) {
                return "";
              }
              lastDisplayedMonth = month;
              return month;
            }}
          />

          {/* YAxis for Price with no line and ticks */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={["dataMin - 100", "dataMax + 100"]}
            tickFormatter={(value) => `${value.toLocaleString("ko-KR")}`}
            axisLine={false} // Remove Y-axis line
            tickLine={false} // Remove Y-axis ticks
          />

          {/* YAxis for Volume, with custom range and no ticks */}
          <YAxis
            yAxisId="volume"
            orientation="right"
            domain={[0, "dataMax + 100"]}
            tickFormatter={(value) => `${value}K`}
            hide={true} // Hide axis labels for volume to avoid clutter
          />

          {/* Remove all grid lines */}
          <CartesianGrid stroke="none" />

          <Tooltip
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return payload[0].payload.all; // Display full date
              }
              return label; // Return the original label if payload is not available
            }}
            formatter={(value, name, props) => {
              if (name === "closePrice") {
                return [`${value.toLocaleString("ko-KR")}원`, "종가"];
              } else if (name === "volume") {
                // Display original volume
                return [
                  `${props.payload.originalVolume.toLocaleString("ko-KR")}K`,
                  "거래량",
                ];
              }
            }}
          />

          {/* Highlight current price */}
          <ReferenceLine
            y={currentPrice}
            yAxisId="right"
            stroke="#8884d8"
            label={{
              position: "right",
              value: `${currentPrice.toLocaleString("ko-KR")}`,
              fill: "#8884d8",
              fontWeight: "bold",
            }}
            strokeDasharray="3 3"
          />

          {/* Bar element for Volume inside ComposedChart */}
          <Bar
            yAxisId="volume"
            dataKey="volume"
            barSize={100}
            animationBegin={0}
            animationDuration={2000}
            animationEasing="ease-out">
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.previousVolume !== null &&
                  entry.volume > entry.previousVolume
                    ? "#f6aaa7" // Red for increased volume
                    : "#90d1ce" // Green for decreased volume or same
                }
              />
            ))}
          </Bar>

          {/* Area element for Price inside ComposedChart */}
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="closePrice"
            stroke="#2862ff" // Line color
            fill="url(#colorUv)" // Use gradient fill defined in defs
            strokeWidth={2}
            dot={false}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
            isAnimationActive={true} // Ensure animation is active
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
