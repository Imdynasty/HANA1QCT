import React, { useState, useEffect } from "react";
import "./App.css";
import HeadNavbar from "./components/Headnavbar.js";
import Slider from "react-slick";
import { SamplePrevArrow, SampleNextArrow } from "./components/SlideArrow.js";
import CollapseEx from "./components/Information.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Banner from "./components/Banner.js";
import DomesticStocks from "./pages/DomesticStocks.js";
import InternationalStocks from "./pages/InternationalStocks.js";
import MyAssets from "./pages/MyAssets.js";
import MainInfo from "./pages/MainInformation.js";
import Login from "./components/Login";

function App() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [loadChart, setLoadChart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const hanaLogo = `${process.env.PUBLIC_URL}/img/logo.png`;
  const videoSource = `${process.env.PUBLIC_URL}/img/background.mp4`;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const settings = {
    infinite: false,
    initialSlide: 0,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    beforeChange: (current, next) => setCurrentSlide(next),
    nextArrow: <SampleNextArrow currentSlide={currentSlide} />,
    prevArrow: <SamplePrevArrow currentSlide={currentSlide} />,
    afterChange: (current) => {
      setCurrentSlide(current);
      if (current === 1) {
        setTimeout(() => setLoadChart(true), 100);
      } else {
        setLoadChart(false);
      }
    },
  };

  useEffect(() => {
    // 앱이 처음 로드될 때 토큰 확인
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // useEffect(() => {
  //   // 경로 변경 감지하여 로딩 상태 관리
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 300);
  // }, [location]);

  // 현재 경로에 따라 배경색 결정 함수
  const getBackgroundClass = () => {
    switch (location.pathname) {
      case "/home":
        return "slide2-home";
      case "/domestic-stocks":
        return "slide2-domestic";
      case "/international-stocks":
        return "slide2-international";
      case "/my-assets":
        return "slide2-assets";
      default:
        return "slide2-default";
    }
  };

  return (
    <div className="App">
      <Slider {...settings}>
        <div className="background-video">
          <video autoPlay muted loop>
            <source src={videoSource} type="video/mp4" />
          </video>
          <HeadNavbar logo={hanaLogo} brandName="Hana1QCT" />
          <div className="video-content">
            <div className="inside-content">
              <div className="slogan">
                Invest in <span className="highlight">Stability</span>, Trade
                with <span className="highlight">Assurance</span>
              </div>
              <span>Hana1QCT : Your Investment Partner</span>
            </div>
            <div className="accordion">
              <CollapseEx
                title="Wealth Management"
                content="Hana1QCT는 안전한 거래시스템을 바탕으로, 고객 맞춤형 컨설팅을 제공하여 자산관리의 새로운 기준을 제시합니다."
              />
            </div>
            <div className="accordion2">
              <CollapseEx
                title="Principal Investment"
                content="Hana1QCT는 '안정적인 투자와 간편한 플랫폼'을 목표로, CITIZEN의 가치를 반영한 차별화된 투자 서비스를 제공합니다."
              />
            </div>
          </div>
        </div>

        {isLoggedIn ? (
          <div className={`slide2 ${getBackgroundClass()}`}>
            <div style={{ display: "flex" }}>
              <Banner setIsLoggedIn={setIsLoggedIn} />
              <div style={{ flex: 1 }}>
                {isLoading ? (
                  <span className="loader"></span>
                ) : (
                  <Routes>
                    <Route path="/home" element={<MainInfo />} />
                    <Route
                      path="/domestic-stocks"
                      element={<DomesticStocks />}
                    />
                    <Route
                      path="/international-stocks"
                      element={<InternationalStocks />}
                    />
                    <Route path="/my-assets" element={<MyAssets />} />
                  </Routes>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Login onLogin={() => setIsLoggedIn(true)} />
        )}
      </Slider>
    </div>
  );
}

export default App;
