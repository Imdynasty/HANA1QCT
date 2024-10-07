import React, { useState, useEffect } from "react";
import { PieChart, Pie, Sector, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 숫자를 퍼센트 스타일로 포맷하는 함수
const formatPercentage = (value) => `${(value * 100).toFixed(2)}%`;
const tradingimage = `${process.env.PUBLIC_URL}/img/stockplusminus/trading.png`;
// 사용자 정의 활성 모양 컴포넌트
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text
        x={cx}
        y={cy} // 텍스트를 차트 아래로 위치
        textAnchor="middle"
        fill="#333"
        fontSize={20}>
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 30} // 퍼센트 텍스트를 그 아래에 위치
        textAnchor="middle"
        fill="#999"
        fontSize={20}>
        {`(${formatPercentage(percent)})`}
      </text>
    </g>
  );
};

const AssetDistributionChart = ({ accountId, onCashTotalChange }) => {
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleSummaryImageClick = async () => {
    try {
      const response = await fetch(
        "http://54.180.14.45:5000/update_domestic_balance_summary",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("국내자산 업데이트 완료.");
      } else {
        toast.error("Failed to update domestic balance.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error occurred while updating domestic balance.");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const domesticRes = await axios.get(
          `http://13.125.78.241:8081/balances/domestic/summary/${accountId}`
        );
        const foreignRes = await axios.get(
          `http://13.125.78.241:8081/balances/overseas/summary/${accountId}`
        );
        const cashRes = await axios.get(
          `http://13.125.78.241:8081/accounts/CMA`
        );
        const domesticTotal = Number(domesticRes.data.totEvluAmt || 0);
        const foreignTotal = Number(foreignRes.data.totAsstAmt || 0);
        const cashTotal = Number(cashRes.data.cash || 0); // cashTotal 값 설정

        // 모든 자산의 총합 계산
        const total = domesticTotal + foreignTotal + cashTotal;
        onCashTotalChange(cashTotal); // 부모
        // 각 자산의 백분율 계산
        setChartData([
          {
            name: "국내주식",
            value: domesticTotal,
            fill: "#f770a3",
          },
          {
            name: "해외주식",
            value: foreignTotal,
            fill: "#882afb",
          },
          {
            name: "예수금",
            value: cashTotal,
            fill: "#01d8f9",
          },
        ]);
      } catch (error) {
        console.error("Error fetching asset distribution data:", error);
      }
    };

    fetchData();
  }, [accountId]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div
      style={{ width: "39%", height: "90%", marginBottom: "30px" }}
      className="asset-summary-container">
      <ToastContainer />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            fontWeight: "400",
            marginRight: "8px",
            fontFamily: "Noto Sans KR",
            textAlign: "left",
            fontSize: "2rem",
            marginTop: "20px",
            marginLeft: "10px",
          }}>
          보유자산비율
          {/* <div
            style={{
              textAlign: "left",

              color: "grey",
              fontSize: "15px",
            }}>
            자산계좌 50112746-01
          </div> */}
        </div>
        <img
          src={tradingimage}
          style={{
            width: "50px",
            height: "50px",
            marginTop: "20px",
            cursor: "pointer",
            zIndex: 1,
          }}
          onClick={handleSummaryImageClick}
        />
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "40px",
          overflow: "hidden",
        }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="40%" // 차트를 살짝 위로 이동시켜 텍스트를 아래에 배치
              innerRadius={80}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
            <Tooltip
              formatter={(value, name) =>
                `${formatPercentage(
                  value / chartData.reduce((acc, cur) => acc + cur.value, 0)
                )}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetDistributionChart;
