import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "antd/dist/antd.css";
import { Provider } from 'react-redux'
import store from './store'
import { ConfigProvider } from 'antd';
import 'moment/locale/zh-cn';
import locale from 'antd/es/locale/zh_CN';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
           <ConfigProvider locale={locale}>
<App />

           </ConfigProvider>
        
    </Provider>
);

