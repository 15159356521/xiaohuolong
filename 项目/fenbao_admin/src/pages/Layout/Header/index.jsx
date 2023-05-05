import React, { useState, useEffect } from "react";
import { Layout,Modal } from "antd";
// import logo from '../uploads/logo.svg'
import logo from "../../../assets/logo.png";
import { MenuFoldOutlined, MessageOutlined } from "@ant-design/icons";
// import avatar from './uploads/logo.svg'
import styles from "./index.module.scss";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
// import { useEffect } from 'react';
import {logout} from '../../../api/user'
const { Header } = Layout;

export default function Haeder(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("游客");
  useEffect(() => {
    let name1 = localStorage.getItem("name");
    //  console.log(name1, "name1");
    if (name1) {
      setName(name1);
    }
  }, []);

  const navigate = useNavigate();
  const { openDialog } = props;
  const showDrawer = () => {
    openDialog();
  };

  const handleOk = () => {
    console.log(6);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleClick = () => {
    navigate("/message");
  };
  const confirm = () => {
    Modal.confirm({
      title: '您是否要退出登录',
      // content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        window.localStorage.clear();
        logout()
        navigate("/login");
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };
  return (
    <Header
      className={classnames("site-layout-background", styles.root)}
      style={{
        padding: 0,
        background: "rgb(0,184,254)",
        height:70,
      }}
    >
      <div className="logoWrapper">
        <img src={logo} alt="" className="logoPic" />
        <p className="logoInfo">小火龙视频</p>
        <MenuFoldOutlined className="trigger" onClick={showDrawer} />
      </div>
      <div className="leftWrapper">

        <p className="logout" onClick={confirm}>
          退出
        </p>
        <p className="lever">拆条 LV.1</p>
        <p >{name}</p>
        <MessageOutlined
          style={{ fontSize: "20px", paddingRight: "20px" }}
          onClick={handleClick}
        />


      </div>
    </Header>
  );
}
