import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.css";
// import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import locale from "antd/es/locale/zh_CN";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <ConfigProvider locale={locale}>
    <App />
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
