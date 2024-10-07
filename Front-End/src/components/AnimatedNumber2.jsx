import React from "react";
import CountUp from "react-countup";

function AnimatedNumber({ value }) {
  // value가 숫자가 아닐 경우 숫자로 변환, 변환 불가능한 경우 0으로 설정
  const numericValue = isNaN(parseFloat(value.replace(/,/g, "")))
    ? 0
    : parseFloat(value.replace(/,/g, ""));

  return (
    <CountUp
      start={numericValue * 0.99} // 시작값을 약간 낮게 설정
      end={numericValue} // 종료값
      duration={1} // 애니메이션 지속 시간
      separator="," // 1,000 단위로 쉼표
      decimals={numericValue % 1 === 0 ? 0 : 2} // 소수점 처리
      decimal="." // 소수점 표시
      suffix="원" // 뒤에 붙을 문자열
    />
  );
}

export default AnimatedNumber;
