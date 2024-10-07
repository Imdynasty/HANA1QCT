import React, { useState, useEffect } from "react";
import "../../css/DomesticOrder.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import AnimatedNumber from "../AnimatedNumber3";
import OverseasBalanceList from "./OverseasBalanceListInOrder.js";
import CircularProgress from "@mui/material/CircularProgress";
import { AutoComplete, Select } from "antd"; // antd에서 AutoComplete, Select 불러오기

const { Option } = Select;

function OverseasOrder({ selectedStock }) {
  const [account, setAccount] = useState("50112746-01 오승민");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState("");
  const [orderType, setOrderType] = useState("지정가");
  const [activeTab, setActiveTab] = useState(0);
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [popoverMessage, setPopoverMessage] = useState("");
  const [popoverMaxAnchorEl, setPopoverMaxAnchorEl] = useState(null);
  const [popoverMaxMessage, setpopoverMaxMessage] = useState("");
  const [orderPopoverAnchorEl, setOrderPopoverAnchorEl] = useState(null);
  const [shuffledNumbers, setShuffledNumbers] = useState([]);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(1); // 기본 환율을 1로 설정
  const [marginPercentage, setMarginPercentage] = useState(100);
  // 환율을 가져오는 함수
  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(
        "http://13.125.78.241:8081/securities/exchangerates"
      );
      const rates = response.data;
      const latest = rates[rates.length - 1]; // 최신 환율 정보 가져오기
      setExchangeRate(latest.tradingStandardRate);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  // 컴포넌트가 마운트될 때 환율을 가져옴
  useEffect(() => {
    fetchExchangeRate();
    shuffleNumbers();
  }, []);

  // 주문 성공 후 단가와 수량 초기화 함수 추가
  const resetOrderForm = () => {
    setPrice("");
    setQuantity(0);
  };

  // 잔고조회 버튼 클릭 이벤트 핸들러 추가
  const handleBalanceModalOpen = () => {
    setIsBalanceModalOpen(true);
    setIsLoading(true); // 모달이 열릴 때 로딩 상태로 설정
  };

  // 모달이 열릴 때 데이터를 로드하는 효과 추가
  useEffect(() => {
    if (isBalanceModalOpen) {
      const fetchData = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 예시: 2초 대기
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading data:", error);
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isBalanceModalOpen]);

  const handleBalanceModalClose = () => {
    setIsBalanceModalOpen(false);
  };

  // 숫자를 무작위로 섞는 함수 추가
  const shuffleNumbers = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setShuffledNumbers(numbers);
  };

  // Numeric password handling
  const handleNumericButtonClick = (value) => {
    setPassword((prevPassword) => prevPassword + value);
  };

  const handlePasswordReset = () => {
    setPassword("");
  };

  // Handle changes in quantity
  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(0, prevQuantity + change));
  };

  const handlePriceChange = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, ""); // 숫자와 소수점만 허용
    const formattedValue = numericValue
      ? parseFloat(numericValue).toFixed(4)
      : "0.0000"; // 소수점 4자리로 제한
    setPrice(formattedValue);
  };

  const incrementPrice = () => {
    const currentPrice = parseFloat(price.replace(/,/g, ""));
    const newPrice =
      isNaN(currentPrice) || currentPrice === 0 ? 1.0 : currentPrice + 1.0;
    setPrice(newPrice.toFixed(4).toString());
  };

  const decrementPrice = () => {
    const currentPrice = parseFloat(price.replace(/,/g, ""));
    const newPrice =
      isNaN(currentPrice) || currentPrice <= 1.0 ? 0.0 : currentPrice - 1.0;
    setPrice(newPrice.toFixed(4).toString());
  };

  // 모달이 열릴 때 숫자를 섞도록 handleOrder 함수 수정
  const handleOrder = () => {
    setOrderPopoverAnchorEl(null); // 기존 Popover 닫기
    setIsModalOpen(true); // 비밀번호 입력 모달 열기
    shuffleNumbers(); // Shuffle numbers each time the modal is opened
  };

  const verifyPassword = (event) => {
    setPopoverAnchorEl(event.currentTarget); // Popover의 앵커를 설정
    axios
      .get("http://13.125.78.241:8081/customers/1qct")
      .then((response) => {
        if (response.data.customerPassword === password) {
          // 비밀번호가 일치하면 Popover 닫기
          setPopoverAnchorEl(null);
          // 주문 진행
          const numericPrice = parseFloat(price.replace(/,/g, "")); // 쉼표 제거 후 숫자로 변환
          const orderData = {
            ord_dv: activeTab === 0 ? "buy" : "sell", // 0: 구매하기, 1: 판매하기
            itm_no: selectedStock.stockCode,
            qty: quantity,
            unpr: numericPrice,
          };

          fetch("http://54.180.14.45:5000/overseas/order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          })
            .then((response) => response.json())
            .then((data) => {
              setIsModalOpen(false); // 모달 닫기
              setPassword(""); // 비밀번호 필드 초기화
              if (data.status === "success") {
                setPopoverMessage("주문이 성공적으로 접수되었습니다.");
                resetOrderForm(); // 주문 성공 후 단가와 수량 초기화
              } else {
                setPopoverMessage("주문에 실패했습니다. 다시 시도해 주세요.");
              }
              setOrderPopoverAnchorEl(document.querySelector(".order-button")); // 주문 완료 Popover를 "구매하기" 버튼 아래에 띄움
            })
            .catch((error) => {
              console.error("Error:", error);
              setPopoverMessage("주문 처리 중 오류가 발생했습니다.");
              setIsModalOpen(false); // 모달 닫기
              setPassword(""); // 비밀번호 필드 초기화
              setOrderPopoverAnchorEl(document.querySelector(".order-button")); // 주문 실패 Popover를 "구매하기" 버튼 아래에 띄움
            });
        } else {
          setPopoverMessage("비밀번호가 일치하지 않습니다.");
          setPassword(""); // 비밀번호 필드 초기화
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setPopoverMessage("비밀번호 확인 중 오류가 발생했습니다.");
        setPassword(""); // 비밀번호 필드 초기화
      });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setOrderPopoverAnchorEl(null);
  };

  const handleMaxOrder = async (event) => {
    if (!price || parseFloat(price.replace(/,/g, "")) === 0) {
      setpopoverMaxMessage("단가를 입력해 주세요.");
      setPopoverMaxAnchorEl(event.currentTarget); // Popover를 "최대주문" 버튼 위에 표시
      return;
    }

    try {
      const response = await axios.get(
        `http://13.125.78.241:8081/balances/overseas/summary/종합위탁`
      );
      const totAsstAmtKRW = response.data.totAsstAmt;

      // 환율 적용하여 KRW를 USD로 변환
      const totAsstAmtUSD = totAsstAmtKRW / exchangeRate;

      const numericPrice = parseFloat(price.replace(/,/g, ""));
      const maxQuantity = Math.floor(totAsstAmtUSD / numericPrice);

      setQuantity(maxQuantity); // 최대 가능한 수량을 자동으로 입력
    } catch (error) {
      console.error("Error fetching balance summary:", error);
      setpopoverMaxMessage("잔고 정보를 가져오는 중 오류가 발생했습니다.");
      setPopoverMaxAnchorEl(event.currentTarget); // Popover를 "최대주문" 버튼 위에 표시
    }
  };

  const handleMaxPopoverClose = () => {
    setPopoverMaxAnchorEl(null);
  };

  const openmaxPopover = Boolean(popoverMaxAnchorEl);
  const popovermaxId = openmaxPopover ? "max-order-popover" : undefined;

  const openPopover = Boolean(popoverAnchorEl);
  const orderPopoverOpen = Boolean(orderPopoverAnchorEl);
  const popoverId = openPopover ? "simple-popover" : undefined;
  const orderPopoverId = orderPopoverOpen ? "order-popover" : undefined;

  const totalOrderAmountUSD =
    quantity * parseFloat(price.replace(/,/g, "") || 0);
  const totalOrderAmountKRW = totalOrderAmountUSD * exchangeRate;

  return (
    <div className="order-form">
      {/* 비밀번호 검증 Popover */}
      <Popover
        id={popoverId}
        open={openPopover}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{ marginTop: 2 }} // 여기서 margin을 조정
      >
        <Typography sx={{ p: 2 }}>{popoverMessage}</Typography>
      </Popover>
      {/* 주문 완료/실패 Popover */}
      <div>
        <Popover
          id={orderPopoverId}
          open={orderPopoverOpen}
          anchorEl={orderPopoverAnchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{ marginTop: 2 }} // 여기서 margin을 조정
        >
          <Typography sx={{ p: 2 }}>{popoverMessage}</Typography>
        </Popover>
        {/* Popover 컴포넌트 추가 */}
        <Popover
          id={popovermaxId}
          open={openmaxPopover}
          anchorEl={popoverMaxAnchorEl}
          onClose={handleMaxPopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          sx={{ marginTop: 2 }} // 여기서 margin을 조정
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}>
          <Typography sx={{ p: 2 }}>{popoverMaxMessage}</Typography>
        </Popover>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          textColor="inherit"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "rgb(2 183 207)",
            },
          }}
          style={{ marginLeft: "10px" }}>
          <Tab sx={{ color: "black", fontSize: "17px" }} label="구매하기" />
          <Tab sx={{ color: "black", fontSize: "17px" }} label="판매하기" />
        </Tabs>
      </Box>
      {activeTab < 2 && (
        <div className="orderbuysell">
          <div className="infoorder">
            <div className="account-select">
              <Select
                value={account}
                onChange={(value) => setAccount(value)}
                style={{ width: "60%", textAlign: "left" }}
                size="large">
                <Option value="50112746-01 오승민">50112746-01 오승민</Option>
                <Option value="50112746-02 오승민">50112746-02 오승민</Option>
              </Select>

              <div>
                <div
                  style={{
                    border: "1px solid #ccc",
                    width: "120px",
                    borderRadius: "10px",
                    backgroundColor: "#f2f4f7",
                    cursor: "pointer",
                  }}
                  onClick={handleMaxOrder} // 최대주문 핸들러 연결
                >
                  최대주문
                </div>
              </div>
              <div
                style={{
                  border: "1px solid #ccc",
                  width: "120px",
                  borderRadius: "10px",
                  backgroundColor: "#f2f4f7",
                  cursor: "pointer",
                  ":hover": {
                    backgroundColor: "#e1e4e8",
                  },
                }}
                onClick={handleBalanceModalOpen} // 모달 열기
              >
                잔고조회
              </div>
            </div>
            <div className="stock-search">
              <Select
                value={selectedStock.stockName}
                style={{ width: "60%", textAlign: "left" }}
                options={[]}
                disabled
                size="large"
              />
              <div
                style={{
                  border: "1px solid #ccc",
                  width: "20%",
                  borderRadius: "10px",
                  backgroundColor: "rgb(235 250 252)",
                }}>
                종목코드
              </div>
              <span style={{ fontSize: "25px" }}>
                {selectedStock.stockCode}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}>
              <span style={{ fontSize: "20px", fontWeight: "600" }}>
                {" "}
                유형{" "}
              </span>

              <div className="order-type">
                <Select
                  size="large"
                  value={orderType}
                  onChange={(value) => setOrderType(value)}
                  style={{ width: "77%", textAlign: "left" }}>
                  <Option value="지정가">지정가</Option>
                  <Option value="시장가">시장가</Option>
                </Select>

                <div
                  style={{
                    border: "1px solid pink",
                    borderRadius: "10px",
                    width: "70px",
                    textAlign: "center",
                    backgroundColor: "pink",
                    fontWeight: "bold",
                    fontSize: "15px",
                    height: "28px",
                    paddingTop: "3px",
                    color: "#cb132a",
                    marginTop: "5px",
                  }}>
                  외화주식
                </div>
              </div>
            </div>
            <div className="quantity-price">
              <div
                className="quantity"
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <span style={{ paddingTop: "5px" }}>수량</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "50%",
                  }}>
                  <AutoComplete
                    size="large"
                    value={quantity}
                    onChange={(value) => setQuantity(parseInt(value) || 0)}
                    placeholder="0"
                    style={{
                      textAlign: "right",
                      border: "1px solid #ccc",
                      width: "100%",
                      backgroundColor: "#f7f7f7", // 배경색 설정
                      borderRadius: "7px",
                    }}
                    options={[]} // 자동 완성 옵션
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "90px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}>
                    주
                  </span>
                  <div style={{ marginLeft: "10px" }}>
                    <IconButton
                      onClick={() => handleQuantityChange(-1)}
                      size="small">
                      <RemoveIcon />
                    </IconButton>
                  </div>
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    size="small">
                    <AddIcon />
                  </IconButton>
                </div>
              </div>

              <div
                className="price"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                  justifyContent: "space-between",
                }}>
                <span>단가</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "50%",
                  }}>
                  <AutoComplete
                    size="large"
                    value={price}
                    onChange={handlePriceChange}
                    placeholder="0.00"
                    variant="filled"
                    style={{
                      textAlign: "left",
                      border: "1px solid #ccc",
                      width: "100%",
                      height: "100%",
                      borderRadius: "7px",
                      backgroundColor: activeTab === 0 ? "#fff0f1" : "#ebfafc", // 구매와 판매에 따른 색상 설정
                    }}
                    options={[]} // 자동 완성 옵션
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "90px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}>
                    USD
                  </span>
                  <div style={{ marginLeft: "10px" }}>
                    <IconButton
                      onClick={decrementPrice} // 감소 함수 연결
                      size="small">
                      <RemoveIcon />
                    </IconButton>
                  </div>
                  <IconButton
                    onClick={incrementPrice} // 증가 함수 연결
                    size="small">
                    <AddIcon />
                  </IconButton>
                </div>
              </div>
            </div>

            <div style={{ alignItems: "center" }} className="total-price">
              <span style={{}}>총 주문금액</span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "400",
                    marginRight: "20px",
                    marginBottom: "0",
                  }}>
                  {totalOrderAmountKRW.toLocaleString()}
                  <strong style={{ marginRight: "20px" }}> KRW</strong>
                  <span>≈</span>
                </div>
                <span style={{ fontSize: "28px", fontWeight: "650" }}>
                  <AnimatedNumber
                    value={totalOrderAmountUSD.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  />{" "}
                  USD
                </span>
              </div>
            </div>
            {activeTab === 0 && (
              <div style={{ marginBottom: "20px" }} className="total-price">
                <label>증거금</label>
                <Select
                  value={marginPercentage}
                  onChange={(value) => setMarginPercentage(value)}
                  style={{ width: "100px", marginLeft: "10px" }}
                  size="large">
                  <Option value={100}>100%</Option>
                  <Option value={70} disabled>
                    70%
                  </Option>
                  <Option value={50} disabled>
                    50%
                  </Option>
                  <Option value={30} disabled>
                    30%
                  </Option>
                </Select>
              </div>
            )}
          </div>
          <Button
            className="order-button"
            onClick={handleOrder}
            fullWidth
            style={{
              backgroundColor: activeTab === 0 ? "rgb(239 71 71)" : "#4780ef",
              color: "white",
              //   marginTop: "20px",
              height: "50px",
              fontSize: "30px",
              fontWeight: "700",
              borderRadius: "10px",
            }}>
            {activeTab === 0 ? "구매하기" : "판매하기"}
          </Button>
          <div
            style={{
              width: "100%",
              backgroundColor: "rgb(242, 244, 247)",
              borderRadius: "10px",
              marginTop: "25px",
              height: "40px",
              border: "1px solid #ccc",
              display: "flex",
            }}>
            <div
              style={{
                display: "flex",
                fontSize: "20px",
                alignItems: "center",
                marginLeft: "10px",
              }}>
              <span className="material-symbols-outlined">error</span>
              <span style={{ marginLeft: "10px" }}>
                {" "}
                비밀번호는 필수입력입니다.
              </span>
            </div>
          </div>
        </div>
      )}
      {/* 비밀번호 입력 모달 */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="password-modal-title"
        aria-describedby="password-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,

            bgcolor: "background.paper",
            // border: "2px solid #000",
            boxShadow: 24,
            borderRadius: "20px",
            p: 4,
            textAlign: "center",
          }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{ marginRight: "10px" }}
              className="material-symbols-outlined">
              lock
            </span>
            <div style={{ fontSize: "25px", fontWeight: "bold" }}>
              비밀번호 입력
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              marginTop: "20px",
            }}>
            {shuffledNumbers.map((number) => (
              <Button
                sx={{ height: "60px", fontSize: "20px", fontWeight: "600" }}
                key={number}
                variant="outlined"
                onClick={() => handleNumericButtonClick(number.toString())}>
                {number}
              </Button>
            ))}
            <Button
              variant="contained"
              color="inherit"
              sx={{ fontWeight: "bold", fontSize: "20px" }}
              onClick={handlePasswordReset}>
              지우기
            </Button>
          </div>
          <TextField
            id="password-input"
            label="비밀번호"
            type="password"
            fullWidth
            value={password}
            disabled
            sx={{ mt: 2 }}
          />
          <Button
            onClick={verifyPassword}
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "rgb(235 250 252)",
              border: "1px solid rgb(2 183 207)",
              color: "black",
              fontSize: "20px",
              fontWeight: "600",
              ":hover": {
                backgroundColor: "rgb(2 183 207)",
                color: "white",
              },
            }}>
            확인
          </Button>
        </Box>
      </Modal>
      <Modal
        open={isBalanceModalOpen}
        onClose={handleBalanceModalClose}
        aria-labelledby="balance-modal-title"
        aria-describedby="balance-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 950,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "10px",
            p: 4,
            textAlign: "center", // 로딩 스피너 가운데 정렬
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "15px",
            }}>
            <h2 id="balance-modal-title">잔고 조회</h2>
            <span
              style={{
                marginLeft: "5px",
                fontSize: "40px",
                marginBottom: "5px",
              }}
              className="material-symbols-outlined">
              {" "}
              chevron_right
            </span>
          </div>
          {isLoading ? (
            <div
              style={{
                width: 870,
                height: 501,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingRight: "30px",
                marginLeft: "20px",
              }}>
              <CircularProgress color="inherit" size={80} />
            </div>
          ) : (
            <OverseasBalanceList accountId="종합위탁" /> // 로딩 완료 시 데이터 표시
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default OverseasOrder;
