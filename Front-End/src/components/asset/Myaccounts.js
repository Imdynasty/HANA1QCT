import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AccountsCard from "./AccountsCard";
import MydataCard from "./MydataCard";
import MydatainfoCard from "./MydatainfoCard";
import HanaAccountsCard from "./HanaAccountsCard";
import "../../css/MyAccounts.css";
import axios from "axios";

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

const MyAccounts = () => {
  const [value, setValue] = React.useState(0);
  const [showDefault, setShowDefault] = useState(true); // 추가된 상태
  const [accountData, setAccountData] = useState([]);

  const toggleComponents = () => {
    // API 호출 전에 기존 컴포넌트 상태 변경 또는 기타 필요한 로직을 추가
    setShowDefault(!showDefault);

    // 서버에서 데이터 가져오기
    axios
      .get(
        "http://13.125.78.241:8081/api/openbanking/sendAccounts?ci=4dff4ea340f0a823f15d3f4f01ab62eae0e5da579ccb851f8db9dfe84c58b2b37b89903a740e1ee172da793a6e79d560e5f7f9bd058a12a280433ed6fa46510a"
      )
      .then((response) => {
        // localStorage에 데이터 저장
        console.log("Data fetched and stored in localStorage");
        localStorage.setItem("MyAccounts", JSON.stringify(response.data));

        // 필요한 경우 여기에서 추가 상태 업데이트 또는 후속 처리
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="inherit"
          sx={{
            textColor: "green", // 텍스트 색상을 녹색으로 설정
            "& .MuiTabs-indicator": {
              backgroundColor: "green",
            },
          }}
          style={{ marginLeft: "10px", paddingTop: "20px" }}>
          <Tab
            label="하나증권"
            {...a11yProps(0)}
            sx={{ color: "black", fontSize: "20px" }}
          />
          <Tab
            label="오픈뱅킹"
            {...a11yProps(1)}
            sx={{ color: "black", fontSize: "20px" }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <HanaAccountsCard accountId="종합위탁" />
        <HanaAccountsCard accountId="CMA" />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div style={{ display: "flex" }}>
          {showDefault ? (
            <>
              <MydataCard />
              <MydatainfoCard onClose={toggleComponents} />
            </>
          ) : (
            <AccountsCard />
          )}
        </div>

        {/* 버튼 추가 */}
      </CustomTabPanel>
    </Box>
  );
};

export default MyAccounts;
