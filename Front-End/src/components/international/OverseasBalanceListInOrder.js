import React, { useEffect, useState } from "react";
import { Avatar, Badge, Skeleton } from "antd";
import axios from "axios";
import "../../css/OverseasBalanceListInOrder.css"; // CSS 파일을 분리하여 관리

const OverseasBalanceList = ({ accountId }) => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const won = `${process.env.PUBLIC_URL}/img/moneyicon/us.png`;
  const stockqty = `${process.env.PUBLIC_URL}/img/stockplusminus/stockqty.png`;

  // 서버에서 데이터 불러오기
  const fetchBalances = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://13.125.78.241:8081/balances/overseas`
      );
      setBalances(response.data); // 데이터를 상태에 저장
    } catch (error) {
      console.error("Error fetching overseas balances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [accountId]);

  useEffect(() => {
    const slider = document.querySelector(".horizontal-scroll-container3");
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // 스크롤 속도 조정
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const getProfitLossImage = (value) => {
    return value < 0
      ? `${process.env.PUBLIC_URL}/img/stockplusminus/stockminus.png`
      : `${process.env.PUBLIC_URL}/img/stockplusminus/stockplus.png`;
  };

  return (
    <div className="horizontal-scroll-container3">
      {balances.map((item) => {
        return (
          <div
            className="horizontal-list-item3 hover-effect"
            key={item.ovrsPdno}>
            <Skeleton
              paragraph={{ rows: 1 }}
              avatar
              title={true}
              loading={loading}
              active>
              <div className="horizontal-list-item-content">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    overflow: "hidden",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px",
                    }}>
                    <h2
                      className="hover-effectnum"
                      style={{
                        fontSize: "25px",
                        paddingTop: "7px",
                        paddingLeft: "5px",
                      }}>
                      {item.ovrsItemName}
                    </h2>
                  </div>
                  <div>{item.ovrsPdno}</div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ display: "flex" }}>
                    <img
                      src={won}
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "5px",
                        marginBottom: "3px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        paddingTop: "2px",
                      }}>
                      {(
                        Number(item.frcrPchsAmt1) + Number(item.frcrEvluPflsAmt)
                      ).toLocaleString()}
                      USD
                    </span>
                  </div>
                  <div
                    style={{
                      border: "1px solid pink",
                      borderRadius: "10px",
                      width: "60px",
                      textAlign: "center",
                      backgroundColor: "pink",
                      fontWeight: "bold",
                      fontSize: "15px",
                      height: "28px",
                      paddingTop: "1px",
                    }}>
                    외화주식
                  </div>
                </div>

                <hr style={{ border: "1px dashed #ccc", margin: "10px 0" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "18px",
                  }}>
                  <span>보유 수량</span>
                  <div style={{ display: "flex" }}>
                    <img
                      src={stockqty}
                      style={{
                        width: "33px",
                        height: "30px",
                        marginRight: "5px",
                        marginBottom: "3px",
                      }}
                    />
                    <span className="hover-effectnum">
                      {Number(item.ovrsCblcQty).toLocaleString()}주
                    </span>
                  </div>
                </div>

                <hr style={{ border: "1px dashed #ccc", margin: "10px 0" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "18px",
                  }}>
                  <span>평가 손익</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={getProfitLossImage(Number(item.frcrEvluPflsAmt))}
                      alt="profit-loss"
                      style={{ width: "20px", marginRight: "5px" }}
                    />
                    <span>
                      {Math.abs(Number(item.frcrEvluPflsAmt)).toLocaleString()}
                      원
                    </span>
                  </div>
                </div>
                <hr style={{ border: "1px dashed #ccc", margin: "10px 0" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "18px",
                  }}>
                  <span>평가 손익률</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={getProfitLossImage(Number(item.evluPflsRt))}
                      alt="profit-loss-rate"
                      style={{ width: "20px", marginRight: "5px" }}
                    />
                    <span>
                      {Math.abs(Number(item.evluPflsRt)).toLocaleString()}%
                    </span>
                  </div>
                </div>
              </div>
            </Skeleton>
          </div>
        );
      })}
    </div>
  );
};

export default OverseasBalanceList;
