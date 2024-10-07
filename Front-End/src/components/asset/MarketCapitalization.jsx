import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Checkbox, FormControlLabel } from "@mui/material";
import ImageButton from "./ImageButton";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import { Skeleton } from "@mui/material";
import RankList5 from "./RankListfor5";
import Modal from "react-modal";
import Swal from "sweetalert2"; // sweetalert2 import

import "../../css/MainInfo.css";
import { border } from "@chakra-ui/react";

const won = `${process.env.PUBLIC_URL}/img/moneyicon/won.png`;
const dollar = `${process.env.PUBLIC_URL}/img/moneyicon/dollarusd.png`;
function CustomerCard({ customer }) {
  return (
    <Card style={{ margin: 20, width: "95%", borderRadius: "25px" }}>
      <CardContent>
        <div
          style={{
            width: "98%",
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: "5px",
          }}>
          <Typography variant="h6" component="h2">
            {customer.name}님의 국내투자 시가총액
          </Typography>
          <Badge sx={{ fontSize: "20px" }} color="warning" badgeContent={"원"}>
            <div>총액 단위</div>
          </Badge>
        </div>

        <div style={{ display: "flex", alignContent: "center" }}>
          <Box
            style={{
              boxShadow: "0 0 2px rgba(0, 0, 0, 0.2)",
              borderRadius: "10%",
              marginTop: "10px",
              border: "1px solid #e6e6e6",
            }}>
            <Typography
              style={{
                marginLeft: "5px",
                fontWeight: "550",
                padding: "5px",
                paddingRight: "10px",
                fontSize: "27px",
                display: "flex",
                alignItems: "center",
              }}
              variant="h5"
              component="h2">
              <img
                src={won}
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "5px",
                  marginBottom: "3px",
                }}
              />
              {customer.marketCapitalization.toLocaleString("ko-KR")}
              <span style={{ paddingLeft: "5px" }}>조</span>
            </Typography>
          </Box>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerOverseasCard({ customer }) {
  return (
    <Card style={{ marginLeft: 20, width: "95%", borderRadius: "25px" }}>
      <CardContent>
        <div
          style={{
            width: "98%",
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: "5px",
          }}>
          <Typography variant="h6" component="h2">
            {customer.name}님의 해외투자 시가총액
          </Typography>
          <Badge sx={{ fontSize: "20px" }} color="info" badgeContent={"USD"}>
            <div>총액 단위</div>
          </Badge>
        </div>

        <div style={{ display: "flex", alignContent: "center" }}>
          <Box
            style={{
              borderRadius: "10%",
              marginTop: "10px",
              border: "1px solid #e6e6e6",
            }}>
            <Typography
              style={{
                marginLeft: "5px",
                fontWeight: "550",
                padding: "5px",
                paddingRight: "10px",
                fontSize: "27px",
                display: "flex",
                alignItems: "center",
              }}
              variant="h5"
              component="h2">
              <img
                src={dollar}
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "5px",
                  marginBottom: "3px",
                  marginTop: "5px",
                }}
              />
              {customer.marketCapitalizationOverseas.toLocaleString("ko-KR")}
              <span style={{ paddingLeft: "5px" }}>조</span>
            </Typography>
          </Box>
        </div>
      </CardContent>
    </Card>
  );
}

