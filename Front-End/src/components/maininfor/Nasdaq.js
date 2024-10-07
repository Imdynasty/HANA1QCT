import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

// 필요한 Chart.js 모듈 등록
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Nasdaq = () => {
  const chartRef = useRef(null); // 차트 인스턴스를 저장할 ref 생성
  const containerStyle = {
    cursor: "pointer",
    width: "100%",
    height: "100%",
  };

  useEffect(() => {
    const fetchNasdaqData = async () => {
      try {
        const response = await axios.get("/nasdaqData.json"); // NASDAQ 데이터 불러오기
        const data = response.data.nasdaq.reverse(); // 데이터 구조에 맞게 수정
        drawChart(data);
      } catch (error) {
        console.error("Error fetching NASDAQ data:", error);
      }
    };

    fetchNasdaqData();

    // 컴포넌트 언마운트 시 차트 인스턴스 파괴
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const drawChart = (data) => {
    const ctx = document.getElementById("nasdaqChart").getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.date), // 날짜를 라벨로 사용
        datasets: [
          {
            label: "NASDAQ",
            data: data.map((item) =>
              parseFloat(item.closing_price.replace(/,/g, ""))
            ), // 콤마 제거 후 숫자로 변환
            borderColor: "white",
            tension: 0.1,
            pointStyle: "line",
            fill: false,
            pointBackgroundColor: "white",
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            display: false,
            title: {
              display: false,
              text: "Date",
            },
          },
          y: {
            display: false,
            title: {
              display: false,
              text: "Closing Price (USD)",
            },
            ticks: {
              callback: function (value) {
                return "$" + value;
              },
            },
          },
        },
        animation: {
          duration: 2000,
        },
      },
    });
  };

  return (
    <div>
      <canvas id="nasdaqChart" style={containerStyle}></canvas>
    </div>
  );
};
const america = `${process.env.PUBLIC_URL}/img/america.png`;
const Nasdaqinfo = ({ animation }) => {
  const [variation, setVariation] = useState(""); // variation 값 저장을 위한 state
  const [closing_price, setClosing_price] = useState(""); // closing_price 값 저장을 위한 state
  const [variationColor, setVariationColor] = useState("black");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/nasdaqData.json");
        const firstData = response.data.nasdaq[0];
        setVariation(firstData.variation); // 첫번째 데이터의 variation 값을 설정
        setClosing_price(firstData.closing_price); // 첫번째 데이터의 closing_price
        if (firstData.variation.startsWith("-")) {
          setVariationColor("blue"); // variation 값이 '-'로 시작하면 파란색
        } else {
          setVariationColor("red"); // 그 외는 빨간색
        }
      } catch (error) {
        console.error("Error fetching variation data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div
      style={{
        paddingTop: "15px",
        fontSize: "20px",
        display: "flex",
        alignItems: "center",
      }}
      className={animation}>
      <img
        src={america}
        alt="America"
        style={{
          width: "35px",
          height: "20px",
          paddingRight: "10px",
          paddingTop: "2px",
        }}
      />
      {/* 이미지 */}
      <span>나스닥</span>{" "}
      <span className="material-symbols-outlined" style={{ paddingTop: "4px" }}>
        chevron_right
      </span>
      <span
        style={{
          color: variationColor,
          paddingRight: "20px",
          paddingTop: "3px",
        }}>
        {closing_price}
      </span>
      <span style={{ color: variationColor, paddingTop: "2px" }}>
        ( {variation})
      </span>
    </div>
  );
};

export { Nasdaq, Nasdaqinfo };
