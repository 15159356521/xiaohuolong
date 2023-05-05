import React, { useState, useEffect } from "react";
import styles from "./Setting.module.scss";
import xhl from "../../../assets/xhl.png";
import { Modal, Form, Input, Button } from "antd";
import { ProFormCaptcha } from "@ant-design/pro-components";

import { useRef } from "react";

export default function Setting() {
  // 模拟数据
  const account = {
    nickname: "blue",
    direction: "不限",
    length: "40~300秒",
    type: "个人",
    idcard: "350******45646",
    name: "高**",
  };
  const [token, setToken] = useState();
  const [phone, setPhone] = useState();
  const [id, setId] = useState();
  useEffect(() => {
    let token1 = localStorage.getItem("token");
    let phone1 = localStorage.getItem("phone");
    let id1 = localStorage.getItem("Id");
    setToken(token1);
    setPhone(phone1);
    setId(id1);
  });

  // 弹出框的功能模块
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // const [password, setpassword] = useState("000000");
  const showModal = () => {
    setOpen(true);
  };

  // 修改密码点击确认获取返回值
  const formRef = useRef();
  const handleOk = async () => {
    // setModalText(password);
    console.log(formRef, "asdfasf");
    const files = await formRef.current.validateFields();
    // 校验对比两个密码是否相等
    if (files.oldPassword === files.newPassword) {
      console.log("修改成功");
    } else {
      console.log("修改失败");
    }
    console.log(files);

    //
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    // console.log("取消");
    setOpen(false);
  };

  // 重置功能
  function handDel() {
    // let result = window.confirm("是否重置！");

    // if (result) {
    //   alert("重置成功！");
    // } else {
    //   alert("不重置！");
    // }

    Modal.confirm({
      title: "重置账号信息",
      content: "确认重置app_id和app_token？",
      okText: "确认",
      cancelText: "取消",
    });
  }

  return (
    <div className={styles.root}>
      <div className="father">
        {/* 登录账号 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            登录账号
          </label>
          <div className="maintab">
            <a onClick={showModal} href>
              修改密码
            </a>

            <Modal
              title="修改密码"
              open={open}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              cancelText={"取消"}
              okText={"确认"}
              style={{ marginTop: "200px" }}
            >
              <Form ref={formRef}>
                <Form.Item
                  label="旧密码"
                  name="oldPassword"
                  // onFinish={handleOk}
                  required={false}
                  rules={[{ required: true, message: "请输入你的旧密码" }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="新密码"
                  name="newPassword"
                  required={false}
                  rules={[{ required: true, message: "请输入你的新密码" }]}
                >
                  <Input.Password />
                </Form.Item>
                已绑定:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <label>{phone}</label>
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
              </Form>
            </Modal>
          </div>
          <div>
            <span className="mainfl">{phone}</span>
          </div>
        </div>
        {/* 账号ID */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            账号ID
          </label>
          <div>
            <span className="mainfl">{id}</span>
          </div>
        </div>

        {/* APP_token */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            APP_token
          </label>
          <div>
            <span className="mainfl">{token}</span>
            <span className="tokenclass">
              <a onClick={handDel} href>
                重置
              </a>

              <a href="JavaScript">接口文档</a>
            </span>
          </div>
        </div>
        {/* APP_id */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            app_id
          </label>
          <div>
            <span className="mainfl">55445456465499</span>
          </div>
        </div>
        {/* 账号名称 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            账号名称
          </label>
          <div>
            <span className="mainfl">{account.nickname}</span>
          </div>
        </div>
        {/* 视频方向 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            视频方向
          </label>
          <div>
            <span className="mainfl">不限</span>
          </div>
        </div>
        {/* 视频长度 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            视频长度
          </label>
          <div>
            <span className="mainfl">40~300秒</span>
          </div>
        </div>
        {/* 账号头像 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            账号头像
          </label>
          <div>
            <img src={xhl} alt="账号头像" />
            <p>
              尺寸200X200像素,能代表个人、机构或品牌形象,<br></br>
              请勿使用低俗图片、二维码、其他机构企业等涉嫌误导用户的头像
            </p>
          </div>
        </div>
        {/* 主体类型 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            主体类型
          </label>
          <div>
            <span className="mainfl">个人</span>
          </div>
        </div>

        {/* 主体信息 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            主体信息
          </label>

          <div className="msg">
            <div>
              <span>
                主体信息: &nbsp; &nbsp; &nbsp; &nbsp;<span>{account.name}</span>{" "}
              </span>
            </div>
            <div>
              <span className="span">
                身份证号码: &nbsp; &nbsp; &nbsp; &nbsp;
                <spann style={{ color: "#8a939e" }}>{account.idcard}</spann>
              </span>
            </div>
          </div>
        </div>

        {/* 账号名称 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            账号名称
          </label>
          <div>
            <span className="mainfl">2894424</span>
          </div>
        </div>
        {/* 所在地 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            所在地
          </label>
          <div>
            <span className="mainfl">福州</span>
          </div>
        </div>
        {/* 联系人 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            联系人
          </label>
          <div>
            <span className="mainfl">高**</span>
          </div>
        </div>
        {/* 联系电话 */}
        <div className="main">
          <label htmlFor="" className="labellogin">
            联系电话
          </label>
          <div>
            <span className="mainfl">13***4424</span>
          </div>
        </div>
      </div>
    </div>
  );
}
