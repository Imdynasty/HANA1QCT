import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Skeleton, Modal, Tabs as AntTabs } from "antd"; // Imported Modal and AntTabs
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Image from "antd/lib/image";
import PropTypes from "prop-types";
import "../../css/RankList.css";
import axios from "axios";

const count = 3;

const korea = `${process.env.PUBLIC_URL}/img/taeguekki.png`;
const america = `${process.env.PUBLIC_URL}/img/america.png`;
const allIcon = `${process.env.PUBLIC_URL}/img/all.png`; // Icon for the third tab
const DataUrl = "http://13.125.78.241:8081/hana/domesticstock";
const OverseasDataUrl = "http://13.125.78.241:8081/hana/overseasstock";
const won = `${process.env.PUBLIC_URL}/img/moneyicon/won.png`;
const us = `${process.env.PUBLIC_URL}/img/moneyicon/us.png`;

const RankList = () => {
  const [value, setValue] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); // Current index for domestic stocks
  const [currentIndex2, setCurrentIndex2] = useState(0); // Current index for overseas stocks
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  const handleChange = (event, newValue) => {
    if (newValue === 2) {
      // If the third tab is clicked
      setIsModalVisible(true); // Show modal
      setValue(0); // Reset to the first tab
    } else {
      setValue(newValue); // Update tab normally
    }
  };

  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState(
    [...new Array(count)].map(() => ({
      loading: true,
      stockName: "",
      issuedShares: 0,
      industry: "",
    }))
  );

  const [overseasData, setOverseasData] = useState([]);
  const [overseasList, setOverseasList] = useState(
    [...new Array(count)].map(() => ({
      loading: true,
      stockName: "",
      issuedShares: 0,
      industry: "",
    }))
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(DataUrl);
        const overseasResponse = await axios.get(OverseasDataUrl);

        // Sort and add 'country' field to each item
        const sortedData = response.data
          .sort((a, b) => b.issuedShares - a.issuedShares)
          .map((item) => ({ ...item, country: "Korea" }));
        const sortedOverseasData = overseasResponse.data
          .sort((a, b) => b.issuedShares - a.issuedShares)
          .map((item) => ({ ...item, country: "Overseas" }));

        setData(sortedData);
        setOverseasData(sortedOverseasData);

        setList(sortedData.slice(0, count));
        setOverseasList(sortedOverseasData.slice(0, count));

        setInitLoading(false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const onLoadMore = () => {
    setLoading(true);
    const nextItems = data.slice(
      currentIndex + count,
      currentIndex + 2 * count
    );
    setList(list.concat(nextItems));
    setCurrentIndex(currentIndex + count);
    setLoading(false);
  };

  const onOverseasLoadMore = () => {
    setLoading(true);
    const nextItems = overseasData.slice(
      currentIndex2 + count,
      currentIndex2 + 2 * count
    );
    setOverseasList(overseasList.concat(nextItems));
    setCurrentIndex2(currentIndex2 + count);
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
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="inherit"
          sx={{
            textColor: "rgb(2 183 207)",
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
                  marginRight: "3px",
                  marginBottom: "3px",
                }}
                src={allIcon}
              />
            }
            label="전체"
            {...a11yProps(2)}
            sx={{ color: "black", fontSize: "17px" }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {/* First Tab Content */}
        <List
          size="medium"
          style={{
            width: "550px",
            maxHeight: "330px",
            overflowY: "auto",
            marginRight: "0px",
            marginLeft: "5px",
          }}
          className="demo-loadmore-list scrollable"
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
                        }}>
                        <span
                          style={{
                            marginRight: 20,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}>
                          {index + 1}
                        </span>
                        <Avatar size={65} src={imageUrl} />
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
        {/* Second Tab Content */}
        <List
          size="medium"
          style={{
            width: "550px",
            maxHeight: "330px",
            overflowY: "auto",
            marginRight: "0px",
            marginLeft: "5px",
          }}
          className="demo-loadmore-list scrollable"
          loading={loading}
          itemLayout="horizontal"
          loadMore={OverseasloadMore}
          dataSource={overseasList}
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
                        }}>
                        <span
                          style={{
                            marginRight: 20,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}>
                          {index + 1}
                        </span>
                        <Avatar size={65} src={imageUrl} />
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
                      fontSize: "24px",
                      paddingRight: "15px",
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <img
                      src={us}
                      style={{
                        width: "40px",
                        height: "40px",
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

      {/* Modal with Tabs */}
      <Modal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        footer={null}
        width={800}>
        <AntTabs
          defaultActiveKey="1"
          size="large"
          type="card"
          tabBarStyle={{ cursor: "pointer" }}>
          <AntTabs.TabPane tab="국내 주식" key="1">
            <List
              className="scrollable" // 여기에서 scr
              size="medium"
              style={{
                width: "750px",
                maxHeight: "1150px",
                overflowY: "auto",
              }}
              dataSource={data}
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
                            }}>
                            <span
                              style={{
                                marginRight: 20,
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}>
                              {index + 1}
                            </span>
                            <Avatar size={65} src={imageUrl} />
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
          </AntTabs.TabPane>
          <AntTabs.TabPane tab="해외 주식" key="2">
            <List
              className="scrollable" // 여기에서 scr
              size="medium"
              style={{
                width: "750px",
                maxHeight: "1150px",
                overflowY: "auto",
              }}
              dataSource={overseasData}
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
                            }}>
                            <span
                              style={{
                                marginRight: 20,
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}>
                              {index + 1}
                            </span>
                            <Avatar size={65} src={imageUrl} />
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
                          fontSize: "24px",
                          paddingRight: "15px",
                          display: "flex",
                          alignItems: "center",
                        }}>
                        <img
                          src={us}
                          style={{
                            width: "40px",
                            height: "40px",
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
          </AntTabs.TabPane>
        </AntTabs>
      </Modal>
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
