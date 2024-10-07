import React, { useState, useEffect } from "react";
import { Button, Card, List, Avatar, Skeleton } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import axios from "axios";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Popover, Typography } from "@mui/material";
import FavoriteStockList from "../international/FavoriteStockList";
import DomesticBalanceList from "../domestic/DomesticBalanceList";
import OverseasBalanceList from "../international/OverseasBalanceList";
import StockChart from "./InterestStockChart";
import CircularProgress from "@mui/material/CircularProgress";
import "../../css/InterestStock.css";
import { Square } from "@chakra-ui/react";

const StockDashboard = () => {
  const customerId = "1qct"; // 고객 ID
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [favoriteStocks, setFavoriteStocks] = useState([]);
  const [list, setList] = useState([]); // 관심종목
  const [selectedStock, setSelectedStock] = useState(null);
  const [stocks, setStocks] = useState([]);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverMessage, setPopoverMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [closingPrices, setClosingPrices] = useState({});
  const [changePercentages, setChangePercentages] = useState({});

  const fetchStockPrices = async (stockCodes) => {
    try {
      const requests = stockCodes.map((stockCode) =>
        axios.get(
          `http://13.125.78.241:8081/hanact/domesticstockprices?stockcode=${stockCode}`
        )
      );

      const responses = await Promise.all(requests);

      const newClosingPrices = {};
      const newChangePercentages = {};

      responses.forEach((response, index) => {
        // tradingDate 기준으로 내림차순 정렬
        const sortedData = response.data.sort(
          (a, b) => new Date(b.tradingDate) - new Date(a.tradingDate)
        );

        const latestData = sortedData[0]; // 가장 최신 데이터 선택
        const stockCode = stockCodes[index];
        newClosingPrices[stockCode] = parseFloat(latestData.closePrice);
        newChangePercentages[stockCode] = parseFloat(
          latestData.changePercentage
        );
      });

      setClosingPrices((prevState) => ({
        ...prevState,
        ...newClosingPrices,
      }));

      setChangePercentages((prevState) => ({
        ...prevState,
        ...newChangePercentages,
      }));
    } catch (error) {
      console.error("Error fetching stock prices:", error);
    }
  };

  useEffect(() => {
    if (list.length > 0) {
      const stockCodes = list.map((item) => item.stockCode);
      fetchStockPrices(stockCodes);
    }
  }, [list]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        await fetchStocks();
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  // 관심 종목 불러오기
  const fetchFavoriteStocks = async () => {
    try {
      const response = await axios.get(
        `http://13.125.78.241:8081/domestic/favorite?customerId=${customerId}`
      );
      // console.log("Favorite stocks:", response.data);
      setFavoriteStocks(response.data.map((item) => item.stockCode));
      setList(response.data); // 관심종목 리스트 저장
    } catch (error) {
      console.error("Error fetching favorite stocks:", error);
    }
  };
  useEffect(() => {
    if (stocks.length > 0) {
      fetchFavoriteStocks();
      const initialStock = stocks.find(
        (stock) => stock.stockName === "하나금융지주"
      );
      if (initialStock) {
        setSelectedStock(initialStock);
      }
    }
  }, [stocks]);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(
        `http://13.125.78.241:8081/hana/domesticstock`
      );
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (stock) => {
    try {
      if (favoriteStocks.includes(stock.stockCode)) {
        await axios.delete(
          `http://13.125.78.241:8081/domestic/favorite?customerId=${customerId}`,
          { data: stock }
        );
        setFavoriteStocks(
          favoriteStocks.filter((code) => code !== stock.stockCode)
        );
        setPopoverMessage(
          `${stock.stockName}이(가) 관심종목에서 제거되었습니다.`
        );
      } else {
        await axios.post(
          `http://13.125.78.241:8081/domestic/favorite?customerId=${customerId}`,
          stock
        );
        setFavoriteStocks([...favoriteStocks, stock.stockCode]);
        setPopoverMessage(
          `${stock.stockName}이(가) 관심종목에 추가되었습니다.`
        );
      }
      fetchFavoriteStocks();
      setPopoverOpen(true);
      setTimeout(() => setPopoverOpen(false), 3000);
    } catch (error) {
      console.error("관심종목 처리 중 오류 발생:", error);
      setPopoverMessage("관심종목 처리 중 오류가 발생했습니다.");
      setPopoverOpen(true);
      setTimeout(() => setPopoverOpen(false), 3000);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card
      className="interestCard"
      style={{
        height: "810px",
        padding: "0px !important",
        borderRadius: "20px",
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

      <div style={{}}>
        <div style={{ marginBottom: "10px", minHeight: "300px" }}>
          {selectedStock ? (
            <StockChart
              stockCode={selectedStock.stockCode}
              stockName={selectedStock.stockName}
            />
          ) : (
            <div style={{ width: "100%", marginLeft: "20px" }}>
              <div className="stockinfoprice" style={{ marginBottom: "20px" }}>
                <Skeleton
                  active
                  size="small"
                  shape="round"
                  paragraph={{ rows: 0 }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 345,
                }}>
                <CircularProgress
                  size={60}
                  color="inherit"
                  style={{ opacity: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", marginLeft: "10px" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor="inherit"
            sx={{
              textColor: "green",
              "& .MuiTabs-indicator": {
                backgroundColor: "rgb(2 183 207)",
              },
            }}
            style={{ marginLeft: "10px" }}>
            <Tab
              label="관심종목"
              {...a11yProps(0)}
              sx={{ color: "black", fontSize: "20px" }}
            />
            <Tab
              label="해외관심종목"
              {...a11yProps(1)}
              sx={{ color: "black", fontSize: "20px" }}
            />
            <Tab
              label="국내보유주식"
              {...a11yProps(2)}
              sx={{ color: "black", fontSize: "20px" }}
            />
            <Tab
              label="해외보유주식"
              {...a11yProps(3)}
              sx={{ color: "black", fontSize: "20px" }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <List
            size="small"
            style={{
              width: "100%",
              maxHeight: "300px",
              overflow: "auto",
              marginTop: "10px",
              borderRadius: "18px",
            }}
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={
              loading
                ? [...Array(5)].map((_, i) => ({ loading: true, id: i }))
                : list
            }
            renderItem={(item, index) => {
              if (item.loading) {
                return (
                  <List.Item key={index}>
                    <Skeleton
                      active
                      avatar={{ shape: "circle", size: 50 }}
                      paragraph={{ rows: 1 }}
                    />
                  </List.Item>
                );
              }

              const stockNameToImageName = {
                삼성전자: "samsung",
                SK하이닉스: "sk",
                LG에너지솔루션: "lg",
                현대차: "hyundai",
                기아: "kia",
                셀트리온: "celltrion",
                KB금융: "kb",
                신한지주: "shinhan",
                POSCO홀딩스: "posco",
                NAVER: "naver",
                현대모비스: "mobis",
                하나금융지주: "logo",
                LG전자: "lg",
                메리츠금융지주: "meritz",
                카카오: "kakao",
              };

              const imageName = stockNameToImageName[item.stockName] + ".png";
              const imageUrl = `${process.env.PUBLIC_URL}/img/KoreaLogo/${imageName}`;

              return (
                <List.Item className="list-item">
                  <List.Item.Meta
                    onClick={() => setSelectedStock(item)}
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
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 10 }}
                      />
                    )}
                  </div>
                  <Button
                    size="large"
                    icon={
                      favoriteStocks.includes(item.stockCode) ? (
                        <HeartFilled />
                      ) : (
                        <HeartOutlined />
                      )
                    }
                    onClick={() => handleFavorite(item)}
                    style={{
                      color: favoriteStocks.includes(item.stockCode)
                        ? "red"
                        : "gray",
                      fontSize: "20px",
                      marginRight: "15px",
                    }}
                  />
                </List.Item>
              );
            }}
          />
        </CustomTabPanel>
        <CustomTabPanel className="tabpanel" value={value} index={1}>
          <FavoriteStockList onSelectStock={setSelectedStock} />
        </CustomTabPanel>
        <CustomTabPanel className="tabpanel" value={value} index={2}>
          <DomesticBalanceList accountId="종합위탁" />
        </CustomTabPanel>
        <CustomTabPanel className="tabpanel" value={value} index={3}>
          <OverseasBalanceList />
        </CustomTabPanel>
      </Box>
    </Card>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default StockDashboard;
