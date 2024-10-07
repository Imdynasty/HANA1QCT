import React, { useState, useEffect, useMemo } from "react";
import { Button, Skeleton } from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const StockChart = ({ stockCode, stockName }) => {
  const [chartData, setChartData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("month");
  const [loading, setLoading] = useState(true);
  const [latestClose, setLatestClose] = useState(null);
  const [previousClose, setPreviousClose] = useState(null);
  const [changePercentage, setChangePercentage] = useState(null);
  const [changeAmount, setChangeAmount] = useState(null);

  useEffect(() => {
    if (stockCode) {
      setLoading(true);
      fetchStockData(stockCode);
    }
  }, [stockCode]);

  const fetchStockData = async (stockCode) => {
    try {
      setLoading(true); // 로딩 상태를 시작

      // stockCode가 숫자인지 확인
      const isNumeric = /^\d+$/.test(stockCode);

      // 요청할 URL 결정
      const url = isNumeric
        ? `http://13.125.78.241:8081/hanact/domesticstockprices?stockcode=${stockCode}`
        : `http://13.125.78.241:8081/hanact/overseasstockprices?stockcode=${stockCode}`;

      const response = await axios.get(url);
      processStockData(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processStockData = (data) => {
    const sortedData = data.sort(
      (a, b) => new Date(b.tradingDate) - new Date(a.tradingDate)
    );

    if (sortedData.length > 0) {
      const latestData = sortedData[0];
      const previousData = sortedData.length > 1 ? sortedData[1] : null;

      setLatestClose(latestData.closePrice);
      setChangePercentage(latestData.changePercentage);
      if (previousData) {
        setPreviousClose(previousData.closePrice);
        setChangeAmount(latestData.closePrice - previousData.closePrice);
      }
    }

    const formattedData = sortedData.map((item) => ({
      tradingDate: item.tradingDate,
      closePrice: item.closePrice,
    }));

    setChartData(formattedData);
  };

  const filteredChartData = useMemo(() => {
    let filteredData;

    switch (timeFrame) {
      case "day":
        filteredData = chartData;
        break;
      case "week":
        filteredData = chartData.filter((item, index) => {
          const itemDate = new Date(item.tradingDate);
          return index === 0 || itemDate.getDate() % 7 === 1;
        });
        break;
      case "month":
        filteredData = chartData.filter((item, index, array) => {
          const itemDate = new Date(item.tradingDate);
          return (
            index === 0 ||
            itemDate.getMonth() !==
              new Date(array[index - 1].tradingDate).getMonth()
          );
        });
        break;
      default:
        filteredData = chartData;
    }

    return filteredData
      .map((item) => ({
        name: new Date(item.tradingDate).toLocaleDateString("ko-KR", {
          month: "short",
          day: "numeric",
        }),
        value: item.closePrice,
      }))
      .reverse();
  }, [chartData, timeFrame]);

  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame);
  };

  if (loading) {
    return (
      <div style={{ width: "100%", marginLeft: "20px" }}>
        <div className="stockinfoprice" style={{ marginBottom: "20px" }}>
          <Skeleton active paragraph={{ rows: 0 }} size="small" />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 345,
          }}>
          <CircularProgress
            size={60}
            color="inherit"
            style={{ opacity: 0.5 }}
          />
        </div>
      </div>
    );
  }
  const isNumeric = /^\d+$/.test(stockCode);
  return (
    <div style={{ width: "100%", marginLeft: "20px" }}>
      <div className="stockinfoprice" style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "flex",
            marginLeft: "10px",
            fontSize: "25px",
            fontWeight: "600",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <span>{stockName ? stockName : "Stock Name"}</span>
          <div
            className="danwi"
            style={{ marginRight: "50px", fontSize: "20px" }}>
            <span>단위 : </span>
            <span
              style={{
                color: isNumeric ? "rgb(17 86 160)" : "#008485", // isNumeric이 true일 때는 blue, false일 때는 #008485
                fontWeight: "550",
              }}>
              {isNumeric ? "KRW" : "USD"}{" "}
              {/* isNumeric이 true이면 "원", false이면 "USD" */}
            </span>
          </div>
        </div>
        <div
          style={{
            color: changePercentage < 0 ? "rgb(71 128 239)" : "rgb(255 33 35)",
            marginLeft: "6px",
          }}>
          <span
            style={{
              fontSize: "50px",
              fontWeight: "500",
            }}>
            {latestClose ? latestClose.toLocaleString("ko-KR") : "-"}
          </span>{" "}
        </div>
        <div style={{ fontSize: "20px", fontWeight: "500" }}>
          <span
            style={{
              color:
                changePercentage < 0 ? "rgb(71 128 239)" : "rgb(255 33 35)",
              marginLeft: "10px",
            }}>
            {changeAmount !== null
              ? `${changeAmount.toLocaleString("ko-KR")}`
              : "-"}
          </span>
          <span
            style={{
              color:
                changePercentage < 0 ? "rgb(71 128 239)" : "rgb(255 33 35)",
              marginLeft: "10px",
            }}>
            {changePercentage ? changePercentage.toFixed(2) : "-"}%{" "}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "20px",
          marginTop: "10px",
        }}>
        <Button
          className={`daymonyear ${timeFrame === "day" ? "actives" : ""}`}
          onClick={() => handleTimeFrameChange("day")}
          style={{
            backgroundColor:
              timeFrame === "day" ? "rgb(235 250 252)" : undefined,
            color: timeFrame === "day" ? "black" : undefined,
          }}>
          일
        </Button>
        <Button
          className={`daymonyear ${timeFrame === "week" ? "actives" : ""}`}
          onClick={() => handleTimeFrameChange("week")}
          style={{
            backgroundColor:
              timeFrame === "week" ? "rgb(235 250 252)" : undefined,
            color: timeFrame === "week" ? "black" : undefined,
          }}>
          주
        </Button>
        <Button
          className={`daymonyear ${timeFrame === "month" ? "actives" : ""}`}
          onClick={() => handleTimeFrameChange("month")}
          style={{
            backgroundColor:
              timeFrame === "month" ? "rgb(235 250 252)" : undefined,
            color: timeFrame === "month" ? "black" : undefined,
          }}>
          월
        </Button>
      </div>
      <ResponsiveContainer width="95%" height={200}>
        <AreaChart
          data={filteredChartData}
          margin={{
            top: 0,
            right: 30,
            left: 30,
            bottom: 0,
          }}
          animationId={timeFrame} // timeFrame이 바뀔 때마다 애니메이션 재실행
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="rgb(255 182 181)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="rgb(255 182 181)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 0" vertical={false} />
          <XAxis
            dataKey="name"
            interval="preserveStartEnd"
            tickFormatter={(value) => value}
          />
          <YAxis
            tickCount={5}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value.toLocaleString("ko-KR")}`}
          />
          <Tooltip formatter={(value) => `${value.toLocaleString("ko-KR")}`} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="red"
            fill="url(#colorUv)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
