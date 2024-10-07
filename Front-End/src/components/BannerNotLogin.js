import * as React from "react";
import { NavLink } from "react-router-dom";
import { Badge, OverlayTrigger, Tooltip, Button, Image } from "react-bootstrap";
import SearchBar from "./SearchBar.js";
import IndexBanner from "./IndexBanner.js";
import "../css/Banner.css";
const Banner = ({ setIsLoggedIn }) => {
  const hanaLogo = `${process.env.PUBLIC_URL}/img/1qct.png`;
  const bannerStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/img/sonhm.png)`,
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      본인인증된 사용자입니다.
    </Tooltip>
  );
  const handleLogout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    setIsLoggedIn(false); //
  };
  return (
    <div
      className="banner"
      style={{
        width: "16%",
        height: "100vh",
        backgroundColor: "#fff",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      }}>
      <div
        className="logo"
        style={{ padding: "5%", borderBottom: "1px solid #ccc" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <NavLink to="/home">
            <img
              src={hanaLogo}
              alt="Logo"
              width="150"
              height="70"
              className="d-inline-block align-top"
            />
          </NavLink>
          {/* <NavLink
            to="/home"
            className="navbar-brand"
            style={{
              color: "rgb(98 98 98)",
              fontSize: "35px",
              fontWeight: "bold",
              fontFamily: "Notosans",
            }}>
            HanaCT
          </NavLink> */}
        </div>
        <div
          style={{
            padding: "40px",
            textAlign: "left",
            fontSize: "150%",
            fontWeight: "500",
            width: "100%",
            height: "100%",
          }}>
          <div
            style={{
              marginBottom: "15px",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "Notosans",
            }}>
            {" "}
            {/* 오승민님 밑에 공간 추가 */}
            <span
              style={{
                fontSize: "25px",
                fontWeight: "bold",
                paddingTop: "8px",
                color: "rgb(98 98 98)",
              }}>
              로그인이 필요합니다.
            </span>
          </div>
          <div
            style={{
              marginBottom: "20px",
              fontSize: "20px",
              color: "rgb(98 98 98)",
              fontFamily: "Notosans",
            }}>
            {" "}
            {/* 안녕하세요, 반갑습니다. 밑에 공간 추가 */}
            OTP 인증을 통해 로그인해주세요.
          </div>
          <Badge
            style={{ fontFamily: "Notosans", cursor: "pointer" }}
            pill
            bg="secondary">
            {" "}
            {/* 로그아웃 클릭 핸들러 추가 */}
            <span style={{ paddingTop: "15px" }}>로그인</span>
          </Badge>
        </div>
      </div>
      <ul
        style={{
          listStyle: "none",
          paddingLeft: "80px ",
          paddingTop: "80px",
          width: "100%",
          fontSize: "200%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginTop: "30px",
          fontFamily: "Notosans",
        }}>
        <li className="li-hoverable" style={{ marginBottom: "30px" }}>
          <NavLink
            to="/domestic-stocks"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: "rgb(98 98 98)",
            })}>
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{
                    paddingRight: "15px",
                    color: isActive ? "black" : "rgb(98 98 98)",
                    fontVariationSettings: `'FILL' ${isActive ? 1 : 0}`,
                  }}>
                  bid_landscape
                </span>
                <span
                  style={{
                    color: isActive ? "black" : "rgb(98 98 98)",
                    fontWeight: isActive ? "500" : "normal",
                  }}>
                  국내주식
                </span>
              </>
            )}
          </NavLink>
        </li>
        <li className="li-hoverable" style={{ marginBottom: "30px" }}>
          <NavLink
            to="/international-stocks"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: "rgb(98 98 98)",
            })}>
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{
                    paddingRight: "15px",
                    color: isActive ? "black" : "rgb(98 98 98)",
                    fontVariationSettings: `'FILL' ${isActive ? 1 : 0}`,
                  }}>
                  public
                </span>
                <span
                  style={{
                    color: isActive ? "black" : "rgb(98 98 98)",
                    fontWeight: isActive ? "500" : "normal",
                  }}>
                  해외주식
                </span>
              </>
            )}
          </NavLink>
        </li>
        <li className="li-hoverable" style={{ marginBottom: "55px" }}>
          <NavLink
            to="/my-assets"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: "rgb(98 98 98)",
              paddingLeft: "1px",
            })}>
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{
                    paddingRight: "15px",
                    color: isActive ? "black" : "rgb(98 98 98)",
                    fontVariationSettings: `'FILL' ${isActive ? 1 : 0}`,
                  }}>
                  account_balance_wallet
                </span>
                <span
                  style={{
                    color: isActive ? "black" : "rgb(98 98 98)",
                    fontWeight: isActive ? "500" : "normal",
                  }}>
                  내 자산
                </span>
              </>
            )}
          </NavLink>
        </li>
        <li style={{ marginBottom: "125%", paddingLeft: "20px" }}>
          {/* <SearchBar /> */}
        </li>

        {/* <div className="bubble-image" style={bannerStyle}>
            <div className="bubble-text">
              현금안전투자형
              <span
                className="material-symbols-outlined"
                style={{ color: "green" }}>
                exclamation
              </span>
            </div>
          </div> */}
      </ul>
      <IndexBanner />
    </div>
  );
};

export default Banner;
