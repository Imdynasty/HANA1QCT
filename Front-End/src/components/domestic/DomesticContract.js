import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const sortIcon = `${process.env.PUBLIC_URL}/img/sort.png`;
const won = `${process.env.PUBLIC_URL}/img/won.png`; // 이미지 경로 추가 (assumed)

function ContractTabs() {
  const [tabValue, setTabValue] = useState(0);
  const [allData, setAllData] = useState([]); // 전체 데이터를 저장
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터를 저장
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState("전체");
  const [dateRange, setDateRange] = useState("1개월");
  const [account, setAccount] = useState("50112746-01");

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // 계좌 선택 시 핸들러 함수 추가
  const handleChangeAccount = (event) => {
    setAccount(event.target.value);
  };
  const handleChangeOrderType = (event) => {
    setOrderType(event.target.value);
  };

  const handleChangeDateRange = (event) => {
    setDateRange(event.target.value);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const url =
        tabValue === 0
          ? "http://13.125.78.241:8081/domestic/contracts"
          : "http://13.125.78.241:8081/domestic/contracts/cancel";

      const response = await axios.get(url); // 서버에서 전체 데이터를 한 번만 가져옴
      // 데이터 로딩에 딜레이를 추가하기 위해 setTimeout 사용
      setTimeout(() => {
        setAllData(response.data);
        setFilteredData(response.data); // 초기에는 전체 데이터를 필터링된 데이터로 설정
        setLoading(false); // 일정 시간 후 로딩 상태 해제
      }, 500); // 0.5초 딜레이 추가 (500 밀리초)
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...allData];

    // 주문 구분 필터링
    if (orderType !== "전체") {
      filtered = filtered.filter((item) =>
        item.sllBuyDvsnCdName.includes(orderType)
      );
    }

    // 기간 필터링
    const now = new Date();
    filtered = filtered.filter((item) => {
      const orderDate = new Date(
        item.ordDt +
          "T" +
          item.ordTmd.slice(0, 2) +
          ":" +
          item.ordTmd.slice(2, 4) +
          ":" +
          item.ordTmd.slice(4, 6)
      );
      switch (dateRange) {
        case "일주일":
          return now - orderDate <= 7 * 24 * 60 * 60 * 1000; // 7일 이내
        case "1개월":
          return now - orderDate <= 30 * 24 * 60 * 60 * 1000; // 30일 이내
        case "1년":
          return now - orderDate <= 365 * 24 * 60 * 60 * 1000; // 365일 이내
        default:
          return true;
      }
    });

    // **수정: 주문시간 기준으로 내림차순 정렬 추가**
    filtered.sort((a, b) => {
      const dateA = new Date(
        a.ordDt +
          "T" +
          a.ordTmd.slice(0, 2) +
          ":" +
          a.ordTmd.slice(2, 4) +
          ":" +
          a.ordTmd.slice(4, 6)
      );
      const dateB = new Date(
        b.ordDt +
          "T" +
          b.ordTmd.slice(0, 2) +
          ":" +
          b.ordTmd.slice(2, 4) +
          ":" +
          b.ordTmd.slice(4, 6)
      );
      return dateB - dateA; // 내림차순 정렬
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchData();
  }, [tabValue]); // 탭 변경 시마다 데이터 가져오기

  useEffect(() => {
    if (allData.length > 0) {
      filterData();
    }
  }, [orderType, dateRange, allData]);

  const formatDateTime = (date, time) => {
    const formattedDate = new Date(
      `${date}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}`
    );
    return formattedDate.toLocaleString();
  };

  const getRowStyle = (type) => {
    if (type.includes("매수"))
      return {
        color: "#9d0000",
        fontWeight: "bold",
        borderRight: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
      }; // 매수는 빨간색
    if (type.includes("매도"))
      return {
        color: "#00009d",
        fontWeight: "bold",
        borderRight: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
      }; // 매도는 파란색
    return {
      borderRight: "1px solid #ddd",
      borderBottom: "1px solid #ddd",
    };
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* 드롭다운 메뉴 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          ml: 3,
          mt: 3,
          mr: 3,
        }}>
        <FormControl
          variant="outlined"
          sx={{
            minWidth: 200, // 최소 너비
            backgroundColor: "#f5f5f5", // 배경색
            borderRadius: "10px", // 모서리를 둥글게
            border: "1px solid #ccc", // 테두리 색상과 두께
            "& .MuiOutlinedInput-root": {
              // 입력 부분 스타일
              "& fieldset": {
                borderColor: "#aaa", // 테두리 색상
              },
              "&:hover fieldset": {
                borderColor: "#333", // 마우스 호버 시 테두리 색상
              },
              "&.Mui-focused fieldset": {
                borderColor: "#000", // 포커스 시 테두리 색상
              },
            },
          }}>
          <InputLabel>계좌</InputLabel>
          <Select
            sx={{
              minWidth: 150,
              height: 50,
              borderRadius: "10px",
              fontSize: "22px",
            }}
            value={account} // 계좌 기본값 설정
            onChange={handleChangeAccount} // 계좌 변경 시 호출되는 핸들러
            label="계좌">
            <MenuItem value="50112746-01">50112746-01</MenuItem>
            <MenuItem value="50112746-02">50112746-02</MenuItem>
          </Select>
        </FormControl>
        <div>
          <FormControl
            variant="outlined"
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-root": {
                // 입력 부분 스타일
                "& fieldset": {
                  borderColor: "#aaa", // 테두리 색상
                },
                "&:hover fieldset": {
                  borderColor: "#333", // 마우스 호버 시 테두리 색상
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgb(2 183 207)",
                },
              },
            }}>
            <InputLabel>구분</InputLabel>
            <Select
              sx={{
                minWidth: 150,
                height: 50,
                borderRadius: "10px",
                fontSize: "22px",
              }}
              value={orderType}
              onChange={handleChangeOrderType}
              label="구분">
              <MenuItem value="전체">전체</MenuItem>
              <MenuItem value="매수">매수</MenuItem>
              <MenuItem value="매도">매도</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              minWidth: 150,
              ml: 3,
              "& .MuiOutlinedInput-root": {
                // 입력 부분 스타일
                "& fieldset": {
                  borderColor: "#aaa", // 테두리 색상
                },
                "&:hover fieldset": {
                  borderColor: "#333", // 마우스 호버 시 테두리 색상
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgb(2 183 207)",
                },
              },
            }}>
            <InputLabel>기간</InputLabel>
            <Select
              sx={{
                minWidth: 150,
                height: 50,
                borderRadius: "10px",
                fontSize: "22px",
              }}
              value={dateRange}
              onChange={handleChangeDateRange}
              label="기간">
              <MenuItem value="일주일">일주일</MenuItem>
              <MenuItem value="1개월">1개월</MenuItem>
              <MenuItem value="1년">1년</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          ml: 2,
          mr: 2,
          width: 180,
        }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          textColor="inherit"
          sx={{
            textColor: "rgb(2 183 207)",
            "& .MuiTabs-indicator": {
              backgroundColor: "rgb(2 183 207)",
            },
          }}>
          <Tab sx={{ fontSize: "20px", fontWeight: "600" }} label="체결" />
          <Tab sx={{ fontSize: "20px", fontWeight: "600" }} label="미체결" />
        </Tabs>
      </Box>
      <Box
        sx={{
          padding: 2,
          height: "60%",
          overflow: "auto",
          width: "100%",
          /* **수정: 스크롤바 숨기기 스타일 추가** */
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        }}>
        {loading ? (
          <table
            style={{
              width: "130%",
              height: "100%",
              borderCollapse: "separate",
              border: "1px solid #ddd",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "500",
              fontFamily: "Noto Sans KR",
              borderRadius: "10px",
            }}>
            <thead>
              <tr
                style={{
                  width: "100%",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#f5f5f5",
                }}>
                {Array.from({ length: 9 }).map((_, index) => (
                  <th
                    key={index}
                    style={{
                      padding: "8px",
                      borderRight: "1px solid #ddd",
                      textAlign: "center",
                    }}>
                    <Skeleton variant="text" width={90} height={30} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: "1px solid #ddd" }}>
                  {Array.from({ length: 9 }).map((_, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        textAlign: colIndex === 0 ? "left" : "right",
                        padding: "8px",
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                      }}>
                      <Skeleton variant="text" width={90} height={30} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table
            style={{
              width: "150%",
              borderCollapse: "separate",
              overflow: "auto",
              border: "1px solid #ddd",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "500",
              fontFamily: "Noto Sans KR",
              borderRadius: "10px", // 왼쪽 상단 모서리를 둥글게 설정
            }}>
            <thead>
              <tr
                style={{
                  width: "100%",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "100px",
                }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderRight: "1px solid #ddd",
                    width: "10%",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}>
                    <span>종목명</span>
                    <img
                      src={sortIcon}
                      alt="정렬"
                      style={{ width: "12px", verticalAlign: "middle" }}
                    />
                  </div>
                </th>
                <th
                  style={{
                    borderRight: "1px solid #ddd",
                    width: "5%",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}>
                    <span>구분</span>
                    <img
                      src={sortIcon}
                      alt="정렬"
                      style={{ width: "12px", verticalAlign: "middle" }}
                    />
                  </div>
                </th>
                <th style={{ borderRight: "1px solid #ddd", width: "7%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}>
                    <span>주문량</span>
                    <img
                      src={sortIcon}
                      alt="정렬"
                      style={{ width: "12px", verticalAlign: "middle" }}
                    />
                  </div>
                </th>
                <th style={{ borderRight: "1px solid #ddd", width: "7%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}>
                    <span>체결량</span>
                    <img
                      src={sortIcon}
                      alt="정렬"
                      style={{ width: "12px", verticalAlign: "middle" }}
                    />
                  </div>
                </th>
                <th style={{ borderRight: "1px solid #ddd", width: "10%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}>
                    <span>주문단가</span>
                    <img
                      src={sortIcon}
                      alt="정렬"
                      style={{ width: "12px", verticalAlign: "middle" }}
                    />
                  </div>
                </th>
                <th style={{ borderRight: "1px solid #ddd", width: "10%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}>
                    <span>체결평균</span>
                    <img
                      src={sortIcon}
                      alt="정렬"
                      style={{ width: "12px", verticalAlign: "middle" }}
                    />
                  </div>
                </th>
                <th style={{ borderRight: "1px solid #ddd", width: "10%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}>
                    <span>총체결금액</span>
                    <img
                      src={sortIcon}
                      alt="정렬"
                      style={{ width: "12px", verticalAlign: "middle" }}
                    />
                  </div>
                </th>

                <th style={{ borderRight: "1px solid #ddd", width: "8%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}>
                    <span>미체결량</span>
                    <img
                      src={sortIcon}
                      alt="정렬"
                      style={{ width: "12px", verticalAlign: "middle" }}
                    />
                  </div>
                </th>
                <th
                  style={{
                    textAlign: "right",
                    borderRight: "1px solid #ddd",
                    width: "300px",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}>
                    <span>주문시간</span>
                    <img
                      src={sortIcon}
                      alt="정렬"
                      style={{ width: "12px", verticalAlign: "middle" }}
                    />
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}>
                    <span>주문번호</span>
                    <img
                      src={sortIcon}
                      alt="정렬"
                      style={{ width: "12px", verticalAlign: "middle" }}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderRight: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                    }}>
                    {row.prdtName}
                  </td>
                  <td style={getRowStyle(row.sllBuyDvsnCdName)}>
                    {row.sllBuyDvsnCdName}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderRight: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                    }}>
                    {row.ordQty}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderRight: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                    }}>
                    {row.totCcldQty}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderRight: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                    }}>
                    {Number(row.ordUnpr).toLocaleString("ko-KR", {
                      //   style: "currency",
                      currency: "KRW",
                    })}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderRight: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                    }}>
                    {Number(row.avgPrvs).toLocaleString("ko-KR", {
                      //   style: "currency",
                      currency: "KRW",
                    })}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderRight: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                    }}>
                    {Number(row.totCcldAmt).toLocaleString("ko-KR", {
                      //   style: "currency",
                      currency: "KRW",
                    })}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderRight: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                    }}>
                    {row.ccldCndtName ? row.ccldCndtName : "0"}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderRight: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                    }}>
                    {formatDateTime(row.ordDt, row.ordTmd)}
                  </td>

                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                    }}>
                    {row.odno}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Box>
    </Box>
  );
}

export default ContractTabs;
