import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import React from "react";
import styles from "./index.module.scss";
import classnames from "classnames";

import { useNavigate } from "react-router-dom";

import { LoginApi } from "../../utils/api";

export default function StoreLogin() {
  const store_id = 1;
  const navigate = useNavigate();
  const onFinish = (values) => {
    LoginApi({
      store_id,
      username: values.username,
      password: values.password,
    }).then((res) => {
      console.log(res.data);
      if (res.data.code === 1) {
        message.success(res.data.msg);
        // 存储数据
        localStorage.setItem("class", res.data.data.class);
        localStorage.setItem("real_name", res.data.data.real_name);
        localStorage.setItem("id", res.data.data.id);
        // localStorage.setItem("token", res.data.token);
        // localStorage.setItem("nickname", res.data.data.nickname);
        // localStorage.setItem("thumb", res.data.data.thumb);

        // localStorage.setItem("login_time", res.data.data.login_time);
        // localStorage.setItem("create_time", res.data.data.create_time);
        setTimeout(() => {
          navigate("/view");
          window.location.reload();
        }, 1500);
      } else {
        message.error(res.data.msg);
      }
    });
  };

  const handleClickLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.root}>
      <div className="login">
        <div className="logn-bbox">
          <div className="login-box">
            <h1
              style={{
                textAlign: "center",
              }}
            >
              店家后台
            </h1>
            <Form
              name="basic"
            
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: false, message: "Please input your username!" },
                ]}
              >
                <Input
                  placeholder="请输入账号"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: false, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  placeholder="请输入密码"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>记住账号</Checkbox>
                <a
                  onClick={handleClickLogin}
                  style={{ float: "right", fontSize: "16px" }}
                >
                  服务商后台
                </a>
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
