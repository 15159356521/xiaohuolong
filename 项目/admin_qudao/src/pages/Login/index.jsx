import { LockOutlined, UserOutlined, FileOutlined } from "@ant-design/icons";
import { Avatar, Button, Checkbox, Form, Input, message } from "antd";
import React from "react";
import styles from "./index.module.scss";
import classnames from "classnames";

import { Link, useNavigate } from "react-router-dom";

import { LoginApi } from "../../utils/api";
import axios from "axios";
export default function Login() {
  const navigate = useNavigate();
  const onFinish = (values) => {
    LoginApi({
      username: values.username,
      password: values.password,
    }).then((res) => {
      console.log(res.data.code);
      if (res.data.code === 1) {
        message.success(res.data.msg);
        // 存储数据
        localStorage.setItem("real_name", res.data.data.real_name);
        localStorage.setItem("id", res.data.data.id);
        setTimeout(() => {
          navigate("/view");
          window.location.reload();
        }, 1500);
      } else {
        message.error(res.data.msg);
      }
    });
  };

  const handleClickStore = () => {
    navigate("/storeLogin");
  };

  return (
    <div className={styles.root}>
      <div className="login">
        <div className="logn-abox">
          <div className="login-box">
            <h1
              style={{
                textAlign: "center",
              }}
            >
              服务商后台
            </h1>
            <Form name="basic" onFinish={onFinish} autoComplete="off">
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入您的账号!" }]}
              >
                <Input
                  placeholder="账号"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入您的密码!" }]}
              >
                <Input.Password
                  placeholder="密码"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              {/* <div className="code">
              <Form.Item
                className="code"
                name="code"
                rules={[
                  { required: true, message: "请输入验证码" },
                  // { len: 4, message: "验证码长度不符合要求" },
                ]}
              >
                <Input prefix={<FileOutlined />} placeholder="请输入验证码" />
              </Form.Item>
              <img src="" />
            </div> */}

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>记住账号</Checkbox>
                <a
                  onClick={handleClickStore}
                  style={{ float: "right", fontSize: "16px" }}
                >
                  店家后台
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
