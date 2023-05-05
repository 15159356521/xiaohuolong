import React from "react";
import { Layout } from "antd";
// import logo from '../uploads/logo.svg'
import logo from "../../assets/logo.png";

// import avatar from './uploads/logo.svg'
import styles from "./Herder.module.scss";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
// import { useEffect } from 'react';

const { Header } = Layout;

export default function Haeder() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    // window.sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Header
      className={classnames("site-layout-background", styles.root)}
      style={{
        padding: 0,
        background: "rgb(255,255,254)",
      }}
    >
      <div className="logoWrapper">
        <img src={logo} alt="" className="logoPic" />
        <p className="logoInfo">小火龙视频</p>
       
      </div>
     
    </Header>
  );
}
