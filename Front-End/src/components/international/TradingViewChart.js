import React, { useEffect, useRef, memo } from "react";
import "../../css/TradingView.css";
function TradingViewWidget({ symbol }) {
  const container = useRef();
  useEffect(() => {
    while (container.current.firstChild) {
      container.current.removeChild(container.current.firstChild);
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${symbol}",
          "timezone": "Asia/Seoul",
          "theme": "light",
          "style": "3",
          "locale": "kr",
          "backgroundColor": "rgba(255, 255, 255, 1)",
          "gridColor": "rgba(255, 255, 255, 0.06)",
          "hide_top_toolbar": true,
          "range": "YTD",
          "allow_symbol_change": false,
          "save_image": false,
          "calendar": false,
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650",
          "hide_volume": false,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{
        height: "50%",
        width: "100%",
        borderBottomLeftRadius: "15px",
        borderBottomRightRadius: "15px",
      }}>
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export default memo(TradingViewWidget);
