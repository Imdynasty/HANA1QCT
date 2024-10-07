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

const Kospi = () => {
  const chartRef = useRef(null); // 차트 인스턴스를 저장할 ref 생성
  const containerStyle = {
    cursor: "pointer",
    width: "100%",
    height: "100%",
  };

  useEffect(() => {
    const fetchKOSPIData = async () => {
      try {
        const response = await axios.get("/kospiData2.json");
        const data = response.data.kospi.reverse();
        drawChart(data);
      } catch (error) {
        console.error("Error fetching KOSPI data:", error);
      }
    };

    fetchKOSPIData();

    // 컴포넌트 언마운트 시 차트 인스턴스 파괴
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const drawChart = (data) => {
    const ctx = document.getElementById("kospiChart").getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.date),
        datasets: [
          {
            label: "KOSPI",
            data: data.map((item) =>
              parseFloat(item.closing_price.replace(/,/g, ""))
            ), // 콤마 제거 후 숫자로 변환
            borderColor: "white",
            tension: 0.1,
            fill: false,
            pointStyle: "line",
            pointBackgroundColor: "white",
            borderColor: "white",
            tension: 0,
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
              text: "Closing Price (KRW)",
            },
            ticks: {
              callback: function (value) {
                return value + " KRW";
              },
            },
            min: 2000, // 최소값 설정
            max: 3000, // 최대값 설정
          },
        },
        animation: {
          duration: 3000,
        },
      },
    });
  };

  return (
    <div>
      <canvas id="kospiChart" style={containerStyle}></canvas>
    </div>
  );
};

const korea = `${process.env.PUBLIC_URL}/img/taeguekki.png`;
const Kospiinfo = ({ animation }) => {
  const [variation, setVariation] = useState(""); // variation 값 저장을 위한 state
  const [closing_price, setClosing_price] = useState(""); // closing_price 값 저장을 위한 state
  const [variationColor, setVariationColor] = useState("black");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/kospiData2.json");
        const firstData = response.data.kospi[0];
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
        src={korea}
        alt="Korea"
        style={{
          width: "40px",
          height: "20px",
          paddingRight: "10px",
          paddingTop: "2px",
        }}
      />
      {/* 이미지 */}
      <span>코스피</span>{" "}
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

export { Kospi, Kospiinfo };
