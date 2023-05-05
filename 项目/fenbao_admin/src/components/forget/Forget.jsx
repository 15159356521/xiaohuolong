import React from "react";
// import {Form,Button } from 'antd';
import {
  ProForm,
  ProFormCaptcha,
  ProFormText,
} from "@ant-design/pro-components";

export default function Forget() {
  return (
    <ProForm
      onFinish={async (values) => {
        console.log(values);
      }}
    >
      <ProFormText
        name="username"
        fieldProps={{
          size: "large",
        }}
        placeholder={"请输入手机号"}
        rules={[
          {
            required: true,
            message: "请输入手机号!",
          },
        ]}
      />
      <ProFormCaptcha
        fieldProps={{
          size: "large",
        }}
        captchaProps={{
          size: "large",
        }}
        placeholder={"请输入验证码"}
        captchaTextRender={(timing, count) => {
          if (timing) {
            return `${count} ${"获取验证码"}`;
          }
          return "获取验证码";
        }}
        name="captcha"
        rules={[
          {
            required: true,
            message: "请输入验证码！",
          },
        ]}
        onGetCaptcha={async () => {
          console.log(1);
        }}
      />
      <ProFormText.Password
        name="password"
        placeholder="字母、数字或者英文符号，密码长度为6~15位，区分大小写"
        required={false}
        fieldProps={{
          size: "large",
        }}
        rules={[
          {
            required: true,
            message: "请输入登入密码",
          },
          {
            pattern: /^[a-zA-Z0-9]{6,15}$/,
            message: "密码格式错误",
          },
        ]}
      />
    </ProForm>
  );
}
