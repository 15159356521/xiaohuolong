const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://mp.yilan.tv/openapi",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/",
      },
    })
  );
};
