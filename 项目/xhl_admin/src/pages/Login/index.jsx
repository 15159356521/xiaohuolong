import React from "react";
import { message, Tabs } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./index.module.scss";
import logo from "./uploads/logo.svg";
import PwdLogin from "./PwdLogin";
import { login } from "../../store/actions/login";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.preLocation?.pathname || "/";
  console.log(from, "Login");

  const onChange = (key) => {
    console.log(key);
  };

  // 验证码登录
  const codeLogin = (codeObj) => {
    navigate("/");
    message.success("登录成功");
  };

  // 账号密码登录
  const pwdLogin = async (pwdObj) => {
    const res = await dispatch(login(pwdObj));
    console.log("🚀 ~ file: index.jsx ~ line 28 ~ pwdLogin ~ res", res);
    if (res) return;
    navigate(from, { replace: true });
  };

  return (
    <div className={styles.root}>
      <div className="loginWrapper">
        <div className="logo">
          <h1>
            <img src={logo} alt="" />
            <p>小火龙</p>
          </h1>
          <p className="info">欢迎登陆使用小火龙后台</p>
        </div>

        <Tabs
          centered
          defaultActiveKey="1"
          onChange={onChange}
          items={[
            {
              label: `账户密码登录`,
              key: "1",
              children: <PwdLogin pwdLogin={pwdLogin} />,
            },
            /* {
                            label: `手机号登录`,
                            key: '2',
                            children: <CodeLogin codeLogin={codeLogin}/>,
                        }, */
          ]}
        />
      </div>
    </div>
  );
}
