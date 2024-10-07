const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/krx",
    createProxyMiddleware({
      target: "http://data.krx.co.kr",
      changeOrigin: true,
      pathRewrite: { "^/krx": "" },
    })
  );
};
