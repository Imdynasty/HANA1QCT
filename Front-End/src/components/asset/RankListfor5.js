import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Skeleton } from "antd";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Image from "antd/lib/image";
import PropTypes from "prop-types";
import "../../css/RankList.css";
import axios from "axios";

const count = 5; // 한 번에 보여줄 아이템 수를 5로 설정

const korea = `${process.env.PUBLIC_URL}/img/taeguekki.png`;
const america = `${process.env.PUBLIC_URL}/img/america.png`;
const DataUrl = "http://13.125.78.241:8081/hana/domesticstock";
const OverseasDataUrl = "http://13.125.78.241:8081/hana/overseasstock";
const won = `${process.env.PUBLIC_URL}/img/moneyicon/won.png`;
const us = `${process.env.PUBLIC_URL}/img/moneyicon/us.png`;

const RankList = () => {
  const [value, setValue] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 데이터 인덱스
  const [currentIndex2, setCurrentIndex2] = useState(0); // 현재 데이터 인덱스
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState(
    [...new Array(count)].map(() => ({
      loading: true,
      stockName: "", // 빈 문자열로 초기화
      issuedShares: 0, // 기본값으로 0 설정
      industry: "", // 추가 필드도 적절히 초기화
    }))
  );

  const [overseasData, setOverseasData] = useState([]);
  const [overseasList, setOverseasList] = useState(
    [...new Array(count)].map(() => ({
      loading: true,
      stockName: "", // 빈 문자열로 초기화
      issuedShares: 0, // 기본값으로 0 설정
      industry: "", // 추가 필드도 적절히 초기화
    }))
  );

  useEffect(() => {
    setLoading(true); // 로딩 상태 활성화
    const timer = setTimeout(async () => {
      // 타이머를 사용해 데이터 로딩을 지연
      try {
        const response = await axios.get(DataUrl);
        const overseasResponse = await axios.get(OverseasDataUrl);

        // 데이터를 issuedShares 기준으로 내림차순 정렬
        const sortedData = response.data.sort(
          (a, b) => b.issuedShares - a.issuedShares
        );
        const sortedOverseasData = overseasResponse.data.sort(
          (a, b) => b.issuedShares - a.issuedShares
        );

        setData(sortedData);
        setOverseasData(sortedOverseasData);

        setList(sortedData.slice(0, count)); // 처음에는 데이터의 첫 n개만 설정
        setOverseasList(sortedOverseasData.slice(0, count));
        setInitLoading(false);
        setLoading(false); // 데이터 로딩 완료
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // 에러 발생 시 로딩 상태 해제
      }
    }, 500); // 0.5초 후에 fetchData 함수 실행

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 취소
  }, []);

  const onLoadMore = () => {
    setLoading(true);
    const nextItems = data.slice(
      currentIndex + count,
      currentIndex + 2 * count
    ); // 다음 5개 데이터를 가져옵니다.
    setList(list.concat(nextItems)); // 기존 리스트에 추가
    setCurrentIndex(currentIndex + count); // 인덱스 업데이트
    setLoading(false);
  };
  const onOverseasLoadMore = () => {
    setLoading(true);
    const nextItems = overseasData.slice(
      currentIndex2 + count,
      currentIndex2 + 2 * count
    ); // 다음 5개 데이터를 가져옵니다.
    setOverseasList(overseasList.concat(nextItems)); // 기존 리스트에 추가
    setCurrentIndex2(currentIndex2 + count); // 인덱스 업데이트
    setLoading(false);
  };

  const loadMore =
    !initLoading && !loading && currentIndex < data.length ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}>
        <Button onClick={onLoadMore}>더 알아보기</Button>
      </div>
    ) : null;
  const OverseasloadMore =
    !initLoading && !loading && currentIndex2 < overseasData.length ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}>
        <Button onClick={onOverseasLoadMore}>더 알아보기</Button>
      </div>
    ) : null;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        boxShadow: "0 0 2px rgba(0, 0, 0, 0.2)",
        borderRadius: "25px",
        marginRight: "20px",
        marginTop: "20px",
        marginLeft: "10px",
      }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="inherit"
          sx={{
            textColor: "rgb(2 183 207)", // 텍스트 색상을 녹색으로 설정
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
              justifyContent: "space-between",
            }}
            icon={
              <Image
                preview={false}
                style={{
                  width: "35px",
                  marginRight: "5px",
                  marginBottom: "3px",
                }}
                src={korea}
              />
            }
            label="한국"
            {...a11yProps(0)}
            sx={{ color: "black", fontSize: "17px" }}
          />
          <Tab
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            icon={
              <Image
                preview={false}
                style={{
                  width: "30px",
                  marginRight: "5px",
                  marginBottom: "3px",
                }}
                src={america}
              />
            }
            label="미국"
            {...a11yProps(1)}
            sx={{ color: "black", fontSize: "17px" }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <List
          size="medium"
          style={{
            width: "100%",
            maxHeight: "320px",

            overflow: "auto",
          }}
          className="demo-loadmore-list"
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={(item, index) => {
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
              한국금융지주: "kis",
            };
            const imageName = stockNameToImageName[item.stockName] + ".png";
            const imageUrl = `${process.env.PUBLIC_URL}/img/KoreaLogo/${imageName}`;

            return (
              <List.Item style={{ marginTop: "10px" }} className="list-item">
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
                        }}>
                        <span
                          style={{
                            marginRight: 20,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}>
                          {index + 1}
                        </span>
                        <Avatar size={40} src={imageUrl} />
                      </div>
                    }
                    title={
                      <h2
                        style={{ fontSize: "19px", paddingTop: "8px" }}
                        href="https://ant.design">
                        {item.stockName}
                      </h2>
                    }
                    description={item.stockCode}
                  />
                  <div
                    style={{
                      fontSize: "24px",
                      paddingRight: "15px",
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <img
                      src={won}
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "5px",
                        marginBottom: "3px",
                      }}
                    />
                    {`${item.issuedShares}조`}
                    <span
                      style={{
                        color: "grey",
                        fontSize: "23px",
                        paddingBottom: "2px",
                      }}>
                      원
                    </span>
                  </div>
                </Skeleton>
              </List.Item>
            );
          }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <List
          size="medium"
          style={{
            width: "460px",
            maxHeight: "320px",
            overflow: "auto",
          }}
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          loadMore={OverseasloadMore}
          dataSource={overseasList}
          renderItem={(item, index) => {
            const imageName = `${item.stockCode}` + ".png";
            const imageUrl = `${process.env.PUBLIC_URL}/img/AmericaLogo/${imageName}`;
            return (
              <List.Item style={{ marginTop: "10px" }} className="list-item">
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
                        }}>
                        <span
                          style={{
                            marginRight: 20,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}>
                          {index + 1}
                        </span>
                        <Avatar size={40} src={imageUrl} />
                      </div>
                    }
                    title={
                      <h2
                        style={{ fontSize: "19px", paddingTop: "8px" }}
                        href="https://ant.design">
                        {item.stockName}
                      </h2>
                    }
                    description={item.stockCode}
                  />
                  <div
                    style={{
                      fontSize: "24px",
                      paddingRight: "15px",
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <img
                      src={us}
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "5px",
                      }}
                    />
                    {`${item.issuedShares}조`}
                    <span
                      style={{
                        color: "grey",
                        fontSize: "15px",
                        paddingTop: "5px",
                      }}>
                      USD
                    </span>
                  </div>
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

export default RankList;
