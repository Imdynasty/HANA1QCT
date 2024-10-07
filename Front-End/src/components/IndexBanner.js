import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "antd";
import "../css/IndexBanner.css";

const hanactcharacter = `${process.env.PUBLIC_URL}/img/hanactcharacter.png`;

const StockBanner = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.PUBLIC_URL}/bannerIndex2.json`
        );
        setData(Object.values(response.data));
      } catch (error) {
        console.error("Error fetching the stock data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="carousel-container">
      {/* 캐릭터 영역 */}
      <div className="character">
        <img src={hanactcharacter} alt="Character" />
        <div className="character-info">
          <div className="character-name">안전한 투자를 위한</div>
          <div className="character-level">현금투자서비스</div>
        </div>
        <span className="orange-dot"></span>
      </div>

      {/* 카루셀 영역 */}
      <Carousel autoplay fade>
        {data.map((stock, index) => {
          const isPositive = stock["변동"].startsWith("+");
          const changeValue = stock["변동"].replace(/[+-]/g, "");
          const changePercentage = stock["변동%"].replace(/[+-]/g, "");

          return (
            <div key={index}>
              <div className="stock-banner">
                <div className="stock-info">
                  <div className="stock-name">
                    <span style={{ fontWeight: "600" }}>{stock["종목명"]}</span>
                    <div>
                      <span className="material-symbols-outlined playarrowset">
                        play_arrow
                      </span>
                      <span
                        style={{ paddingLeft: "10px" }}
                        className="material-symbols-outlined playarrowset">
                        settings
                      </span>
                    </div>
                  </div>
                  <div
                    className="stock-price"
                    style={{ color: isPositive ? "red" : "blue" }}>
                    {stock["종가"]}
                  </div>
                  <div
                    className="stock-change"
                    style={{ color: isPositive ? "red" : "blue" }}>
                    {isPositive ? (
                      <span className="material-symbols-outlined">
                        arrow_drop_up
                      </span>
                    ) : (
                      <span className="material-symbols-outlined">
                        arrow_drop_down
                      </span>
                    )}
                    {changeValue} ({changePercentage})
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default StockBanner;
