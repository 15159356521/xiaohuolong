const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "hhttps://sub.admin.longyaoapp.com/index.php",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/",
      },
    })
  );
};