function MarketCapitalization() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false,
    panel5: false,
  });
  const [isChecked, setIsChecked] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    const newExpandedPanels = { ...expandedPanels, [panel]: isExpanded };
    setExpandedPanels(newExpandedPanels);

    // 모든 아코디언이 열렸는지 확인
    const allExpanded = Object.values(newExpandedPanels).every(Boolean);
    if (allExpanded) {
      setIsChecked(false); // 아코디언이 모두 열렸을 때 체크박스를 초기화할 수 있습니다.
    }
  };
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = async () => {
    try {
      // 각 API로부터 데이터 가져오기
      const [
        contractsResponse,
        balancesResponse,
        balanceSummaryResponse,
        overseasbalancesResponse,
        overseasSummaryResponse,
        overseascontractsResponse,
      ] = await Promise.all([
        axios.get("http://13.125.78.241:8081/domestic/contracts"),
        axios.get(`http://13.125.78.241:8081/balances/domestic/종합위탁`),
        axios.get(
          `http://13.125.78.241:8081/balances/domestic/summary/종합위탁`
        ),
        axios.get(`http://13.125.78.241:8081/balances/overseas`),
        axios.get(
          `http://13.125.78.241:8081/balances/overseas/summary/종합위탁`
        ),
        axios.get("http://13.125.78.241:8081/overseas/contracts"),
      ]);

      // API 응답에서 데이터 추출
      const contracts = contractsResponse.data;
      const balances = balancesResponse.data;
      const balanceSummary = balanceSummaryResponse.data;
      const overseasBalances = overseasbalancesResponse.data;
      const overseasSummary = overseasSummaryResponse.data;
      const overseasContracts = overseascontractsResponse.data;
      const today = new Date();
      const month = today.getMonth(); // 월은 0부터 시작하므로 1을 더해줌

      // 동적으로 월을 추가하여 이메일 제목 구성
      const subject = `${month}월 오승민님 1QCT 투자리포트입니다.`;
      // 네이버 메일 API에 요청
      const response = await axios.post(
        "http://13.125.78.241:8081/send-email",
        {
          to: "osm05230@naver.com", // 받는 사람 이메일 주소
          subject: subject, // 이메일 제목
          variables: {
            contracts: contracts,
            balances: balances,
            balanceSummary: balanceSummary,
            overseasContracts: overseasContracts,
            overseasBalances: overseasBalances,
            overseasSummary: overseasSummary,
          },
        }
      );

      Swal.fire({
        title: "구독 완료!",
        html: "매월 마지막날 메일이 전송되며,<br>확인차 이번달 현재날짜까지의 리포트를 전송해드립니다.",
        icon: "success",
        confirmButtonText: "확인",
        confirmButtonColor: "#ebfafc",
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error sending API request:", error);
      Swal.fire({
        title: "실패!",
        text: "투자 리포트 전송에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  useEffect(() => {
    setLoading(true); // 로딩 상태 활성화
    const timer = setTimeout(() => {
      // 데이터 로딩을 지연시키기 위해 setTimeout 사용
      axios
        .get("http://13.125.78.241:8081/customers/1qct")
        .then((response) => {
          setCustomers(
            Array.isArray(response.data) ? response.data : [response.data]
          );
          setLoading(false); // 데이터 로딩 완료
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError("Failed to load data."); // 에러 메시지 설정
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 취소
  }, [refreshData]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flexDirection: "column-reverse" }}>
        {loading ? (
          Array.from(new Array(1)).map((_, index) => (
            <SkeletonCustomerCard key={index} />
          ))
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          customers.map((customer) => (
            <>
              <CustomerOverseasCard
                key={customer.customerId}
                customer={customer}
              />
              <CustomerCard key={customer.customerId} customer={customer} />
            </>
          ))
        )}
        <ImageButton
          refreshData={refreshData}
          setRefreshData={setRefreshData}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "46.5%",
          height: "70%",
        }}>
        <RankList5 />
        <div
          className="ivestment-report"
          style={{
            marginTop: "20px",
            border: "1px solid #e6e6e6",
            borderRadius: "25px",
            marginLeft: "10px",
            width: "100%",
            height: "90px",
            cursor: "pointer",
          }}
          onClick={handleClick}>
          {" "}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              boxShadow: "0",
              borderRadius: "25px",
              padding: "20px",
              border: "0",
            }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "3px",
                  height: "100%",
                  backgroundColor: "green",
                  marginRight: "10px",
                }}></div>
              <div style={{ textAlign: "left", boxShadow: "0", border: "0" }}>
                <div
                  style={{ fontSize: "20px", fontWeight: "bold", border: "0" }}>
                  투자 리포트 받기
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "grey",
                    boxShadow: "0",
                    border: "0",
                  }}>
                  안전 투자 포트폴리오 결과 메일 전송 시스템
                </div>
              </div>
            </div>
            {/* 오른쪽 화살표 */}
            <div className="arrow-container">
              <span
                className="material-symbols-outlined arrow-ios"
                style={{
                  fontSize: "24px",
                }}>
                arrow_forward_ios
              </span>
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleModalClose}
          contentLabel="Investment Report Modal"
          closeTimeoutMS={100} // 모달 애니메이션 지속 시간
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)", // 어두운 오버레이
              transition: "opacity 0.3s ease-out", // 오버레이 트랜지션
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              borderRadius: "15px",
              transform: "translate(-50%, -50%)",
              transition: "transform 0.3s ease-out", // 모달 애니메이션
              opacity: 0,
              animation: "fadeIn 0.3s forwards", // 페이드 인 애니메이션
            },
          }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2>투자 리포트 구독</h2>
            <span
              style={{ fontSize: "40px", paddingBottom: "5px" }}
              className="material-symbols-outlined spanarrow">
              chevron_right
            </span>
          </div>
          <p
            style={{
              color: "grey",
              display: "flex",
              justifyContent: "flex-end",
            }}>
            본 서비스는 이메일로 전송됩니다.
          </p>

          <div style={{ marginBottom: "15px" }}>
            <Accordion
              expanded={expandedPanels.panel1}
              onChange={handleAccordionChange("panel1")}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <h4> 서비스 개요</h4>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <strong>구독 대상</strong>: 최신 시장 동향 및 종목 분석
                    리포트를 주기적으로 받아보실 수 있는 서비스입니다.
                  </li>
                  <li>
                    <strong>리포트 발행 주기</strong>: 주 1회 발행되며, 특별
                    이슈 발생 시 추가 리포트가 발행될 수 있습니다.
                  </li>
                  <li>
                    <strong>리포트 내용</strong>: 국내외 주요 증시 분석, 추천
                    종목, 경제 전망 등 다양한 투자 정보를 제공합니다.
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expandedPanels.panel2}
              onChange={handleAccordionChange("panel2")}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header">
                <h4> 서비스 신청 및 해지</h4>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <strong>신청 방법</strong>: 본 모달에서 '신청하기' 버튼을
                    클릭하여 구독 신청을 완료하실 수 있습니다.
                  </li>
                  <li>
                    <strong>해지 방법</strong>: 구독 해지를 원하실 경우,
                    고객센터로 문의하시거나 마이페이지 구독관리에서 해지 신청이
                    가능합니다.
                  </li>
                  <li>
                    <strong>서비스 이용료</strong>: 월 9,900원(VAT 포함)이
                    부과되며, 최초 신청 시 첫 달 무료로 제공됩니다.
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expandedPanels.panel3}
              onChange={handleAccordionChange("panel3")}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header">
                <h4>개인정보 보호</h4>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <strong>개인정보 수집 및 이용</strong>: 서비스 제공을 위해
                    필요한 최소한의 개인정보를 수집하며, 수집된 개인정보는 투자
                    리포트 발송 및 관련 고객 응대에만 사용됩니다.
                  </li>
                  <li>
                    <strong>개인정보 보호 정책</strong>: 개인정보는 당사의
                    개인정보 처리방침에 따라 안전하게 관리됩니다. 자세한 내용은{" "}
                    <a href="#">개인정보 처리방침</a>을 참조해 주세요.
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expandedPanels.panel4}
              onChange={handleAccordionChange("panel4")}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4a-content"
                id="panel4a-header">
                <h4>유의사항</h4>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <strong>정기 발행일</strong>: 매주 금요일 오후 3시에
                    발행됩니다. 다만, 공휴일 등으로 인한 일정 변경 시 사전
                    공지가 이루어집니다.
                  </li>
                  <li>
                    <strong>서비스 중단</strong>: 회사 사정에 따라 서비스가
                    일시적으로 중단될 수 있으며, 이 경우 이메일을 통해 안내드릴
                    예정입니다.
                  </li>
                  <li>
                    <strong>투자 책임</strong>: 제공되는 리포트는 투자 판단의
                    참고자료일 뿐, 특정 종목의 수익을 보장하지 않습니다. 모든
                    투자 결정은 고객님의 책임하에 이루어집니다.
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expandedPanels.panel5}
              onChange={handleAccordionChange("panel5")}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel5a-content"
                id="panel5a-header">
                <h4>고객 지원</h4>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <strong>문의처</strong>: 구독서비스 관련 문의는
                    고객센터(1234-5678)로 연락해 주세요. 운영 시간은 평일 오전
                    9시부터 오후 6시까지입니다.
                  </li>
                  <li>
                    <strong>FAQ</strong>: 자주 묻는 질문은{" "}
                    <a href="#">FAQ 페이지</a>에서 확인하실 수 있습니다.
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  color="info"
                  onChange={handleCheckboxChange}
                  disabled={!Object.values(expandedPanels).every(Boolean)} // 모든 아코디언이 열리지 않으면 체크박스를 비활성화
                />
              }
              label="위 내용을 모두 확인하였으며, 동의합니다."
            />
            <div>
              <button
                onClick={handleModalConfirm}
                style={{
                  padding: "8px 20px",
                  backgroundColor: isChecked ? "rgb(2 183 207)" : "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: isChecked ? "pointer" : "not-allowed",
                  fontSize: "20px",
                  transition: "background-color 0.3s ease",
                }}
                disabled={!isChecked} // 체크박스가 선택되지 않으면 버튼을 비활성화
                onMouseEnter={(e) =>
                  isChecked &&
                  (e.target.style.backgroundColor = "rgb(2 203 247)")
                }
                onMouseLeave={(e) =>
                  isChecked &&
                  (e.target.style.backgroundColor = "rgb(2 183 207)")
                }>
                확인
              </button>
              <button
                onClick={handleModalClose}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "20px",
                  marginLeft: "10px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#c82333")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#dc3545")
                }>
                취소
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
function SkeletonCustomerCard() {
  return (
    <>
      <Card style={{ margin: 24, width: "95%", borderRadius: "25px" }}>
        <CardContent style={{ borderRadius: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              borderRadius: "25px",
            }}>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="rectangular" width={60} height={20} />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <Skeleton
            variant="circular"
            width={30}
            height={30}
            style={{ marginRight: "5px" }}
          /> */}
            <Skeleton variant="text" width="20%" height={40} />
          </div>
          {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "35px",
            height: "50px",
          }}>
          <Skeleton variant="text" width="50%" height={60} />
        </div> */}
        </CardContent>
      </Card>{" "}
      <Card style={{ margin: 24, width: "95%", borderRadius: "25px" }}>
        <CardContent style={{ borderRadius: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              borderRadius: "25px",
            }}>
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="rectangular" width={60} height={30} />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <Skeleton
            variant="circular"
            width={30}
            height={30}
            style={{ marginRight: "5px" }}
          /> */}
            <Skeleton variant="text" width="20%" height={40} />
          </div>
          {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "35px",
            height: "50px",
          }}>
          <Skeleton variant="text" width="50%" height={60} />
        </div> */}
        </CardContent>
      </Card>
    </>
  );
}
export default MarketCapitalization;
