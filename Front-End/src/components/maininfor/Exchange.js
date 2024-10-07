import React, { useEffect, useState } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import "../../css/Exchange.css";

const Exchange = () => {
  const [data, setData] = useState([]);
  const [latestRate, setLatestRate] = useState({
    buying_rate: 0,
    selling_rate: 0,
  });
  const [previousRate, setPreviousRate] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://13.125.78.241:8081/securities/exchangerates"
        );
        const rates = response.data;
        const latest = rates[rates.length - 1]; // 최신 데이터 가져오기
        const previous = rates.length > 1 ? rates[rates.length - 2] : null; // 전날 데이터 가져오기
        setLatestRate({
          buyRate: latest.buyRate,
          sellRate: latest.sellRate,
          tradingStandardRate: latest.tradingStandardRate,
        });
        if (previous) {
          setPreviousRate(previous.tradingStandardRate);
        }
        setData(rates); // 전체 데이터를 상태로 설정
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exchange rate data:", error);
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500); // 500ms 타임아웃 설정

    return () => clearTimeout(timeoutId); // 컴포넌트가 언마운트될 때 타임아웃을 정리합니다.
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: "550px",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "150px",
        }}>
        <CircularProgress
          disableShrink
          size={70}
          color="inherit"
          thickness={2}
        />
      </div>
    );
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const tradingStandardRateColor =
    latestRate.tradingStandardRate > previousRate
      ? "rgb(255 33 35)" // 상승시 파란색
      : "rgb(71 128 239)"; // 하락시 빨간색

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* 최신 환율 데이터 표시 */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "5px",
          display: "flex",
          alignItems: "center",
          fontSize: "20px",
          justifyContent: "space-between",
          marginLeft: "25px",
          marginTop: "20px",
        }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>매매 기준율 </span>
          <span className="material-symbols-outlined">arrow_right</span>
          <span style={{ color: tradingStandardRateColor }}>
            {latestRate.tradingStandardRate}
          </span>
        </div>
        <div style={{ marginRight: "20px" }}>
          <span>통화 : </span>
          <span style={{ color: "#008485", fontWeight: "550" }}>USD</span>
        </div>
      </div>
      <div style={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={data}
            margin={{ top: 18, right: 10, left: -70, bottom: 10 }}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-in-out">
            <defs>
              <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#daa1f0" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#daa1f0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f18b8b" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#f18b8b" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="colorTradingStandard"
                x1="0"
                y1="0"
                x2="0"
                y2="1">
                <stop offset="5%" stopColor="#fdf7c6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fdf7c6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="rateDate"
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              width={80}
              domain={["auto", "auto"]}
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f5f5f5",
                color: "rgb(0, 132, 133)",
              }}
              itemStyle={{ color: "black", fontSize: "17px" }}
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              }
              formatter={(value, name) => {
                switch (name) {
                  case "buyRate":
                    return [`${value} (환율 살때)`, "매수 환율"];
                  case "sellRate":
                    return [`${value} (환율 팔때)`, "매도 환율"];
                  case "tradingStandardRate":
                    return [`${value} (기준 환율)`, "매매 기준율"];
                  default:
                    return [value, name];
                }
              }}
            />
            <Area
              type="monotone"
              dataKey="buyRate"
              stroke="purple"
              fillOpacity={1}
              fill="url(#colorBuy)"
            />
            <Area
              type="monotone"
              dataKey="sellRate"
              stroke="red"
              fillOpacity={1}
              fill="url(#colorSell)"
            />
            <Area
              type="monotone"
              dataKey="tradingStandardRate"
              stroke="yellow"
              fillOpacity={1}
              fill="url(#colorTradingStandard)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Exchange;
