import React, { useState } from "react";
import axios from "axios";
import "../css/Login.css";
import "../css/CustomToast.css"; // 커스텀 CSS를 임포트
import { jwtDecode } from "jwt-decode";
import { FaUser, FaLock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Banner from "./BannerNotLogin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // OTP 코드 입력 상태 추가
  const [error, setError] = useState("");
  const [isOtpRequired, setIsOtpRequired] = useState(false); // 2단계 인증이 필요한지 여부

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isOtpRequired) {
      try {
        const response = await axios.post(
          "http://13.125.78.241:8081/hanact/login/validate",
          {
            userId: username,
            password,
          }
        );

        if (response.status === 200 && response.data === "OTP Sent") {
          setIsOtpRequired(true); // OTP가 전송된 경우, 다음 단계로 진행
        }
      } catch (error) {
        setError("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    } else {
      // OTP 검증 로직
      try {
        const response = await axios.post(
          "http://13.125.78.241:8081/hanact/login/2fa/validate",
          {
            userId: username,
            otpCode: otp,
          }
        );

        if (response.status === 200) {
          const token = response.data;
          localStorage.setItem("token", token);

          const decodedToken = jwtDecode(token);

          // 토스트 메시지를 띄우고 사용자가 확인을 누를 때까지 기다리기
          await new Promise((resolve) => {
            toast.success(`환영합니다, ${decodedToken.name}님!`, {
              onClose: resolve, // 사용자가 토스트를 닫을 때 Promise가 해결됨
              autoClose: false, // 자동으로 닫히지 않도록 설정
              closeButton: true, // 닫기 버튼 표시
            });
          });

          onLogin(decodedToken);
        } else {
          setError("OTP 코드가 유효하지 않습니다.");
        }
      } catch (error) {
        setError("OTP 코드가 유효하지 않습니다.");
      }
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Banner />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark overlay
          zIndex: -1,
        }}
      />
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <p className="info-text">
            로그인시 사용자의 정보가 저장됩니다
            <span className="info-icon">i</span>
          </p>
          {error && <div className="error">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">
              <FaUser className="icon" />
            </label>
            <input
              type="text"
              id="username"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="icon" />
            </label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isOtpRequired && (
            <div className="form-group">
              <label htmlFor="otp">
                <FaLock className="icon" />
              </label>
              <input
                type="text"
                id="otp"
                placeholder="OTP 코드"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="login-button">
            {isOtpRequired ? "OTP 확인" : "로그인"}{" "}
            <IoIosArrowForward className="arrow-icon" />
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
