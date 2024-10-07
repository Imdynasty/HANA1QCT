import React, { useState, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { Button, CardActionArea, CardActions } from "@mui/material";
import Swal from "sweetalert2"; // SweetAlert2 import
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "../../css/MydataCard.css";

export default function MultiActionAreaCard({ onClose }) {
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const termsRef = useRef(null);
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
    if (scrollTop + clientHeight === scrollHeight) {
      setButtonEnabled(true);
    }
  };
  const mydatasearch = `${process.env.PUBLIC_URL}/img/mydatasearch.png`;
  const [residentNumber, setResidentNumber] = useState("");
  // 주민등록번호 입력 처리
  const handleResidentNumberChange = (e) => {
    let input = e.target.value;
    const numbers = input.replace(/[^\d-]/g, ""); // 숫자와 하이픈만 허용

    // 숫자가 6자리 이상 입력되었을 때 자동으로 하이픈 추가
    if (!numbers.includes("-") && numbers.length > 6) {
      input = `${numbers.slice(0, 6)}-${numbers.slice(6)}`;
    }

    // 전체 길이가 14자를 넘지 않도록 제한
    if (input.length > 14) {
      input = input.slice(0, 14);
    }

    setResidentNumber(input);
  };
  // 마스킹 로직 조정
  const formatResidentNumber = (number) => {
    const parts = number.split("-");
    if (parts[1]) {
      return `${parts[0]}-${parts[1][0]}${"●".repeat(parts[1].length - 1)}`;
    }
    return number;
  };
  const [phoneNumber, setPhoneNumber] = useState("");
  const formatPhoneNumber = (value) => {
    // 숫자만 입력받기
    const numbers = value.replace(/[^\d]/g, "");

    // 전화번호 포맷: 010-1234-5678
    const phoneNumberMatch = numbers.match(/(\d{1,3})(\d{1,4})?(\d{1,4})?/);

    if (phoneNumberMatch) {
      // 전화번호가 입력되는 동안 "-"를 적절한 위치에 삽입
      const formattedNumber = `${phoneNumberMatch[1]}${
        phoneNumberMatch[2] ? "-" + phoneNumberMatch[2] : ""
      }${phoneNumberMatch[3] ? "-" + phoneNumberMatch[3] : ""}`;
      return formattedNumber;
    }
    return numbers;
  };

  const handleChange = (event) => {
    const formattedNumber = formatPhoneNumber(event.target.value);
    setPhoneNumber(formattedNumber);
  };
  const [carrier, setCarrier] = useState("");
  const [code, setCode] = useState("");
  const [verificationStep, setVerificationStep] = useState("sendCode"); // 'sendCode' or 'verifyCode'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSendBuntton, setShowSendButton] = useState(true);
  const sendVerificationCode = () => {
    setLoading(true);
    axios
      .post(
        `http://13.125.78.241:8081/api/openbanking/oauth/send?phoneNumber=${phoneNumber}`
      )

      .then((response) => {
        setVerificationStep("verifyCode");
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage(
          "인증번호 전송에 실패했습니다. 오류: " + error.response.data.message
        );
        setLoading(false);
      });
    setShowSendButton(false);
  };
  // 인증번호 검증 함수
  const verifyCode = () => {
    setLoading(true);
    axios
      .post(
        `http://13.125.78.241:8081/api/openbanking/oauth/verify?phoneNumber=${phoneNumber}&code=${code}`
      )
      .then((response) => {
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage(
          "인증 실패: " + (error.response?.data?.message || "Unknown Error")
        );
      })
      .finally(() => {
        setLoading(false);
      });
    closeVerificationModal();
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [checked, setChecked] = useState(false);
  const [exchangeResult, setExchangeResult] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const handleExchange = () => {
    setExchangeResult(`
    <section>
  <h4>오픈뱅킹 금융분야 이용 약관(기관)</h4>
  <article>
  <div class="article">
    <h4>제 1 장 총칙</h4>
    <h5>제 1 조 (목적)</h5>
    </div>
    <p>이 약관은 「전자정부법(’21.12.9. 시행)」제43조의2(정보주체 본인에 관한 행정정보의 제공요구권)에서 정하는 바에 따라 종합신용정보집중기관인 한국신용정보원(Korea Credit Information Services, 이하 “신용정보원”이라 한다)이 동조제1항제2호 및 제3호에 따른 은행 등 기관의 금융분야 공공 마이데이터 연계 사업(이하 “공공 마이데이터 사업”이라 한다) 신청, 데이터세트 및 공공 데이터 요청 등 공공 마이데이터 사업과 관련된 업무를 지원하는 웹 기반 서비스인 공공 마이데이터 금융분야 지원 시스템(이하 “지원 시스템”이라 한다)을 설치 및 운영하는 것과 관련하여, 신용정보원과 지원 시스템을 이용하는 자 사이의 권리, 의무, 책임사항 및 기타 필요한 사항을 명확히 규정함을 목적으로 한다.</p>
    <div class="article">
 
    <h5>제 2 조 (용어의 정의)</h5>
    </div>
    <p>1. “서비스”란 지원 시스템을 통해 제공되는 제3조에 기재된 서비스를 의미한다.
    2. “기관”이란 다음 각 목 중 어느 하나의 기관을 의미한다.
    가. 「신용정보의 이용 및 보호에 관한 법률 시행령」 제5조제2항제1호부터제20호까지 및 제21조제2항 각호에 해당하는 금융기관등
    나. 「신용정보의 이용 및 보호에 관한 법률(이하 “신용정보법” 이라 한다)」제2조의9호의3에 따른 본인신용정보관리회사
    다. 「신용정보의 이용 및 보호에 관한 법률」제2조제5호에 따른 신용정보회사
    3. “기관회원”이란 지원 시스템에 접속하여 이 약관에 따라 신용정보원의 가입절차를 통해 기관코드를 부여받은 기관을 의미한다.
    4. “담당자”란 신용정보원이 정하는 가입절차를 통해 기관회원의 임직원의 지위에서 아이디를 부여받은 개인을 의미한다.
    5. “아이디”란 담당자의 식별을 위하여 담당자가 신청하고 신용정보원이 승인하는 문자 또는 숫자의 조합을 의미한다.
    6. “비밀번호”란 담당자가 부여 받은 아이디와 일치하는지를 확인하고 통신망에서 자신의 비밀보호를 위하여 담당자 자신이 선정한 문자와 숫자, 특수문자의 조합을 말한다.
    7. “기관코드”란 각 기관회원의 공공 마이데이터 이용 및 지원 시스템 활용을 관리하기 위하여 신용정보원이 부여하는 고유 코드를 의미한다.
    8. “탈퇴”란 기관회원 또는 담당자에 대하여 지원 시스템 이용을 종료시키는 것을 말한다.
    ② 이 약관에서 사용하는 용어의 정의는 제1항에서 정하는 것을 제외하고는 전자정부법·신용정보법 등 관련 법령 및 행정안전부, 금융위원회 등 유관부처의 안내에서 정하는 바에 따른다.</p>
    <div class="article">

    <h5>제 3 조 (제공 서비스)</h5>
    </div>
    <p>
    1. 기관회원 등록 및 관리 서비스
    2. 기관의 공공 마이데이터 사업 참여 신청 요청ㆍ관리 서비스
    3. 공공마이데이터 신규 데이터세트, 신규 증명서 정보 신청 서비스
    4. 기관 정보 조회 서비스
    5. 전송요구 내역 통합조회 서비스
    6. 그 외 공공 마이데이터 사업 지원과 관련하여 신용정보원이 지원 시스템을 통해 제공하기로 결정한 서비스</p>

    <div class="article">
    <h4>제 2 장 기관회원 등록ㆍ관리</h4>
    <h5>제 4 조 (가입신청)</h5>
    </div>
    <p>① 기관은 원활한 공공 마이데이터 사업 참여를 위하여 지원 시스템에 가입할 수 있다. 다만, 기관이 지원 시스템에 가입하지 않아 발생한 불이익에 대하여 신용정보원은 책임지지 않는다.
    ② 기관회원이 되고자 하는 기관(이하 “가입신청기관” 이라 한다)의 담당자는 가입 신청 시 신용정보원이 정하는 방식에 따라 다음 각 호의 서류를 제출하여야 한다.
    1. 재직증명서
    2. 사업자등록증
    3. 기타 신용정보원이 필요하다고 인정하는 서류
    ③ 가입신청기관은 기관코드별로 지원 시스템 이용 관련 업무를 수행할 임직원을 지정하고, 해당 각 임직원은 담당자로서 지원 시스템에 가입하여 아이디를 발급받아야 한다. 지원 시스템은 각 기관코드별로 지원 시스템에 가입하는 담당자의 숫자를 제한할 수 있다.
    ④ 담당자는 공공 마이데이터 사업 참여 신청 시 신용정보원이 정하는 방식에 따라 다음 각 호의 서류를 신용정보원에 제출한다.
    1. 공공 마이데이터 사업 참여 신청 공문
    2. 법인등기부등본(말소내역 포함, 최근 3개월 이내 발급분)
    3. 영업 인허가(등록) 증명서(신용정보원의 별도 요청 시 제출)
    4. 법인 인감증명서(최근 3개월 이내 발급분)
    5. 사용인감계(최근 3개월 이내 발급분, 제출서류에 사용인감으로 날인 시에만 제출)
    6. API 이용약관 동의서
    7. 기관 담당자의 개인정보 수집·이용 동의서
    8. 기타 신용정보원이 필요하다고 인정하는 서류
    ⑤ 신용정보원은 담당자의 업무별로 지원 시스템을 통해 이용할 수 있는 서비스의 종류를 달리 정할 수 있다.
    ⑥ 가입신청기관은 “지원 시스템”에 안내된 금융업권별 분류 및 신청 가능한 데이터세트를 확인하여 해당 기관이 수행하는 업무에 활용되는 데이터세트 및 증명서 정보를 신청하여야 한다.</p>

    <div class="article">
    <h5>제 5 조 (심사 및 승낙)</h5>
    </div>
    <p>① 가입신청기관 및 담당자가 지원 시스템을 통해 약관의 내용에 대하여 동의를 한 다음 가입 신청을 하고 신용정보원이 이러한 신청에 대하여 승낙함으로써 기관회원 및 담당자 가입이 이루어진다.
    ② 신용정보원은 제4조제2항 및 제4항에 따라 가입신청기관 및 담당자로 가입하고자 하는 자가 제출한 서류를 토대로 명의, 법적 자격요건 등을 심사한 후 가입신청 승낙 여부를 가입시 입력한 전자우편주소 등으로 통지한다. 이 때 제출한 서류는 반환하지 아니한다.
    ③ 신용정보원은 다음 각 호의 사유에 해당하는 신청에 대하여는 제2항의 승낙을 하지 않을 수 있다.
    1. 실명이 아니거나 다른 회사 또는 사람의 명의로 신청하는 경우
    2. 가입신청 시 정보를 누락하거나 오기하거나 날인이 누락된 채로 신청하는 경우
    3. 선량한 풍속 기타 사회질서를 저해하거나 저해할 목적으로 신청한 경우
    4. 이전에 기관회원 또는 담당자 자격을 상실한 적이 있거나 탈퇴, 이용중지 등이 있는 경우
    5. 지원 시스템 기관회원 또는 담당자 가입대상이 아닌 경우
    6. 기타 신용정보원이 정한 요건에 부합되지 않는 경우
    ④ 신용정보원은 기관회원의 가입 신청을 승낙하는 경우 기관코드를, 담당자의 가입 신청을 승낙하는 경우 아이디를 발급한다.</p>
    <div class="article">

    <div class="article">
    <h5>제 6 조 (회원정보의 변경)</h5>
    </div>
    <p>① 기관회원 및 담당자는 지원 시스템 가입 신청 시 기재한 정보가 변경되었을 경우 신용정보원에 즉시 그 변경사항을 알리고 그 변경사항을 증명할 수 있는 서류를 제출하여야 한다.
    ② 신용정보원은 제1항의 서류를 검토한 후 변경 승인 여부를 결정한다.
    ③ 제1항의 변경사항을 신용정보원에 알리지 않아 발생한 불이익에 대하여 신용정보원은 책임지지 않는다.</p>

    <div class="article">
    <h5>제 7 조 (회원의 아이디, 비밀번호, 기관코드 관리에 대한 의무)</h5>
    </div>
    <p>① 기관회원의 기관코드, 담당자의 아이디 및 비밀번호에 대한 관리 책임은 해당 기관회원 및 담당자에게 있으며, 기관회원 및 담당자는 이를 제3자에게 양도하거나 이용하도록 하여서는 안 된다. 담당자의 퇴사, 인사이동 등이 있을 경우에도 해당 담당자의 아이디 및 비밀번호는 신규 담당자를 포함하여 제3자에게 양도할 수 없다.
    ② 기관회원 또는 담당자는 아이디, 비밀번호, 기관코드가 도용되거나 제3자에 의해 사용되고 있음을 인지한 경우에는 즉시 이용이 중단되도록 조치하고, 신용정보원에 통지 후 신용정보원의 안내에 따라 추가적인 조치를 취하여야 한다.
    ③ 제2항의 경우에 해당 기관회원 또는 담당자가 이용 중단 조치 및 신용정보원에 그 사실을 통지하지 않거나, 통지한 경우에도 신용정보원의 안내에 따르지 않아 발생한 불이익에 대하여 신용정보원은 책임지지 않는다.</p>

    <div class="article">
    <h5>제 8 조 (탈퇴)</h5>
    </div>
    <p>① 기관회원 또는 담당자는 언제든지 탈퇴를 요청할 수 있다. 신용정보원은 탈퇴 요청시 이를 처리한다. 탈퇴를 요청한 기관회원이 이미 신청한 서비스나 이용 중인 서비스는 요청 즉시 정지된다.
    ② 기관회원 또는 담당자가 탈퇴를 할 경우 신용정보원은 관련 법령 및 개인정보처리방침에 따라 정보를 보유해야 하는 경우를 제외하고는 기관회원 또는 담당자의 모든 정보를 삭제한다.</p>


    <div class="article">
    <h4>제 3 장 서비스 이용</h4>
    <h5>제 9 조 (담당자 본인인증)</h5>
    </div>
    <p>담당자는 휴대폰 인증 등 신용정보원이 정하는 인증수단을 통해 본인임을 인증받아야 한다.</p>

    <div class="article">
    <h5>제 10 조 (서비스의 이용조건)</h5>
    </div>
    <p>신용정보원이 발급하는 기관코드를 발급받은 기관회원은 지원 시스템을 통해 신용정보원이 제공하는 서비스를 이용할 수 있다.</p>
  </article>
</section>

 
    `);
    setShowModal(true);
  };
  // const closeModal = () => {
  //   setShowModal(false);
  //   setChecked(true); // 모달을 닫을 때 체크박스 상태를 초기화
  //   setButtonEnabled(false);
  // };
  const handleAssets = () => {
    setShowAssetsModal(true);
  };
  const closeAssetsModal = () => {
    setShowAssetsModal(false);
  };
  // 모달 닫기 핸들러 추가
  const handleModalClose = (event) => {
    if (event.target.classList.contains("backdrop")) {
      setShowModal(false);
      setShowVerificationModal(false);
      setShowAssetsModal(false);
    }
  };
  const handleVerification = () => {
    const modalElement = document.querySelector(".modal");
    modalElement.classList.add("modal-exit"); // Add exit class for the current modal
    setTimeout(() => {
      setShowModal(false); // Close the first modal after animation
      modalElement.classList.remove("modal-exit"); // Clean up class
      setShowVerificationModal(true); // Open the verification modal
    }, 100); // Match the duration of the animation
  };

  const closeVerificationModal = () => {
    setShowVerificationModal(false);
    setChecked(true); // 모달을 닫을 때 체크박스 상태를 초기화
    setTimeout(() => {
      Swal.fire({
        title: "인증완료!",
        text: "오픈뱅킹 이용이 가능합니다!",
        icon: "success",
        iconColor: "rgb(2 183 207)",
        confirmButtonText: "확인",
        confirmButtonColor: "rgb(235 250 252)",
        color: "black",
        width: "450px",
        height: "440px",
      });
    }, 500); // 모달이 닫힌 후 SweetAlert2 팝업을 표시
  };
  return (
    <Card
      sx={{
        minWidth: 510,
        background: "rgb(253 253 255)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "20px",
        marginTop: "20px",
        marginLeft: "20px",
      }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}>
        <Typography sx={{ fontSize: 30 }} color="text.secondary" gutterBottom>
          오픈뱅킹 서비스
        </Typography>
        <Typography variant="h6" component="div">
          계좌통합조회로 모든 금융기관의 계좌를 한 번에!
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          #계좌선택한눈에 #숨은계좌찾기 #숨은돈찾기
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", flexDirection: "column" }}>
        <div>
          <img
            src={mydatasearch}
            style={{ maxWidth: "100%", height: "150px" }}
          />
        </div>
        <Button
          onClick={handleExchange}
          size="medium"
          style={{
            fontSize: "25px",
            color: "black",
            border: "2px solid rgb(2 183 207)",
            // backgroundColor: "rgb(235 250 252)",
            width: "100%",
            marginRight: "10px",
            borderRadius: "15px",
          }}>
          <Checkbox
            {...label}
            checked={checked}
            // color="inherit"
            onChange={(event) => setChecked(event.target.checked)}
            sx={{ paddingBottom: "10px" }}
          />
          <span style={{ color: "rgb(64 64 64)" }}>
            계좌통합관리 서비스 이용약관 동의
          </span>
        </Button>
        {showModal && (
          <div className="backdrop" onClick={handleModalClose}>
            <div className="modal modal-enter">
              <div
                ref={termsRef}
                onScroll={handleScroll}
                style={{
                  height: "450px",
                  overflow: "auto",
                  padding: "10px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                }}>
                {/* Here you can place the long terms and conditions text */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: exchangeResult,
                  }}
                />
              </div>
              <button
                onClick={handleVerification}
                style={{
                  padding: "10px",
                  marginTop: "10px",
                  backgroundColor: "rgb(235 250 252)",
                  color: "black",
                  border: "1px solid rgb(2 183 207)",
                  cursor: "pointer",
                  borderRadius: "5px",
                  width: "100%",
                }}>
                약관 동의 후 본인인증
              </button>
            </div>
          </div>
        )}
        {showVerificationModal && (
          <div className="backdrop" onClick={handleModalClose}>
            <div style={{ height: "500px" }} className="modal modal-enter">
              <div
                style={{
                  display: "flex",
                  paddingBottom: "2px",
                  fontSize: "24px",
                }}>
                본인인증 하기
              </div>
              <Box
                sx={{
                  width: 400,

                  mx: "auto",
                  my: 2,
                  padding: 3,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                }}>
                {loading && <CircularProgress />}
                {!loading && (
                  <>
                    <FormControl
                      color="success"
                      fullWidth
                      sx={{ paddingBottom: "5px" }}>
                      <InputLabel color="success" id="carrier-label">
                        통신사
                      </InputLabel>
                      <Select
                        labelId="carrier-label"
                        id="carrier-select"
                        value={carrier}
                        label="통신사"
                        onChange={(e) => setCarrier(e.target.value)}>
                        <MenuItem value={"LG U+"}>LG U+</MenuItem>
                        <MenuItem value={"KT"}>KT</MenuItem>
                        <MenuItem value={"SKT"}>SKT</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      color="success"
                      margin="normal"
                      label="주민등록번호"
                      variant="outlined"
                      value={formatResidentNumber(residentNumber)}
                      onChange={handleResidentNumberChange}
                      fullWidth
                      // inputProps={{ maxLength: 15 }} // 주민등록번호 자릿수 제한
                    />
                    <TextField
                      color="success"
                      margin="normal"
                      fullWidth
                      label="전화번호"
                      value={phoneNumber}
                      onChange={handleChange}
                      variant="outlined"
                    />
                    {showSendBuntton && (
                      <Button
                        onClick={sendVerificationCode}
                        variant="contained"
                        sx={{
                          backgroundColor: "rgb(235 250 252)",
                          color: "black",
                          mt: 2,
                          ":hover": {
                            backgroundColor: "rgb(235 250 252)",
                          },
                        }}
                        fullWidth>
                        인증번호 받기
                      </Button>
                    )}
                    {verificationStep === "verifyCode" && (
                      <>
                        <TextField
                          color="success"
                          margin="normal"
                          fullWidth
                          label="인증번호"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          variant="outlined"
                        />
                        <Button
                          onClick={verifyCode}
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{
                            mt: 2,
                            backgroundColor: "rgb(235 250 252)",
                            color: "black",
                            ":hover": {
                              backgroundColor: "rgb(235 250 252)",
                            },
                          }}>
                          인증번호 확인
                        </Button>
                      </>
                    )}
                    {errorMessage && (
                      <Box sx={{ mt: 2, color: "red" }}>{errorMessage}</Box>
                    )}
                  </>
                )}
              </Box>
            </div>
          </div>
        )}
        <Button
          onClick={handleAssets}
          size="medium"
          style={{
            fontSize: "25px",

            color: "black",
            border: "2px solid rgb(2 183 207)",
            // backgroundColor: "rgb(235 250 252)",
            width: "100%",
            marginTop: "10px",
            marginRight: "10px",
            borderRadius: "15px",
          }}>
          <span style={{ color: "rgb(64 64 64)" }}>나의 자산 불러오기</span>
        </Button>
        {showAssetsModal && (
          <div className="backdrop" onClick={handleModalClose}>
            <div
              className="modal"
              style={{ width: "700px", height: "710px", overflow: "hidden" }}>
              <div
                style={{
                  marginBottom: "10px",
                  borderBottom: "1px solid #ccc",
                  height: "600px",
                }}>
                <iframe
                  src="http://13.125.78.241:8081/api/openbanking/accounts?residentNumber=12345678901234567890"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  frameBorder="0"
                  allow="encrypted-media"
                  title="Accounts"></iframe>
              </div>
              <button
                className="assetcome"
                onClick={onClose}
                style={{
                  padding: "10px",
                  marginTop: "10px",
                  backgroundColor: "rgb(235 250 252)",
                  color: "black",
                  border: "1px solid rgb(2 183 207)",
                  cursor: "pointer",
                  borderRadius: "5px",
                  width: "95%",
                }}>
                내 자산 불러오기
              </button>
            </div>
          </div>
        )}
      </CardActions>
    </Card>
  );
}
