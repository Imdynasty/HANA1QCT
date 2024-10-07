import React, { useState } from "react";
import { Popover } from "antd";
import "../css/InternationalStocks.css";
import TradingViewChart from "../components/international/TradingViewChart";
import SearchOverseasStock from "../components/international/SearchOverseasStock";
import Overseascontract from "../components/international/OverseasContract";
import OverseasOrder from "../components/international/OverseasOrder";
import StockAnalysis from "../components/international/StockAnalysis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contractimage = `${process.env.PUBLIC_URL}/img/stockplusminus/contract.png`;
const content = (
  <div style={{ width: "400px", height: "400px", fontSize: "18px" }}>
    {" "}
    {/* Popover의 너비를 300px로 조절 */}
    <p>
      <strong style={{ color: "red" }}>경고:</strong> 본 서비스에서 제공되는
      주식 추천은 사용자의 과거 투자 성향 및 현재 시장 데이터를 기반으로 자동
      생성된 참고 자료입니다. 이 추천은{" "}
      <u>투자에 대한 조언이나 권장 사항이 아니며</u>, 모든 투자 결정의{" "}
      <strong style={{ color: "red", textDecoration: "underline" }}>
        최종 책임은 사용자 본인에게
      </strong>{" "}
      있습니다.
    </p>
    <p>
      주식 시장은 매우 변동성이 크며, 시장 상황에 따라 추천된 주식의 성과가
      달라질 수 있습니다. 따라서 본 서비스를 이용하여 이루어진 투자로 인한{" "}
      <strong style={{ color: "red" }}>
        손실에 대해 어떠한 법적 책임도 지지 않으며
      </strong>
      , 사용자는 스스로의 판단에 따라 신중히 투자 결정을 내리셔야 합니다.
    </p>
    <p>
      본 서비스는 <u>투자 교육을 위한 참고 자료일 뿐</u>이며, 전문가의 재무
      상담을 대체하지 않습니다. 투자에 앞서{" "}
      <strong>재무 전문가와 상담하시기 바랍니다.</strong>
    </p>
  </div>
);
const content2 = (
  <div style={{ width: "530px", height: "420px", fontSize: "18px" }}>
    {/* Popover의 너비를 300px로 조절 */}
    <p>
      <strong style={{ color: "orange" }}>안내:</strong> 본 서비스는{" "}
      <strong style={{ color: "black", textDecoration: "underline" }}>
        현금 투자 중심의 안전한 투자 전략
      </strong>
      을 지향합니다. 따라서, 고객님의 자산을 보호하기 위해 증거금은{" "}
      <u style={{ color: "orange", fontWeight: "bold" }}> 100%</u>
      으로 고정되어 있습니다.
    </p>
    <p>
      이는 고객님께서 투자에 필요한 전액을 미리 준비함으로써, 시장 변동성에 의한
      불확실성을 최소화하고, 안전한 투자 환경을 제공하기 위한 조치입니다.{" "}
      <strong style={{ color: "black" }}>
        투자에 대한 모든 책임은 고객님께 있으며
      </strong>
      , 본 서비스는 안전하고 투명한 투자 경험을 제공하기 위해 최선을 다하고
      있습니다.
    </p>
    <p>
      증거금을 <u style={{ color: "orange", fontWeight: "bold" }}> 100%</u>로
      고정함으로써, 과도한 레버리지나 신용 거래로 인한 위험을 피할 수 있습니다.
      이는{" "}
      <u>
        고객님의 자산을 안전하게 관리하고, 안정적인 수익을 창출하는 데 도움을
        줍니다
      </u>
      .
    </p>
    <p>
      본 서비스는{" "}
      <strong style={{ color: "black", textDecoration: "underline" }}>
        책임감 있는 투자
      </strong>
      를 지원하며, 장기적으로 고객님의 자산을 안전하게 성장시키는 것을 목표로
      하고 있습니다. 투자를 진행하기 전, 관련된 모든 사항을 충분히 이해하시고
      신중히 결정해 주시기 바랍니다.
    </p>
  </div>
);
const InternationalStocks = () => {
  const handleSummaryImageClick = async () => {
    try {
      const response = await fetch(
        "http://54.180.14.45:5000/update_overseas_contract",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("체결내역 업데이트 완료.");
      } else {
        toast.error("Failed to update overseas contract.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error occurred while updating overseas contract.");
    }
  };

  const [selectedStock, setSelectedStock] = useState({
    stockCode: "AAPL",
    stockName: "애플",
  });
  const [selectedStockCode, setSelectedStockCode] = useState("AAPL");
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
          해외주식
        </h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: "20px",
          }}>
          <div
            className="overseastock"
            style={{
              width: "33%",
              height: "700px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
              background: "white",
            }}>
            <div
              style={{
                display: "flex",
                padding: "10px",
                marginTop: "20px",
                paddingLeft: "25px",
                fontSmooth: "auto",
                justifyContent: "space-between",
              }}>
              <div style={{ display: "flex" }}>
                <h3 style={{ fontSize: "20px" }}>1QCT PICK </h3>{" "}
                <span
                  style={{ paddingTop: "2px" }}
                  className="material-symbols-outlined spanarrow">
                  chevron_right
                </span>
              </div>
              <Popover
                placement="leftTop"
                content={content}
                title={
                  <strong style={{ color: "red", fontSize: "20px" }}>
                    중요 공지사항
                  </strong>
                } // 타이틀에 빨간색으로 "중요 공지사항" 추가
                trigger="click">
                <div className="infoerror" style={{ cursor: "pointer" }}>
                  <span>주의사항</span>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "gray", paddingTop: "2px" }}>
                    error
                  </span>
                </div>
              </Popover>
            </div>

            <StockAnalysis />
          </div>
          <div
            className="overseastock"
            style={{
              background: "white",
              width: "40%",
              height: "700px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
              marginRight: "20px",
            }}>
            <div
              style={{
                display: "flex",
                padding: "10px",
                marginTop: "20px",
                paddingLeft: "25px",
                fontSmooth: "auto",
              }}>
              <h3 style={{ fontSize: "20px" }}>종목검색 </h3>{" "}
              <span
                style={{ paddingTop: "2px" }}
                className="material-symbols-outlined spanarrow">
                chevron_right
              </span>
            </div>

            <SearchOverseasStock
              onSelectStock={(stockCode, stockName) => {
                setSelectedStockCode(stockCode); // 기존의 stockCode 설정
                setSelectedStock({ stockCode, stockName }); // stockCode와 stockName을 동시에 설정
              }}
            />
          </div>
          <div
            className="overseastock"
            style={{
              background: "white",
              width: "40%",
              height: "700px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginRight: "40px",
            }}>
            <div
              style={{
                display: "flex",
                padding: "10px",
                marginTop: "20px",
                paddingLeft: "25px",
                fontSmooth: "auto",
                justifyContent: "space-between",
                height: "53px",
                // alignItems: "center",
              }}>
              <div
                style={{
                  display: "flex",
                }}>
                <h3 style={{ fontSize: "20px" }}>매매하기 </h3>{" "}
                <span
                  style={{ paddingTop: "2px" }}
                  className="material-symbols-outlined spanarrow">
                  chevron_right
                </span>
              </div>
              <Popover
                placement="leftTop"
                content={content2}
                title={
                  <strong style={{ color: "orange", fontSize: "20px" }}>
                    중요 공지사항
                  </strong>
                } // 타이틀에 빨간색으로 "중요 공지사항" 추가
                trigger="click">
                <div
                  className="infoerror"
                  style={{ cursor: "pointer", height: "40px" }}>
                  <span>확인사항</span>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "gray", paddingTop: "2px" }}>
                    error
                  </span>
                </div>
              </Popover>
            </div>
            <OverseasOrder selectedStock={selectedStock} />
          </div>
        </div>
        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
          <div
            className="overseastock"
            style={{
              background: "white",
              width: "50%",
              height: "590px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
              marginRight: "20px",
            }}>
            <div
              style={{
                display: "flex",
                padding: "10px",
                marginTop: "20px",
                paddingLeft: "25px",
                fontSmooth: "auto",
              }}>
              <h3 style={{ fontSize: "20px" }}>주식차트</h3>{" "}
              <span
                style={{ paddingTop: "2px" }}
                className="material-symbols-outlined spanarrow">
                chevron_right
              </span>
            </div>
            <TradingViewChart symbol={`NASDAQ:${selectedStockCode}`} />
          </div>
          <div
            className="overseastock"
            style={{
              background: "white",
              width: "50%",
              height: "600px",
              borderRadius: "25px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              marginRight: "40px",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  display: "flex",
                  padding: "10px",
                  marginTop: "20px",
                  paddingLeft: "25px",
                  fontSmooth: "auto",
                }}>
                <h3 style={{ fontSize: "20px" }}>체결내역 </h3>{" "}
                <span
                  style={{ paddingTop: "2px" }}
                  className="material-symbols-outlined spanarrow">
                  chevron_right
                </span>
              </div>
              <img
                src={contractimage}
                style={{
                  width: "50px",
                  height: "50px",
                  margin: "20px",
                  cursor: "pointer",
                }}
                onClick={handleSummaryImageClick}></img>
            </div>
            <Overseascontract />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternationalStocks;
