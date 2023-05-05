import React from "react";
import { Tabs } from 'antd'

import styles from './index.module.scss'
import logo from "../../assets/logo.png";
// import CodeLogin from "./CodeLogin";
import PwdLogin from "./PwdLogin";

export default function Login() {
    const onChange = (key) => {
        console.log(key);
      };

    return (
        <div className={styles.root}>
            <div className="loginWrapper">
                <div className="logo">
                    <h1>
                        <img src={logo} alt="" />
                        <p>小火龙</p>
                    </h1>
                    <p className="info">欢迎使用小火龙视频</p>
                </div>

                <Tabs
                    centered
                    defaultActiveKey="1"
                    onChange={onChange}
                    items={[
                        {
                            label: `账户密码登录`,
                            key: '1',
                            children: <PwdLogin />,
                        },
                        // 后续加上手机登入
                        // {
                        //     label: `手机号登录`,
                        //     key: '2',
                        //     children: <CodeLogin />,
                        // },
                    ]}
                />
            </div>
        </div>
    );
}
