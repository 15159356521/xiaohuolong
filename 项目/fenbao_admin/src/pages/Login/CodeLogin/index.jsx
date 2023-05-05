import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { Button, Checkbox, Form, Input, Row } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import OhterLoign from "../../../components/OtherLogin";
import styles from "./index.module.scss";
import axios from "axios";

export default function CodeLogin() {
  const [loading, setLoading] = useState(false);
  const [autoLogin, setAutoLogin] = useState(true);
  const onFinish = (values) => {
    values.upload.forEach((item, index) => {
      if (item.status === "error") {
        console.log(1);
        return;
      } else if (values.cover[0].status === "error") {
        console.log(2);
        return;
      } else {
        console.log(values);
      }
    }, []);
  };

  return (
    <Form className={classnames("form", styles.root)} onFinish={onFinish}>
      <Form.Item
        name="phone"
        rules={[
          {
            required: true,
            message: "手机号不能为空!",
          },
        ]}
      >
        <Input
          placeholder="请输入手机号！"
          prefix={<UserOutlined className="site-form-item-icon" />}
        />
      </Form.Item>

      <Form.Item
        name="code"
        rules={[
          {
            required: true,
            message: "请输入验证码！",
          },
        ]}
      >
        <Row className="codeRow">
          <Input
            className="codeInput"
            placeholder="请输入验证码"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
          <Button className="codeBtn" loading={loading}>
            获取验证码
          </Button>
        </Row>
      </Form.Item>

      <Form.Item className="autoLogin">
        <Checkbox checked={autoLogin}>自动登录</Checkbox>
        <a style={{ float: "right" }}>忘记密码？</a>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>

      <OhterLoign />
    </Form>
  );
}
