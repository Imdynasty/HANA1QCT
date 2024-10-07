import React, { useState, useEffect } from "react";
import { Tooltip, Typography } from "antd";
import { useSpring, animated } from "react-spring";
import axios from "axios";

const AssetBalanceOverview = ({ accountId, onCashTotalChange }) => {
  const [cashPercent, setCashPercent] = useState(0);
  const [domesticPercent, setDomesticPercent] = useState(0);
  const [foreignPercent, setForeignPercent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const domesticRes = await axios.get(
          `http://13.125.78.241:8081/balances/domestic/summary/${accountId}`
        );
        const foreignRes = await axios.get(
          `http://13.125.78.241:8081/balances/overseas/summary/${accountId}`
        );
        const cashRes = await axios.get(
          `http://13.125.78.241:8081/accounts/CMA`
        );
        const domesticTotal = Number(domesticRes.data.totEvluAmt || 0);
        const foreignTotal = Number(foreignRes.data.totAsstAmt || 0);
        const cashTotal = Number(cashRes.data.cash || 0); // cashTotal 값 설정

        // 모든 자산의 총합 계산
        const total = domesticTotal + foreignTotal + cashTotal;
        onCashTotalChange(cashTotal); // 부모
        // 각 자산의 백분율 계산
        setCashPercent((cashTotal / total) * 100);
        setDomesticPercent((domesticTotal / total) * 100);
        setForeignPercent((foreignTotal / total) * 100);
      } catch (error) {
        console.error("Error fetching asset distribution data:", error);
      }
    };

    fetchData();
  }, [accountId]);

  // 애니메이션 효과 추가, 속도 조절
  const animationConfig = { tension: 50, friction: 30 };

  const animatedCashProps = useSpring({
    width: `${cashPercent}%`,
    from: { width: "0%" },
    config: animationConfig,
  });
  const animatedDomesticProps = useSpring({
    width: `${domesticPercent}%`,
    from: { width: "0%" },
    config: animationConfig,
  });
  const animatedForeignProps = useSpring({
    width: `${foreignPercent}%`,
    from: { width: "0%" },
    config: animationConfig,
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          margin: "30px 20px 10px 20px",
        }}>
        <div
          style={{
            width: "100%",
            height: "15px",
            backgroundColor: "#eee",
            borderRadius: "5px",
            overflow: "hidden",
          }}>
          <animated.div
            style={{
              ...animatedCashProps,
              height: "100%",
              backgroundColor: "#01d8f9",
              float: "left",
            }}
          />
          <animated.div
            style={{
              ...animatedDomesticProps,
              height: "100%",
              backgroundColor: "#f770a3",
              float: "left",
            }}
          />
          <animated.div
            style={{
              ...animatedForeignProps,
              height: "100%",
              backgroundColor: "#882afb",
              float: "left",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginLeft: "20px",
          marginRight: "20px",
          marginTop: "20px",
        }}>
        <Tooltip title={`예수금: ${cashPercent.toFixed(2)}%`}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
            }}>
            <span
              style={{
                backgroundColor: "#01d8f9",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                marginRight: "5px",
              }}></span>
            <Typography.Text style={{ fontSize: "20px" }}>
              예수금 {cashPercent.toFixed(2)}%
            </Typography.Text>
          </div>
        </Tooltip>
        <Tooltip title={`국내주식: ${domesticPercent.toFixed(2)}%`}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
            }}>
            <span
              style={{
                backgroundColor: "#f770a3",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                marginRight: "5px",
              }}></span>
            <Typography.Text style={{ fontSize: "20px" }}>
              국내주식 {domesticPercent.toFixed(2)}%
            </Typography.Text>
          </div>
        </Tooltip>
        <Tooltip title={`해외주식: ${foreignPercent.toFixed(2)}%`}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                backgroundColor: "#882afb",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                marginRight: "5px",
              }}></span>
            <Typography.Text style={{ fontSize: "20px" }}>
              해외주식 {foreignPercent.toFixed(2)}%
            </Typography.Text>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default AssetBalanceOverview;
