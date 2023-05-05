import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.css";
import App from "./App";
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index";
// 国际化
import { ConfigProvider } from 'antd';
import 'moment/locale/zh-cn';
import locale from 'antd/es/locale/zh_CN';
import { HistoryRouter, history } from './utils/history'

import { message } from 'antd';

message.config({
  maxCount: 8
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
      <HistoryRouter history={history}>
        <ConfigProvider locale={locale}>
          <App />
        </ConfigProvider>
      </HistoryRouter>
  </Provider>
);
