import React, { useState } from "react";
import MyAccounts from "../components/asset/Myaccounts";
import TotalAssetsOverview from "../components/asset/Trading";
import TotalAssets from "../components/asset/TotalAssets";
import MarketCapitalization from "../components/asset/MarketCapitalization";
import RankList from "../components/maininfor/RankList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tradingimage = `${process.env.PUBLIC_URL}/img/stockplusminus/trading.png`;
const MyAssets = () => {
  const [refreshKey, setRefreshKey] = useState(0); // 상태 변수 생성

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // 상태를 업데이트하여 컴포넌트 리렌더링 트리거
  };

  const handleImageClick = async () => {
    try {
      const response = await fetch("http://54.180.14.45:5000/update_balance", {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("총자산 업데이트 완료.");
      } else {
        toast.error("Failed to update balance.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error occurred while updating balance.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div
        style={{
          marginTop: "17px",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "flex-start",
          marginLeft: "30px",
          width: "50%",
          color: "rgb(98 98 98)",
        }}>
        <h3
          style={{
            fontWeight: "bold",
            marginTop: "5px",
            color: "rgb(98 98 98)",
            fontFamily: "Noto Sans KR",
          }}>
          내 자산
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "20px",
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <div
            className="total-assets"
            style={{
              width: "1000px",
              height: "650px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
              background: "white",
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <h3
                style={{
                  paddingTop: "25px",
                  textAlign: "left",
                  marginLeft: "30px",
                  paddingBottom: "15px",
                  width: "100%",
                }}>
                총자산 현황
              </h3>
              <span
                style={{
                  paddingRight: "40px",
                  fontSize: "2em",
                  cursor: "pointer",
                  color: "rgb(98 98 98)",
                }}
                className="material-symbols-outlined"
                onClick={handleRefresh} // 클릭 핸들러 추가
              >
                refresh
              </span>
            </div>
            <TotalAssets key={refreshKey} accountId="종합위탁" />
          </div>
          <div
            className="trading"
            style={{
              background: "white",
              width: "1000px",
              height: "650px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
              marginRight: "20px",
              marginTop: "20px",
            }}>
            <div style={{ display: "flex" }}>
              <h3
                style={{
                  paddingTop: "25px",
                  textAlign: "left",
                  marginLeft: "30px",
                  paddingBottom: "15px",
                  width: "100%",
                }}>
                트레이딩
              </h3>
              <img
                src={tradingimage}
                style={{
                  width: "50px",
                  height: "50px",
                  margin: "20px",
                  cursor: "pointer",
                }}
                alt="Trading"
                onClick={handleImageClick}
              />
            </div>
            <TotalAssetsOverview key={refreshKey} accountId="종합위탁" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <div
            className="my-accounts"
            style={{
              background: "white",
              width: "100%",
              height: "650px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginLeft: "10px",
              marginRight: "20px",
            }}>
            <h3
              style={{
                paddingTop: "25px",
                textAlign: "left",
                marginLeft: "30px",
                paddingBottom: "15px",
                width: "100%",
              }}>
              나의 계좌
            </h3>
            <MyAccounts />
          </div>
          <div
            className="exchange-tab"
            style={{
              background: "white",
              width: "100%",
              height: "650px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginTop: "20px",
              marginLeft: "10px",
              marginRight: "20px",
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <h3
                style={{
                  paddingTop: "25px",
                  textAlign: "left",
                  marginLeft: "30px",
                  paddingBottom: "15px",
                  width: "100%",
                }}>
                안전투자 기준
              </h3>
              <span
                style={{ paddingRight: "50px", fontSize: "2em" }}
                className="material-symbols-outlined">
                more_horiz
              </span>
            </div>

            <MarketCapitalization />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAssets;
