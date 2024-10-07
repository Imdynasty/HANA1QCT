import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Skeleton } from "antd";
import axios from "axios";
import "../../css/DomesticSearchStock.css";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

import { Tab, Tabs, Popover, Typography } from "@mui/material";

const FavoriteStockList = ({ onSelectStock }) => {
  const [favoriteStocks, setFavoriteStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverMessage, setPopoverMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const customerId = "1qct"; // 고객 ID
  const [closingPrices, setClosingPrices] = useState({});
  const [changePercentages, setChangePercentages] = useState({});

  const fetchStockPrices = async () => {
    try {
      const requests = favoriteStocks.map((item) =>
        axios.get(
          `http://13.125.78.241:8081/hanact/overseasstockprices?stockcode=${item.stockCode}`
        )
      );

      const responses = await Promise.all(requests);

      const prices = {};
      const percentages = {};

      responses.forEach((response, index) => {
        const latestData = response.data[response.data.length - 1];
        const stockCode = favoriteStocks[index].stockCode;
        prices[stockCode] = parseFloat(latestData.closePrice);
        percentages[stockCode] = parseFloat(latestData.changePercentage);
      });

      setClosingPrices(prices);
      setChangePercentages(percentages);
    } catch (error) {
      console.error("Error fetching stock prices:", error);
    }
  };

  useEffect(() => {
    if (favoriteStocks.length > 0) {
      fetchStockPrices();
    }
  }, [favoriteStocks]);

  // 관심 종목 불러오기
  const fetchFavoriteStocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://13.125.78.241:8081/overseas/favorite?customerId=${customerId}`
      );
      // console.log("Received data:", response.data); // 데이터 구조를 확인
      setFavoriteStocks(response.data); // 데이터를 상태에 저장
    } catch (error) {
      console.error("Error fetching favorite stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteStocks();
  }, []);

  const handleFavorite = async (stock) => {
    try {
      if (favoriteStocks.some((item) => item.stockCode === stock.stockCode)) {
        // 관심종목에서 제거
        await axios.delete(
          `http://13.125.78.241:8081/overseas/favorite?customerId=${customerId}`,
          { data: stock }
        );
        setFavoriteStocks(
          favoriteStocks.filter((item) => item.stockCode !== stock.stockCode)
        );
        setPopoverMessage(
          `${stock.stockName}이(가) 관심종목에서 제거되었습니다.`
        );
      } else {
        // 관심종목에 추가
        await axios.post(
          `http://13.125.78.241:8081/overseas/favorite?customerId=${customerId}`,
          stock
        );
        setFavoriteStocks([...favoriteStocks, stock.stockCode]);
        setPopoverMessage(
          `${stock.stockName}이(가) 관심종목에 추가되었습니다.`
        );
      }
      // 관심종목 목록 갱신
      fetchFavoriteStocks();
      setPopoverOpen(true); // 팝오버 열기
      setTimeout(() => setPopoverOpen(false), 3000); // 3초 후 팝오버 닫기
    } catch (error) {
      console.error("관심종목 처리 중 오류 발생:", error);
      setPopoverMessage("관심종목 처리 중 오류가 발생했습니다.");
      setPopoverOpen(true);
      setTimeout(() => setPopoverOpen(false), 3000);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        marginTop: "10px",
        borderRadius: "18px",
      }}>
      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={() => setPopoverOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}>
        <Typography sx={{ p: 2 }}>{popoverMessage}</Typography>
      </Popover>
      <List
        size="small"
        style={{
          width: "100%",
          maxHeight: "300px",
          overflow: "auto",
          borderRadius: "15px",
        }}
        className="demo-loadmore-list"
        // loading={loading}
        itemLayout="horizontal"
        dataSource={favoriteStocks}
        renderItem={(item, index) => {
          // console.log("Rendering item:", item); // 각 항목이 어떻게 렌더링되는지 확인
          const imageName = item.stockCode
            ? `${item.stockCode}.png`
            : "default.png";
          const imageUrl = `${process.env.PUBLIC_URL}/img/AmericaLogo/${imageName}`;
          return (
            <List.Item className="list-item">
              <Skeleton
                paragraph={{ rows: 1 }}
                avatar
                title={true}
                loading={loading}
                active>
                <List.Item.Meta
                  onClick={() => onSelectStock(item)}
                  avatar={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}>
                      <Avatar size={50} src={imageUrl} />
                    </div>
                  }
                  title={
                    <h2
                      style={{ fontSize: "25px", paddingTop: "7px" }}
                      href="https://ant.design">
                      {item.stockName}
                    </h2>
                  }
                  description={item.stockCode}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "20px",
                    paddingRight: "40px",
                    color:
                      changePercentages[item.stockCode] < 0
                        ? "rgb(71 128 239)"
                        : "rgb(255 33 35)",
                  }}>
                  {closingPrices[item.stockCode] !== undefined ? (
                    `${closingPrices[item.stockCode].toLocaleString("ko-KR")}`
                  ) : (
                    <Skeleton.Input active size="small" style={{ width: 10 }} />
                  )}
                </div>
                <Button
                  size="large"
                  icon={
                    favoriteStocks.some(
                      (fav) => fav.stockCode === item.stockCode
                    ) ? (
                      <HeartFilled />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={() => handleFavorite(item)}
                  style={{
                    color: favoriteStocks.some(
                      (fav) => fav.stockCode === item.stockCode
                    )
                      ? "red"
                      : "gray",
                    fontSize: "20px",
                    marginRight: "20px",
                  }}
                />
              </Skeleton>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default FavoriteStockList;
