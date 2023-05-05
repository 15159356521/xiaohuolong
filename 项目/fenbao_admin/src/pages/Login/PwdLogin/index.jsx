import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, Modal,message } from "antd";
import classnames from "classnames";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login,getEquipment } from "../../../api/user";
import styles from "./index.module.scss";
import{useDispatch,useSelector} from 'react-redux'
// import OhterLoign from "../../../components/OtherLogin";
import {add} from '../../../store/modules/counter'
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import Forget from "./../../../components/forget/Forget";

export default function PwdLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [autoLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

const dispatch = useDispatch()
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  const showModal = () => {
    setOpen(true);
  };
  const onFinish = (values) => {
    // setLoading(false);
    // 查看登入的设备型号
let equipment = navigator.userAgent;
  // console.log(navigator.userAgent);
      if(equipment.indexOf('Windows') > -1){
console.log('Windows');
equipment=("电脑设备")
      }else if(equipment.indexOf('Android') > -1){
        equipment=("安卓设备")
      }else if(equipment.indexOf('iPhone') > -1){
        equipment=("苹果设备")
      }else if(equipment.indexOf('iPad') > -1){
        equipment=("平板")
      }

// 获取ip地址


    console.log("Success:", values);

    setLoading(true);
    values.equipment=equipment

    login(values)
      .then(function (response) {
        // console.log("response: ", response);
        
        dispatch(add(response.data))

        if (response.code === 1) {
          setTimeout(() => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("Id", response.data.id);
          localStorage.setItem("recognize", response.data.recognize);
          localStorage.setItem("videodirection", response.data.videodirection);
          localStorage.setItem("often", response.data.often);
          localStorage.setItem("avatar", response.data.avatar);
          localStorage.setItem("type", response.data.type);
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("phone", response.data.phone);
          localStorage.setItem("card_id", response.data.card_id);
          localStorage.setItem("menu", JSON.stringify(response.data.contr) );
          console.log(response.data.ip);
          const data={equipment,login_time:response.data.login_time,ip:response.data.ip}
          getEquipment(data).then(res=>{
            console.log(res);
          })
          
          navigate("/");
message.success("登录成功");
          }, 500);
          //  console.log(1);
        } else {
          console.log(response);
          alert("账号或密码错误");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert("网络连接错误");
      });
  };
  const register = () => {
    navigate("/signup");
    console.log("注册");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const autoLoginFn = () => {};
  return (
    <Form
      className={classnames("form", styles.root)}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: "用户名不能为空!",
          },
        ]}
      >
        <Input
          placeholder="用户名: 19959792786"
          prefix={<UserOutlined className="site-form-item-icon" />}
        />
      </Form.Item>

      <Form.Item
        name="pwd"
        rules={[
          {
            required: true,
            message: "密码不能为空",
          },
        ]}
      >
        <Input.Password
        autocomplete="off"
          placeholder="密码:19959792786"
          prefix={<LockOutlined className="site-form-item-icon" />}
        />
      </Form.Item>

      <Form.Item className="autoLogin">
        <Checkbox checked={autoLogin} onChange={autoLoginFn}>
          自动登录
        </Checkbox>
        <a style={{ float: "right" }} onClick={showModal}>
          忘记密码？
        </a>
        <Modal
          title="忘记密码"
          open={open}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          footer={null}
        >
          <Forget />
        </Modal>
      </Form.Item>

      <Form.Item>
        <div>
          <Button
            style={{ width: "48%" }}
            block
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            登录
          </Button>
          <Button
            style={{ width: "48%" }}
            block
            type="primary"
            onClick={register}
          >
            注册
          </Button>
        </div>
      </Form.Item>
      {/* 其他登入方式 */}
      {/* <OhterLoign /> */}
    </Form>
  );
}
