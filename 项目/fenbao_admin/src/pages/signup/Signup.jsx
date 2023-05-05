import React from "react";
import { QqOutlined } from "@ant-design/icons";
import styles from "./Signup.module.scss";
import { Link } from "react-router-dom";
import {
  ProFormCheckbox,
  ProFormUploadButton,
  ProFormCaptcha,
  ProFormSelect,
  ProFormText,
  StepsForm,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { message } from "antd";
import { signUp } from "../../api/user";
import logo from "../../assets/logo.png";
const waitTime = () => {
  // 在这里提交数据
  return new Promise((resolve) => {
    // console.log("提交数据");
    resolve(false);
  });
};
export default () => {
  const [imgRoute, setImgRoute] = React.useState("");
  return (
    <div className={styles.root}>
      <div className="herder">
        <h1 className="headerLogo">
          <img src={logo} alt="小火龙视频" />
          <span>小火龙视频</span>
        </h1>
      </div>
      <StepsForm
        style={{ backgroundColor: "red" }}
        onFinish={async (values) => {
          console.log(values);
          // if (values.avatar[0].status==='error') {
          //   message.error("头像未提交成功");
          // }
          // 接收后端数据 并提示对应内容
          values.file = imgRoute;
          signUp(values)
            .then((res) => {
              console.log(res);
              if (res.code === 1) {
                message.success("注册成功");
              } else {
                message.error(res.msg);
              }
            })
            .catch((err) => {
              console.log(err);
              message.error("网络连接错误");
            });

          await waitTime();
          // message.success("提交成功");
        }}
        formProps={{
          validateMessages: {
            required: "此项为必填项",
          },
        }}
      >
        <StepsForm.StepForm
          name="base"
          className="top"
          title="注册账号"
          onFinish={async () => {
            await waitTime(2000);
            return true;
          }}
        >
          <ProFormText
            name="name"
            label="手机"
            placeholder="请填写本人手机号，该手机号作为登录账号"
            required={false}
            width="lg"
            rules={[
              {
                required: true,
                message: "请输入手机号",
              },
              {
                pattern: /^1[3456789]\d{9}$/,
                message: "手机号码格式错误",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            label="密码"
            placeholder="字母、数字或者英文符号，密码长度为6~15位，区分大小写"
            required={false}
            width="lg"
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
          <ProFormText.Password
            name="confirm"
            label="确认密码"
            placeholder="请再次输入密码"
            dependencies={["password"]}
            hasFeedback
            required={false}
            width="lg"
            rules={[
              {
                required: true,
                message: "请输入登入密码",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("两次密码不一致");
                },
              }),
            ]}
          />
          {/* 邀请码 */}
          <ProFormCaptcha
            label="邀请码"
            placeholder="请输入邀请码"
            required={false}
            width="lg"
            captchaTextRender={(timing, count) => {
              return (
                <span>
                  <QqOutlined style={{ color: "rgb(24,144,255)" }} />
                  请联系客服
                </span>
              );
            }}
            name="code"
            rules={[
              {
                required: true,
                message: "请输入邀请码！",
              },
            ]}
          />

          {/* 验证码 */}
          <ProFormCaptcha
            label="验证码"
            placeholder="请输入验证码"
            required={false}
            width="lg"
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
              // 后端发送验证
              console.log("发送验证码");
              message.success("获取验证码成功！验证码为：1234");
            }}
          />

          <ProFormCheckbox
            name="agreement"
            label="我已阅读并同意"
            required={false}
            width="lg"
            rules={[
              {
                required: true,
                message: "请阅读并同意协议",
              },
            ]}
          >
            <Link
              to={{
                pathname: "/static",
              }}
            >
              《小火龙视频用户协议》
            </Link>
          </ProFormCheckbox>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="checkbox" title="填写账号信息">
          <ProFormText name="nickname" label="昵称" width="lg" />

          <ProFormUploadButton
            name="file"
            label="头像"
            width="md"
            listType="picture-card"
            action="/sub_admin/common.Upload/uploadImage"
            max={1}
            onChange={(info) => {
              if (info.file.status === "done") {
                // Get this url from response in real world.
                console.log(info);
                setImgRoute(info.file.response.msg.url);
              }
            }}
          />
          {/* 选择视频方向*/}
          <ProFormSelect
            name="videodirection"
            label="视频方向"
            width="lg"
            options={[
              {
                value: "短视频",
                label: "短视频",
              },
              {
                value: "长视频",
                label: "长视频",
              },
            ]}
          />
          {/* 选择视频长度 */}
          <ProFormSelect
            name="often"
            label="视频长度"
            width="lg"
            options={[
              {
                value: "1-3分钟",
                label: "1-3分钟",
              },
              {
                value: "3-5分钟",
                label: "3-5分钟",
              },
              {
                value: "5-10分钟",
                label: "5-10分钟",
              },
              {
                value: "10分钟以上",
                label: "10分钟以上",
              },
            ]}
          />
          <ProFormTextArea name="introduction" label="个人简介" width="md" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="选择主体类型与信息">
          {/* 选择主体类型 */}
          <ProFormSelect
            name="type"
            label="主体类型"
            width="lg"
            required={false}
            rules={[{ required: true }]}
            options={[
              {
                value: "个人",
                label: "个人",
              },
              {
                value: "企业",
                label: "企业",
              },
            ]}
          />
          {/* 填写身份证 */}
          <ProFormText
            name="card_id"
            label="身份证号"
            width="lg"
            required={false}
            rules={[
              {
                required: true,
                message: "请输入身份证",
              },
              {
                pattern: /^[123456789]\d{17}$/,
                message: "身份证格式错误",
              },
            ]}
          />
          {/* 填写姓名 */}
          <ProFormText
            name="names"
            label="姓名"
            width="lg"
            required={false}
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  );
};
