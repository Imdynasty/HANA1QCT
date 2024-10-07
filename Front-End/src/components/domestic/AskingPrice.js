import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Divider, Skeleton } from "antd"; // Import Skeleton
import "../../css/AskingPrice.css";

const OrderBook = ({ stockCode }) => {
  const [orderData, setOrderData] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [volume, setVolume] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedPriceDifference, setSelectedPriceDifference] = useState(null);
  const [selectedPricePercentage, setSelectedPricePercentage] = useState(null);
  const [lowPrice, setLowPrice] = useState(null);
  const [highPrice, setHighPrice] = useState(null);
  const [openPrice, setOpenPrice] = useState(null);
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
      socketRef.current = io("http://54.180.14.45:5002");

      // Send request to server
      socketRef.current.emit("request_orderbook", { code: stockCode });

      // Receive data from the server
      socketRef.current.on("orderbook_update", (data) => {
        if (data && data.length > 0) {
          setOrderData(data[0]); // Store the first element of the data array
        }
      });

      // Fetch current price data
      axios
        .get(
          `http://13.125.78.241:8081/hanact/domesticstockprices?stockcode=${stockCode}`
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
      // Set the initial selected values based on orderData.bidp1
      const initialPrice = orderData.bidp1;
      const difference = initialPrice - currentPrice;
      const percentageDiff = calculatePercentageDifference(initialPrice);

      setSelectedPrice(initialPrice);
      setSelectedPriceDifference(difference);
      setSelectedPricePercentage(percentageDiff);
    }
  }, [orderData, currentPrice]);

  useEffect(() => {
    // Scroll the container to the middle when the component mounts
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
    return new Intl.NumberFormat("ko-KR", {
      // style: "currency",
      currency: "KRW",
    }).format(value);
  };

  const formatTime = (time) => {
    return time.replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
  };

  if (!orderData || currentPrice === null) {
    return (
      <div style={{ marginTop: "10px" }} className="mainmain">
        <Skeleton active paragraph={{ rows: 3 }} /> {/* Main skeleton */}
        {/* Button skeleton */}
        <Divider />
        <Skeleton active paragraph={{ rows: 3 }} /> {/* Main skeleton */}
      </div>
    );
  }

  const askPrices = [
    orderData.askp1,
    orderData.askp2,
    orderData.askp3,
    orderData.askp4,
    orderData.askp5,
    orderData.askp6,
    orderData.askp7,
    orderData.askp8,
    orderData.askp9,
    orderData.askp10,
  ].reverse(); // Sort in descending order

  const bidPrices = [
    orderData.bidp1,
    orderData.bidp2,
    orderData.bidp3,
    orderData.bidp4,
    orderData.bidp5,
    orderData.bidp6,
    orderData.bidp7,
    orderData.bidp8,
    orderData.bidp9,
    orderData.bidp10,
  ];

  const askQuantities = [
    orderData.askp_rsqn1,
    orderData.askp_rsqn2,
    orderData.askp_rsqn3,
    orderData.askp_rsqn4,
    orderData.askp_rsqn5,
    orderData.askp_rsqn6,
    orderData.askp_rsqn7,
    orderData.askp_rsqn8,
    orderData.askp_rsqn9,
    orderData.askp_rsqn10,
  ].reverse(); // Sort in descending order

  const bidQuantities = [
    orderData.bidp_rsqn1,
    orderData.bidp_rsqn2,
    orderData.bidp_rsqn3,
    orderData.bidp_rsqn4,
    orderData.bidp_rsqn5,
    orderData.bidp_rsqn6,
    orderData.bidp_rsqn7,
    orderData.bidp_rsqn8,
    orderData.bidp_rsqn9,
    orderData.bidp_rsqn10,
  ];

  const selectedColor =
    selectedPriceDifference > 0
      ? "rgb(254 34 35)"
      : selectedPriceDifference < 0
      ? "rgb(72 128 239)"
      : "black";

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
            거래량(전일){""} {volume}K
          </div>
        </div>
      </div>
      <div className="mainAsking">
        <div className="orderbook-header">
          <div className="orderbook-header-item">매도</div>
          <div className="orderbook-header-item">
            {formatTime(orderData.aspr_acpt_hour)}
          </div>
          <div className="orderbook-header-item">매수</div>
        </div>
        <div className="orderbook-container" ref={containerRef}>
          <div className="orderbook-body">
            {askPrices.map((price, index) => {
              const percentageDiff = calculatePercentageDifference(price);
              let color;
              if (percentageDiff > 0) {
                color = "red";
              } else if (percentageDiff < 0) {
                color = "blue";
              } else {
                color = "black"; // 0.0% difference
              }
              return (
                <div
                  key={index}
                  className="orderbook-rowask"
                  onClick={() => handlePriceClick(price)}>
                  <div
                    className="orderbook-cellask ask"
                    style={{
                      border:
                        selectedPrice === price ? `1px solid ${color}` : "none",
                    }}>
                    <div className="orderbook-quantity">
                      <div className="backcolorask">
                        {formatCurrency(askQuantities[index])}
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
                color = "black"; // 0.0% difference
              }
              const isBidp1 = price === orderData.bidp1;
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
                      width: price.toString().length === 5 ? "59%" : "60%",
                    }}>
                    <div className="orderbook-price" style={{ color }}>
                      <span style={{ ...bidStyle }}>
                        {formatCurrency(price)}
                      </span>
                      <span className="percentage-diff">
                        ({percentageDiff}%)
                      </span>
                    </div>

                    <div className="orderbook-quantity2">
                      <div className="backcolorbid">
                        {formatCurrency(bidQuantities[index])}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="orderbook-footer">
          <div className="orderbook-footer-item one">
            {formatCurrency(orderData.total_askp_rsqn)}
          </div>

          <div className="orderbook-footer-item two">
            {formatCurrency(orderData.total_bidp_rsqn)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
