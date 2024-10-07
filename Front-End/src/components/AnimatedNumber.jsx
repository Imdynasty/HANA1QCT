import React from "react";
import CountUp from "react-countup";

function AnimatedNumber({ value }) {
  // value를 숫자로 변환, 변환이 불가능한 경우 기본값 0 사용
  const numericValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);

  return (
    <CountUp
      start={numericValue * 0.999} // 시작값을 약간 낮게 설정
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
