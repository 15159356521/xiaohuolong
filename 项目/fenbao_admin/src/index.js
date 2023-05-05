import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import{Provider} from 'react-redux';
import store from './store';
// import reportWebVitals from './reportWebVitals'; 严格模式
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>

<ConfigProvider locale={zhCN}>
    <App />
</ConfigProvider>
</Provider>
);

