import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Divider, Skeleton } from "antd"; // Import Skeleton
import "../../css/AskingOverseasPrice.css";

const OrderBook = ({ stockCode, isOverseas = false }) => {
  const [orderData, setOrderData] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [volume, setVolume] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedPriceDifference, setSelectedPriceDifference] = useState(null);
  const [selectedPricePercentage, setSelectedPricePercentage] = useState(null);
  const [lowPrice, setLowPrice] = useState(null);
  const [highPrice, setHighPrice] = useState(null);
  const [openPrice, setOpenPrice] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const socketRef = useRef(null);
  const containerRef = useRef(null); // Ref for the container

  useEffect(() => {
    if (stockCode) {
      console.log("OrderBook component mounted with stock code:", stockCode);

      // Disconnect existing socket connection if present
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      // Initialize and connect new socket connection
      socketRef.current = io("http://54.180.14.45:5001");

      // Send request to server
      socketRef.current.emit("request_orderbook", { code: stockCode });

      // Receive data from the server
      socketRef.current.on("orderbook_update", (data) => {
        if (data) {
          setOrderData(data); // Store the received data
          setLoading(false); // 로딩 완료
        }
      });

      // Fetch current price data
      axios
        .get(
          `http://13.125.78.241:8081/hanact/overseasstockprices?stockcode=${stockCode}`
        )
        .then((response) => {
          const data = response.data;
          setCurrentPrice(data[data.length - 1].closePrice); // Assume the last data point is the current
          setVolume(data[data.length - 1].volume); // Assume the last data point is the current volume
          setLowPrice(data[data.length - 1].lowPrice);
          setHighPrice(data[data.length - 1].highPrice);
          setOpenPrice(data[data.length - 1].openPrice);
        })
        .catch((error) => {
          console.error("Error fetching current price data:", error);
        });

      // Cleanup socket connection on component unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.off("orderbook_update");
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [stockCode]);

  useEffect(() => {
    if (orderData && currentPrice !== null) {
      const initialPrice = parseFloat(orderData.pbid1);
      const difference = initialPrice - currentPrice;
      const percentageDiff = calculatePercentageDifference(initialPrice);

      setSelectedPrice(initialPrice);
      setSelectedPriceDifference(difference);
      setSelectedPricePercentage(percentageDiff);
    }
  }, [orderData, currentPrice]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        (containerRef.current.scrollHeight -
          containerRef.current.clientHeight) /
        2;
    }
  }, [orderData]);

  const handlePriceClick = (price) => {
    const difference = price - currentPrice;
    const percentageDiff = calculatePercentageDifference(price);
    setSelectedPrice(price);
    setSelectedPriceDifference(difference);
    setSelectedPricePercentage(percentageDiff);
  };

  const calculatePercentageDifference = (price) => {
    const difference = ((price - currentPrice) / currentPrice) * 100;
    return difference.toFixed(1);
  };

  const formatCurrency = (value) => {
    const numericValue = parseFloat(value); // Ensure the value is a number

    if (isNaN(numericValue)) return "-"; // Handle cases where the value is not a number
    return numericValue.toFixed(4); // Format to 4 decimal places
  };

  const formatVolume = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return "-";
    return numericValue.toFixed(0); // Format without decimals
  };

  const formatTime = (time) => {
    if (!time) return "-"; // time 값이 없을 때 기본값 반환
    return time.replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
  };

  if (!orderData || currentPrice === null) {
    return (
      <div style={{ marginTop: "10px" }} className="mainmain">
        <Skeleton active paragraph={{ rows: 3 }} />
        <Divider />
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    );
  }

  const askPrices = [
    parseFloat(orderData.pask1),
    parseFloat(orderData.pask2),
    parseFloat(orderData.pask3),
    parseFloat(orderData.pask4),
    parseFloat(orderData.pask5),
    parseFloat(orderData.pask6),
    parseFloat(orderData.pask7),
    parseFloat(orderData.pask8),
    parseFloat(orderData.pask9),
    parseFloat(orderData.pask10),
  ];

  const bidPrices = [
    parseFloat(orderData.pbid1),
    parseFloat(orderData.pbid2),
    parseFloat(orderData.pbid3),
    parseFloat(orderData.pbid4),
    parseFloat(orderData.pbid5),
    parseFloat(orderData.pbid6),
    parseFloat(orderData.pbid7),
    parseFloat(orderData.pbid8),
    parseFloat(orderData.pbid9),
    parseFloat(orderData.pbid10),
  ];

  const askQuantities = [
    orderData.vask1,
    orderData.vask2,
    orderData.vask3,
    orderData.vask4,
    orderData.vask5,
    orderData.vask6,
    orderData.vask7,
    orderData.vask8,
    orderData.vask9,
    orderData.vask10,
  ];

  const bidQuantities = [
    orderData.vbid1,
    orderData.vbid2,
    orderData.vbid3,
    orderData.vbid4,
    orderData.vbid5,
    orderData.vbid6,
    orderData.vbid7,
    orderData.vbid8,
    orderData.vbid9,
    orderData.vbid10,
  ];

  const selectedColor =
    selectedPriceDifference > 0
      ? "rgb(254 34 35)"
      : selectedPriceDifference < 0
      ? "rgb(72 128 239)"
      : "black";

  const totalAskVolume = askQuantities.reduce(
    (acc, quantity) => acc + parseFloat(quantity || 0),
    0
  );
  const totalBidVolume = bidQuantities.reduce(
    (acc, quantity) => acc + parseFloat(quantity || 0),
    0
  );

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(" ")[0];
  };

  return (
    <div>
      <div
        className="mainPrice"
        style={{
          display: "flex",
          color: selectedColor,
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "10px",
          marginTop: "10px",
          fontSize: "20px",
        }}>
        <div style={{ fontSize: "35px", fontWeight: "bold" }}>
          {selectedPrice ? formatCurrency(selectedPrice) : "-"}
        </div>
        <div
          style={{ marginLeft: "70px", display: "flex", alignItems: "center" }}>
          {selectedPriceDifference !== null ? (
            <>
              <span
                className="material-symbols-outlined"
                style={{ color: selectedColor, fontSize: "35px" }}>
                {selectedPriceDifference < 0
                  ? "arrow_drop_down"
                  : "arrow_drop_up"}
              </span>
              <span>{formatCurrency(Math.abs(selectedPriceDifference))}</span>
            </>
          ) : (
            "-"
          )}

          <div style={{ marginLeft: "50px" }}>
            {selectedPricePercentage ? `${selectedPricePercentage}%` : "-"}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "20px", color: "#868686", fontSize: "15px" }}>
        <div style={{ display: "flex" }}>
          <div>
            종가(전일) {"     "}
            {formatCurrency(currentPrice)}
          </div>
          <div style={{ marginLeft: "20px" }}>
            거래량(전일){""} {volume}M
          </div>
        </div>
      </div>
      <div className="mainAsking">
        <div className="orderbook-header">
          <div className="orderbook-header-item">매도</div>
          <div className="orderbook-header-item">{getCurrentTime()}</div>
          <div className="orderbook-header-item">매수</div>
        </div>

        <div className="orderbook-container" ref={containerRef}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 10 }} /> // 로딩 중일 때 Skeleton 표시
          ) : (
            <div className="orderbook-body">
              {askPrices.map((price, index) => {
                const percentageDiff = calculatePercentageDifference(price);
                let color;
                if (percentageDiff > 0) {
                  color = "red";
                } else if (percentageDiff < 0) {
                  color = "blue";
                } else {
                  color = "black";
                }
                return (
                  <div
                    key={index}
                    className="orderbook-rowask"
                    onClick={() => handlePriceClick(price)}>
                    <div
                      className="orderbook-cellask ask"
                      style={{
                        width: "65%",
                      }}>
                      <div className="orderbook-quantity">
                        <div className="backcolorask">
                          {formatVolume(askQuantities[index])}
                        </div>
                      </div>
                      <div className="orderbook-price" style={{ color }}>
                        <span>{formatCurrency(price)}</span>
                        <span className="percentage-diff">
                          ({percentageDiff}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Divider style={{ margin: 5 }} />
              <div className="boxbox"></div>
              <div className="openPrice">
                <span>시 {""}</span>
                {formatCurrency(openPrice)}
              </div>
              <div className="lowhighPrice">
                <div className="subsub">
                  <span>고 {""}</span>
                  {formatCurrency(highPrice)}
                </div>
                <div className="subsub sub2">
                  {" "}
                  <span>저 {""}</span>
                  {formatCurrency(lowPrice)}
                </div>
              </div>
              {bidPrices.map((price, index) => {
                const percentageDiff = calculatePercentageDifference(price);
                let color;
                if (percentageDiff > 0) {
                  color = "red";
                } else if (percentageDiff < 0) {
                  color = "blue";
                } else {
                  color = "black";
                }
                const isBidp1 = price === parseFloat(orderData.pbid1);
                const bidStyle = isBidp1
                  ? {
                      fontWeight: "bold",
                      backgroundColor: "#ffffcc",
                    } // 강조할 스타일
                  : {};
                return (
                  <div
                    key={index}
                    className="orderbook-row"
                    onClick={() => handlePriceClick(price)}>
                    <div
                      className="orderbook-cellbid bid"
                      style={{
                        width:
                          formatCurrency(price).toString().length === 7
                            ? "58%"
                            : "59.5%", // 00.0000 -> 7자리, 000.0000 -> 8자리
                      }}>
                      <div
                        className="orderbook-price"
                        style={{
                          color,
                        }}>
                        <span style={{ ...bidStyle }}>
                          {formatCurrency(price)}
                        </span>
                        <span className="percentage-diff">
                          ({percentageDiff}%)
                        </span>
                      </div>

                      <div className="orderbook-quantity2">
                        <div className="backcolorbid">
                          {formatVolume(bidQuantities[index])}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="orderbook-footer">
          <div className="orderbook-footer-item one">
            {formatVolume(totalAskVolume)}
          </div>

          <div className="orderbook-footer-item two">
            {formatVolume(totalBidVolume)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
