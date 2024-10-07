import React from "react";

const SampleNextArrow = (props) => {
  const { className, style, onClick, currentSlide } = props;
  return (
    currentSlide < 1 && (
      <div
        className={className}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      />
    )
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick, currentSlide } = props;
  return (
    currentSlide > 0 && (
      <div
        className={className}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      />
    )
  );
};

export { SampleNextArrow, SamplePrevArrow };
