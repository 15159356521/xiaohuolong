import React, { useState } from "react";
import { Layout, message, Modal } from "antd";
import logo from "../uploads/logo.svg";
import {
  MenuFoldOutlined,
  SnippetsOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import avatar from "./uploads/logo.svg";
import styles from "./index.module.scss";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/actions/login";

const { Header } = Layout;
const user=JSON.parse( localStorage.getItem('xhl_userInfo'))
export default function Haeder(props) {
  const { name } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { openDialog } = props;
  const showDrawer = () => {
    openDialog();
  };

  const handlerOk = async () => {
    await dispatch(logout());
    window.localStorage.clear();
    navigate("/login");
    message.success("退出登录成功");
  };

  const handlerLogout = () => {
    Modal.confirm({
      title: "确定退出吗?",
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: handlerOk,
    });
  };

  return (
    <Header
      className={classnames("site-layout-background", styles.root)}
      style={{
        padding: 0,
        background: "#000",
      }}
    >
      <div className="logoWrapper">
        <img src={logo} alt="" className="logoPic" />
        <p className="logoInfo">小火龙后台管理系统</p>
        <MenuFoldOutlined className="trigger" onClick={showDrawer} />
      </div>
      <div className="leftWrapper">
        <SnippetsOutlined className="icon" />
        <img src={avatar} alt="" />
        <p className="username">{console.log(user)}{user.name}</p>

        <a href="#" onClick={handlerLogout}>
          退出
        </a>
      </div>
    </Header>
  );
}
