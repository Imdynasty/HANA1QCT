import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Slide from "@mui/material/Slide";
import axios from "axios";
import LinearWithValueLabel from "../LinearWithValueLabel";
import "animate.css";

export default function BasicCard({
  actionText = "보내기",
  modalStyle,
  accountId,
  accountNumber = "",
}) {
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(true); // 상태 추가
  const [openModal, setOpenModal] = useState(false);
  const [additionalCash, setAdditionalCash] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [value, setValue] = useState(""); // Display value with commas

  // 숫자 입력값을 쉼표가 포함된 형식으로 포맷
  const formatWithCommas = (input) => {
    // Remove non-digits and replace with empty string
    const onlyNums = input.replace(/[^0-9]/g, "");
    // Format with commas using Intl.NumberFormat
    return new Intl.NumberFormat().format(onlyNums);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    const onlyNums = value.replace(/[^0-9]/g, ""); // 숫자만 추출
    const formattedInput = formatWithCommas(onlyNums); // 쉼표로 포맷
    setValue(formattedInput); // 형식화된 문자열 상태 업데이트
    setAdditionalCash(parseInt(onlyNums) || 0);
  };
  const getAvatarUrl = (institution) => {
    switch (institution) {
      case "KB국민은행":
        return `${process.env.PUBLIC_URL}/img/kb.png`;
      case "신한은행":
        return `${process.env.PUBLIC_URL}/img/shinhan.png`;
      case "IBK기업은행":
        return `${process.env.PUBLIC_URL}/img/ibk.png`;
      case "NH농협은행":
        return `${process.env.PUBLIC_URL}/img/nh.png`;
      case "우리은행":
        return `${process.env.PUBLIC_URL}/img/woori.png`;
      default:
        return `${process.env.PUBLIC_URL}/img/logo.png`; // 기본 이미지
    }
  };
  const [selectedAccountNumber, setSelectedAccountNumber] = useState("");

  const handleOpenModal = (accountNum) => {
    setSelectedAccountNumber(accountNum); // 선택된 계좌 번호 저장
    setValue(""); // 입력 값 초기화
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setValue(""); // Reset input value
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // localStorage에서 계좌 정보 가져오기
    const accounts = JSON.parse(localStorage.getItem("MyAccounts"));
    const accountIndex = accounts.findIndex(
      (account) => account.accountNumber === selectedAccountNumber
    );

    // 계좌가 존재하면 금액 업데이트
    if (accountIndex !== -1) {
      accounts[accountIndex].accounts -= additionalCash; // 선택한 계좌의 금액 업데이트
      localStorage.setItem("MyAccounts", JSON.stringify(accounts)); // 업데이트된 계좌 정보 저장
      setAccountData(accounts); // 상태 업데이트

      try {
        const response = await axios.post(
          `http://13.125.78.241:8081/hana/${accountId}/addCash`,
          { additionalCash: additionalCash }
        );
        console.log("Server response:", response.data);
        setCompleted(true);
        setTimeout(() => {
          setCompleted(false);
          setLoading(false);
          setOpen(false);
          handleCloseModal();
        }, 2000); // 2초 후 슬라이더 애니메이션이 완료되고 페이지를 새로고침합니다.
      } catch (error) {
        console.error("Error posting data:", error);
        setLoading(false);
      }
    } else {
      console.error("Selected account not found");
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true); // 데이터 로딩 시작
    const data = localStorage.getItem("MyAccounts");
    setTimeout(() => {
      // 로컬 스토리지 시뮬레이션 지연
      if (data) {
        const accounts = JSON.parse(data);
        // console.log("Data fetched from localStorage:", accounts);
        const filteredData = accounts.map(({ ci, ...rest }) => rest);
        setAccountData(filteredData); // 상태 업데이트
      }
      setLoading(false); // 데이터 로딩 완료
    }, 1000);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxHeight: "400px",
        overflowY: "auto",
        marginTop: "20px",
        ...modalStyle,
      }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            paddingTop: "170px",
          }}>
          <CircularProgress
            disableShrink
            size={130}
            color="success"
            thickness={2}
          />
        </Box>
      ) : (
        accountData.map((account, index) => (
          <Card
            key={index}
            sx={{
              width: 1000,
              marginTop: 3,
              marginBottom: 2,
              border: "1px solid #e0e0e0",
              borderRadius: "15px",
            }}>
            <CardContent>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                  <Avatar
                    src={getAvatarUrl(account.financialInstitution)}
                    style={{
                      marginRight: "20px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}>
                    <Typography variant="h5" component="div">
                      {account.financialInstitution}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {account.accountNumber}
                    </Typography>
                  </div>
                </div>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 30,
                    fontFamily: "Noto Sans KR",
                    fontWeight: "600",
                  }}>
                  {`${parseInt(account.accounts).toLocaleString()}원`}
                </Typography>
              </div>
            </CardContent>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <CardActions>
                <Button
                  size="medium"
                  style={{ fontSize: "25px", color: "green" }}
                  onClick={() => handleOpenModal(account.accountNumber)}>
                  {actionText}
                </Button>
              </CardActions>
            </div>
          </Card>
        ))
      )}

      <Dialog
        fullWidth={true}
        height={"100%"}
        open={openModal}
        onClose={handleCloseModal}
        TransitionComponent={Slide}
        transitionDuration={300}>
        <DialogTitle
          sx={{
            fontSize: "30px",
            paddingLeft: "28px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}>
          {loading ? (
            <div className="animate__animated animate__flash">
              자산 이동중입니다
            </div>
          ) : (
            <>
              <span style={{ fontWeight: "bold", paddingRight: "10px" }}>
                {accountId}
              </span>
              계좌 충전
              <span
                style={{ fontSize: "35px" }}
                className="material-symbols-outlined">
                chevron_right
              </span>
            </>
          )}
        </DialogTitle>

        <DialogContent>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 90,
              }}>
              <LinearWithValueLabel />
            </Box>
          ) : (
            <>
              <DialogContentText
                sx={{
                  fontSize: "20px",
                  paddingBottom: "10px",
                  paddingLeft: "5px",
                }}>
                {" "}
                계좌에 추가할 금액을 입력해 주세요.
              </DialogContentText>
              <TextField
                InputProps={{
                  inputProps: {
                    style: { fontSize: "24px", paddingTop: "10px" }, // 입력 글꼴 크기 설정
                  },
                }}
                color="success"
                autoFocus
                margin="dense"
                id="cashAmount"
                label="추가 금액 (원)"
                type="text"
                fullWidth
                value={value}
                variant="outlined"
                onChange={handleChange}
              />
              <DialogActions sx={{ paddingRight: "18px" }}>
                <Button
                  sx={{ fontSize: "20px", color: "green" }}
                  onClick={handleCloseModal}>
                  취소
                </Button>
                <Button
                  sx={{ fontSize: "20px", color: "green" }}
                  onClick={handleSubmit}
                  disabled={!additionalCash}>
                  확인
                </Button>
              </DialogActions>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
