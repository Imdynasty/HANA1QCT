import React, { useEffect, useState } from "react";
import { Avatar, Button, List, AutoComplete, Skeleton } from "antd";
import Box from "@mui/material/Box";
import axios from "axios";
import { SearchIcon } from "@chakra-ui/icons";
import "../../css/DomesticSearchStock.css";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Tab, Tabs, Popover, Typography } from "@mui/material";
import AskingOverseasPrice from "./AskingOverseasPrice";
import PropTypes from "prop-types";

const SearchStock = ({ onSelectStock }) => {
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("애플"); // 초기값 설정
  const [selectedStock, setSelectedStock] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [favoriteStocks, setFavoriteStocks] = useState([]);
  const [list, setList] = useState([]); // 관심종목 리스트 저장
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverMessage, setPopoverMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const customerId = "1qct"; // 고객 ID
  const [closingPrices, setClosingPrices] = useState({});
  const [changePercentages, setChangePercentages] = useState({});

  const fetchStockPrice = async (stockCode) => {
    try {
      const response = await axios.get(
        `http://13.125.78.241:8081/hanact/overseasstockprices?stockcode=${stockCode}`
      );

      // tradingDate 기준으로 내림차순 정렬
      const sortedData = response.data.sort(
        (a, b) => new Date(b.tradingDate) - new Date(a.tradingDate)
      );

      const latestData = sortedData[0]; // 정렬 후 가장 최신 데이터 선택

      setClosingPrices((prevState) => ({
        ...prevState,
        [stockCode]: parseFloat(latestData.closePrice), // 숫자로 변환
      }));
      setChangePercentages((prevState) => ({
        ...prevState,
        [stockCode]: parseFloat(latestData.changePercentage), // 숫자로 변환
      }));
    } catch (error) {
      console.error("Error fetching stock price:", error);
    }
  };

  useEffect(() => {
    list.forEach((item) => {
      fetchStockPrice(item.stockCode);
    });
  }, [list]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // 관심 종목 불러오기
  const fetchFavoriteStocks = async () => {
    try {
      const response = await axios.get(
        `http://13.125.78.241:8081/overseas/favorite?customerId=${customerId}`
      );
      setFavoriteStocks(response.data.map((item) => item.stockCode));
      setList(response.data); // 관심종목 리스트 저장
      console.log("Favorite stocks:", response.data);
    } catch (error) {
      console.error("Error fetching favorite stocks:", error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    if (stocks.length > 0) {
      fetchFavoriteStocks();
      const initialStock = stocks.find((stock) => stock.stockName === "애플");
      if (initialStock) {
        setSelectedStock(initialStock);
        onSelectStock(initialStock.stockCode, initialStock.stockName);
      }
    }
  }, [stocks]);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://13.125.78.241:8081/hana/overseasstock`
      );
      setStocks(response.data);
      setOptions(
        response.data.map((stock) => ({
          value: stock.stockName,
          label: (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "20px" }}>{stock.stockName}</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>NASDAQ</span>&nbsp;
                <span>{stock.stockCode}</span>
              </div>
            </div>
          ),
          stock,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (searchText) => {
    setSearchTerm(searchText);
  };

  const onSelect = (value, option) => {
    setSelectedStock(option.stock);
    onSelectStock(option.stock.stockCode, option.stock.stockName);
  };

  const handleSearch = () => {
    if (!selectedStock) {
      const foundStock = setSelectedStock(
        stocks.find((stock) => stock.stockName === searchTerm)
      );
      if (foundStock) {
        setSelectedStock(foundStock);
        onSelectStock(foundStock.stockCode, foundStock.stockName); // 선택된 주식 코드를 부모에 전달
      }
    }
  };

  const handleFavorite = async (stock) => {
    try {
      if (favoriteStocks.includes(stock.stockCode)) {
        // 관심종목에서 제거
        await axios.delete(
          `http://13.125.78.241:8081/overseas/favorite?customerId=${customerId}`,
          { data: stock }
        );
        setFavoriteStocks(
          favoriteStocks.filter((code) => code !== stock.stockCode)
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
    <Box sx={{ width: "100%" }}>
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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
            label="검색"
            {...a11yProps(0)}
            sx={{ color: "black", fontSize: "17px" }}
          />
          <Tab
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
            label="관심종목"
            {...a11yProps(1)}
            sx={{ color: "black", fontSize: "17px" }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel style={{ padding: "24px" }} value={value} index={0}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}>
          <AutoComplete
            options={options}
            size="large"
            style={{
              width: "60%",
              textAlign: "left",
            }}
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="종목명을 입력하세요"
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
          />
          <Button
            className="searchButton"
            style={{
              backgroundColor: "#e6e6e6",
              marginLeft: "10px",
              height: "40px",
            }}
            onClick={handleSearch}
            loading={loading}>
            <SearchIcon />
          </Button>
          {selectedStock && (
            <Button
              size="large"
              icon={
                favoriteStocks.includes(selectedStock.stockCode) ? (
                  <HeartFilled />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={() => handleFavorite(selectedStock)}
              style={{
                color: favoriteStocks.includes(selectedStock.stockCode)
                  ? "red"
                  : "gray",
                marginLeft: "10px",
                fontSize: "20px",
              }}
            />
          )}
        </div>
        {selectedStock && (
          <List
            size="medium"
            style={{
              width: "100%",
              marginTop: "20px",
              overflow: "auto",
            }}
            itemLayout="horizontal"
            dataSource={[selectedStock]}
            renderItem={(item) => {
              return (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginLeft: "5px",
                      marginRight: "5px",
                      fontSize: "20px",
                    }}>
                    <div style={{ display: "flex" }}>
                      <span>NASDAQ</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span>{item.stockCode}</span>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span>{item.industry}</span>
                    </div>
                  </div>
                  <AskingOverseasPrice stockCode={item.stockCode} />
                </div>
              );
            }}
          />
        )}
      </CustomTabPanel>

      <CustomTabPanel
        className="customtabpanel2"
        style={{
          backgroundColor: "#f6f7f8",
          height: "580px",
        }}
        value={value}
        index={1}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <div
            style={{
              flex: 1,
              textAlign: "right",
              color: "#999",
              fontWeight: "bold",
              paddingLeft: "80px",
            }}>
            종목명
          </div>
          <div
            style={{
              display: "flex",
              paddingLeft: "150px",
              alignItems: "center",
              height: "50px",
            }}>
            <span
              style={{ color: "#ccc", marginRight: "10px" }}
              className="material-symbols-outlined">
              expand_all
            </span>
            <div
              style={{
                height: "40px",
                width: "1px",
                backgroundColor: "#ddd",
              }}></div>{" "}
          </div>
          {/* 세로선 */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: "#999",
              fontWeight: "bold",
              paddingLeft: "50px",
            }}>
            현재가
          </div>{" "}
          <div
            style={{
              display: "flex",
              paddingLeft: "40px",
              alignItems: "center",
              height: "50px",
            }}>
            <span
              style={{ color: "#ccc", marginRight: "10px" }}
              className="material-symbols-outlined">
              expand_all
            </span>
            <div
              style={{
                height: "40px",
                width: "1px",
                backgroundColor: "#ddd",
              }}></div>{" "}
          </div>
          {/* 세로선 */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: "#999",
              fontWeight: "bold",
            }}>
            관심종목
          </div>
          <div
            style={{
              height: "40px",
              width: "1px",
              backgroundColor: "#ddd",
            }}></div>{" "}
        </div>
        <List
          size="medium"
          style={{
            width: "100%",
            maxHeight: "500px",
            overflow: "auto",
            borderRadius: "15px",
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
          }}
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item, index) => {
            const imageName = `${item.stockCode}` + ".png";
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
                    avatar={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "25px",
                        }}>
                        <Avatar size={60} src={imageUrl} />
                      </div>
                    }
                    title={
                      <h2
                        style={{ fontSize: "25px", paddingTop: "8px" }}
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
                      paddingRight: "60px",
                      color:
                        changePercentages[item.stockCode] < 0
                          ? "rgb(71 128 239)"
                          : "rgb(255 33 35)",
                    }}>
                    {closingPrices[item.stockCode] !== undefined
                      ? `${closingPrices[item.stockCode].toLocaleString(
                          "ko-KR"
                        )}`
                      : "현재가를 불러오는 중입니다."}
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
                      marginRight: "20px",
                    }}
                  />
                </Skeleton>
              </List.Item>
            );
          }}
        />
      </CustomTabPanel>
    </Box>
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

export default SearchStock;
