import React from "react";
import { Carousel } from "antd";

const MainBanner = () => {
  const contentStyle = {
    height: "344px", // Carousel 높이 설정
    color: "#fff",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    width: "100%",
  };

  return (
    <Carousel
      autoplay
      effect="fade"
      style={{
        borderBottomLeftRadius: "25px",
        borderBottomRightRadius: "25px",
        overflow: "hidden",
      }}>
      <div>
        <div
          style={{
            ...contentStyle,
            backgroundImage: `url(${process.env.PUBLIC_URL}/img/mainbanner/main_banner2.png)`,
            backgroundPosition: "center 60%",
          }}>
          <div
            style={{
              position: "absolute",
              left: "5%",
              display: "flex",
              justifyContent: "flex-start",
              alignContent: "flex-start",
              flexDirection: "column",
            }}>
            <h1
              style={{
                color: "black",
                textAlign: "left",
              }}>
              해외파생
              <br />
              실전투자대회
            </h1>
            <br />
            <h3 style={{ color: "grey" }}>올림픽의 환희! 해외파생 거래로!</h3>
            <br />
            <h5 style={{ color: "grey", textAlign: "left" }}>
              <span style={{ marginRight: "2px" }}>※</span>투자전 설명 청취 및
              상품설명서 필독
              <br />
              <span style={{ marginRight: "2px" }}>※</span>
              원금초과손실 발생 가능 및 투자자 귀속
            </h5>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            ...contentStyle,
            backgroundImage: `url(${process.env.PUBLIC_URL}/img/mainbanner/main_banner3.png)`,
            backgroundPosition: "center",
          }}>
          <div
            style={{
              position: "absolute",
              left: "5%",
              display: "flex",
              justifyContent: "flex-start",
              alignContent: "flex-start",
              flexDirection: "column",
            }}>
            <h1
              style={{
                color: "black",
                textAlign: "left",
              }}>
              하나 어린이 적립식
              <br />
              특판RP 연7%
            </h1>
            <br />
            <h3 style={{ color: "grey" }}>세전, 최초 매수일로부터 12개월</h3>
            <br />
            <h5 style={{ color: "grey", textAlign: "left" }}>
              <span style={{ marginRight: "2px" }}>※</span>투자전 설명 청취 및
              상품설명서・약관 필독
              <br />
              <span style={{ marginRight: "2px" }}>※</span>
              원금초과손실 발생 가능 및 투자자 귀속
            </h5>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            ...contentStyle,
            backgroundImage: `url(${process.env.PUBLIC_URL}/img/mainbanner/main_banner4.png)`,
            backgroundPosition: "center 75%",
          }}>
          <div
            style={{
              position: "absolute",
              left: "5%",
              display: "flex",
              justifyContent: "flex-start",
              alignContent: "flex-start",
              flexDirection: "column",
            }}>
            <h1
              style={{
                color: "black",
                textAlign: "left",
              }}>
              미국주식 소수점
              <br />
              적립식 투자 챌린지
            </h1>
            <br />
            <h3 style={{ color: "grey", textAlign: "left" }}>
              원큐스탁 소수점 주문 이벤트
            </h3>
            <br />
            <h5 style={{ color: "grey", textAlign: "left" }}>
              <span style={{ marginRight: "2px" }}>※</span>투자전 설명 청취 및
              상품설명서・약관 필독
              <br />
              <span style={{ marginRight: "2px" }}>※</span>
              원금손실 가능 및 투자자 귀속
            </h5>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            ...contentStyle,
            backgroundImage: `url(${process.env.PUBLIC_URL}/img/mainbanner/main_banner1.png)`,
            backgroundPosition: "center center",
          }}>
          <div
            style={{
              position: "absolute",
              left: "5%",
              display: "flex",
              justifyContent: "flex-start",
              alignContent: "flex-start",
              flexDirection: "column",
            }}>
            <h1
              style={{
                color: "black",
                textAlign: "left",
              }}>
              TIGER ETF
              <br />
              적립식 투자이벤트
            </h1>
            <br />
            <h3 style={{ color: "grey", textAlign: "left" }}>
              미래에셋자산운용
            </h3>
            <br />
            <h5 style={{ color: "grey", textAlign: "left" }}>
              <span style={{ marginRight: "2px" }}>※</span>투자전 설명 청취 및
              (간이)투자설명서・집합투자규약 필독
              <br />
              <span style={{ marginRight: "2px" }}>※</span>
              원금손실 발생가능 및 투자자 귀속
            </h5>
          </div>
        </div>
      </div>
    </Carousel>
  );
};

export default MainBanner;
