import React, { useRef, useState, useEffect } from "react";
import { Button, Divider, Space, Tour, Input } from "antd";
import Card from "@mui/material/Card";

import "../../css/MainInfo.css";
import axios from "axios";

const BeginTours = ({ refreshData, setRefreshData }) => {
  const [userInput, setUserInput] = useState(""); // 사용자 입력을 저장할 상태
  const [openTour, setOpenTour] = useState(false);
  const [isDomestic, setIsDomestic] = useState(true); // 국내 투어인지 해외 투어인지 구분하는 상태
  const [tourButtonStyle, setTourButtonStyle] = useState({}); // Tour 버튼 스타일 상태

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const handleRefresh = () => {
    setRefreshData(!refreshData); // 데이터 새로 고침 트리거
  };

  const handleSave = () => {
    const endpoint = isDomestic
      ? `http://13.125.78.241:8081/customers/1qct/update?newMarketCapitalization=${userInput}`
      : `http://13.125.78.241:8081/customers/1qct/overseasupdate?newMarketCapitalization=${userInput}`;

    axios
      .post(endpoint)
      .then((response) => {
        console.log(
          `${isDomestic ? "Domestic" : "Overseas"} data uploaded successfully`
        );
        handleRefresh(); // 데이터 업로드 성공 후 새로 고침 트리거
        setUserInput(""); // 입력값 초기화
      })
      .catch((error) => {
        alert(`Failed to upload ${isDomestic ? "domestic" : "overseas"} data`);
      });
  };

  useEffect(() => {
    // Tour가 열릴 때마다 버튼 스타일 업데이트
    setTourButtonStyle({
      backgroundColor: isDomestic ? "#ed6c02" : "#0088d1", // 상태에 따라 색상 변경
    });
  }, [isDomestic, openTour]);

  const steps = [
    {
      title: `${isDomestic ? "국내" : "해외"} 기준 시총 변경`,
      description: (
        <>
          <Input
            style={{ marginTop: "10px", marginBottom: "10px" }}
            placeholder={`${
              isDomestic ? "국내" : "해외"
            } 기준 시총을 입력하세요.`}
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            className={isDomestic ? "" : "overseas"} // 상태에 따라 클래스 적용
          />
        </>
      ),
      target: () => ref1.current,
    },
    {
      title: "확인",
      description: "잘못 입력하셨다면 이전을 눌러주세요.",
      target: () => ref2.current,
    },
    {
      title: "저장",
      description: `변경된 ${
        isDomestic ? "국내" : "해외"
      } 기준 시총이 저장됩니다.`,
      target: () => ref3.current,
    },
  ];

  return (
    <Card
      style={{
        margin: 20,
        width: "95%",
        height: "180px",
        borderRadius: "25px",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
        }}>
        <Button
          className="rule-button"
          style={{
            display: "flex",
            marginLeft: "20px",
            backgroundColor: "rgb(235 250 252)",
            color: "black",
            fontSize: "25px",
            fontWeight: "500",
            padding: "20px",
            marginTop: "20px",
            border: "1px solid rgb(2 183 207)",
          }}
          onClick={() => {
            setIsDomestic(true);
            setOpenTour(true);
          }}>
          국내 기준 시총 변경
        </Button>
        <Button
          className="rule-button"
          style={{
            display: "flex",
            backgroundColor: "rgb(235 250 252)",
            color: "black",
            fontSize: "25px",
            fontWeight: "500",
            padding: "20px",
            marginTop: "20px",
            border: "1px solid rgb(2 183 207)",
            marginRight: "20px",
          }}
          onClick={() => {
            setIsDomestic(false);
            setOpenTour(true);
          }}>
          해외 기준 시총 변경
        </Button>
      </div>
      <Divider />
      <Space
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginTop: "35px",
        }}>
        <Button
          className="imbutton"
          style={{
            fontSize: "25px",
            width: "140px",
            marginBottom: "10px",
          }}
          ref={ref1}>
          변경
        </Button>
        <Button
          className="imbutton"
          style={{ fontSize: "25px", width: "140px", marginBottom: "10px" }}
          ref={ref2}>
          확인
        </Button>
        <Button
          className={`imbutton ${isDomestic ? "" : "overseas"}`}
          style={{ fontSize: "25px", width: "140px", marginRight: "10px" }}
          ref={ref3}
          onClick={handleSave}>
          저장
        </Button>
      </Space>
      <Tour
        open={openTour}
        onClose={() => setOpenTour(false)}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
        onFinish={() => {
          handleSave();
          setOpenTour(false);
        }}
        nextButtonProps={{
          style: tourButtonStyle, // 상태에 따라 색상 변경
        }}
      />
    </Card>
  );
};

export default BeginTours;
