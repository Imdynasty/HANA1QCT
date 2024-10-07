import React, { useState, useEffect, useMemo } from "react";
import { Kospi, Kospiinfo } from "../components/maininfor/Kospi";
import { Nasdaq, Nasdaqinfo } from "../components/maininfor/Nasdaq.js";
import Newscard from "../components/maininfor/Newscard";
import RankList from "../components/maininfor/RankList";
import Exchange from "../components/maininfor/Exchange";
import "../css/MainInfo.css";
import InterestStock from "../components/maininfor/InterestStock";
import MainBanner from "../components/maininfor/Event.js";

const MainInfo = () => {
  const kospiBackground = `${process.env.PUBLIC_URL}/img/kospibackground.jpg`;
  const [showKospi, setShowKospi] = useState(true);
  const [animationClass, setAnimationClass] = useState("slide-up-animation");
  const currentDate = new Date()
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/(\d{4})\. (\d{2})\. (\d{2})\./, "$1-$2-$3"); // 형식을 YYYY-MM-DD로 변경
  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowKospi((prev) => !prev); // 8초마다 showKospi 상태를 토글
    }, 8000);

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 클리어
  }, []);

  const InterestStockSection = useMemo(() => <InterestStock />, []);
  return (
    <div>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "flex-start",
          marginLeft: "30px",
          width: "55%",
        }}>
        <h3
          style={{
            fontWeight: "bold",
            marginTop: "5px",
            color: "rgb(98 98 98)",
            fontFamily: "Noto Sans KR",
          }}>
          오늘의 시세
        </h3>
        {showKospi ? (
          <Kospiinfo key="kospi" animation={animationClass} />
        ) : (
          <Nasdaqinfo key="nasdaq" animation={animationClass} />
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: "20px",
        }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              backgroundImage: `url(${kospiBackground})`, // Correct usage
              backgroundSize: "contain", // Ensures the image covers the full div

              // backgroundRepeat: "no-repeat",
              opacity: "0.8",
              width: "1200px",
              height: "200px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
            }}>
            {showKospi ? (
              <Kospi className="slide-up-animation" />
            ) : (
              <Nasdaq className="slide-up-animation" />
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              className="maininfo"
              style={{
                background: "white",
                width: "50%",
                borderRadius: "25px",
                height: "500px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                marginLeft: "20px",
                marginTop: "20px",
              }}>
              <div
                style={{
                  display: "flex",
                  padding: "10px",
                  marginTop: "20px",
                  paddingLeft: "25px",
                  fontSmooth: "auto",
                }}>
                <h3 style={{ fontSize: "20px" }}>시가총액 순위 </h3>{" "}
                <span
                  style={{ paddingTop: "2px" }}
                  className="material-symbols-outlined spanarrow">
                  chevron_right
                </span>
              </div>
              <RankList />
            </div>
            <div
              className="maininfo"
              style={{
                background: "white",
                width: "50%",
                borderRadius: "25px",
                height: "500px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                marginLeft: "20px",
                marginTop: "20px",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  marginTop: "20px",
                  paddingLeft: "25px",
                }}>
                <div
                  style={{
                    display: "flex",
                  }}>
                  <h3 style={{ fontSize: "20px" }}>일별 환율 </h3>{" "}
                  <span
                    style={{ paddingTop: "2px" }}
                    className="material-symbols-outlined spanarrow">
                    chevron_right
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "18px",
                    paddingRight: "10px",
                    color: "grey",
                  }}>
                  {currentDate}
                </span>{" "}
                {/* 현재 날짜 출력 */}
              </div>
              <Exchange />
            </div>
          </div>
          <div
            className="maininfo"
            style={{
              background: "white",
              width: "98%",
              borderRadius: "25px",
              height: "580px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
              marginTop: "20px",
            }}>
            <div
              style={{
                display: "flex",
                padding: "10px",
                marginTop: "20px",
                marginLeft: "20px",
              }}>
              <h3 style={{ fontSize: "21px" }}>하나 뉴스 </h3>{" "}
              <span
                style={{ paddingTop: "2px" }}
                className="material-symbols-outlined spanarrow">
                chevron_right
              </span>
            </div>
            <Newscard />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}>
          <div
            className="maininfo"
            style={{
              background: "white",
              width: "96%",
              height: "880px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
              marginRight: "40px",
              marginBottom: "20px",
            }}>
            <div
              style={{
                display: "flex",
                padding: "10px",
                marginTop: "20px",
                marginLeft: "20px",
              }}>
              <h3 style={{ fontSize: "21px" }}>관심종목</h3>{" "}
              <span
                style={{ paddingTop: "2px" }}
                className="material-symbols-outlined spanarrow">
                chevron_right
              </span>
            </div>
            {InterestStockSection}
          </div>
          <div
            className="maininfo"
            style={{
              background: "white",
              width: "897px",
              height: "415px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
            }}>
            <div
              style={{
                display: "flex",
                padding: "10px",
                marginTop: "20px",
                marginLeft: "20px",
              }}>
              <h3 style={{ fontSize: "21px" }}>이벤트</h3>{" "}
              <span
                style={{ paddingTop: "2px" }}
                className="material-symbols-outlined spanarrow">
                chevron_right
              </span>
            </div>
            <MainBanner />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainInfo;
