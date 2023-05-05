import React, { useState, useEffect } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Card } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
export default function Bread() {
  const navigate = useNavigate();
  const [breadname, setBread] = useState("");
  const { pathname } = useLocation();
  useEffect(() => {
    switch (pathname) {
      case "/password":
        setBread("修改密码");
        break;
      case "/personal":
        setBread("个人信息");
        break;
      case "/detail":
        setBread("详情页");
        break;
      case "/Management/storeclassify":
        setBread("店家分类");
        break;
      case "/Management/storelist":
        setBread("店家列表");
        break;
      case "/Management/underreview":
        setBread("审核中店家");
        break;
      case "/Management/storereport":
        setBread("店家报表");
        break;
      case "/Operation/equipmentlist":
        setBread("设备列表");
        break;
      case "/Operation/withdrawals":
        setBread("提现记录");
        break;
      case "/Operation/earnings":
        setBread("收益记录");
        break;
      case "/Operation/device":
        setBread("设备报表");
        break;
      case "/Operation/promocode":
        setBread("我的推广码");
        break;
      case "/Operation/member":
        setBread("我的会员");
        break;
      case "/Operation/recharge":
        setBread("充值记录");
        break;
      default:
        setBread("主页");
        break;
    }
  }, [pathname]);
  // const handleClick = () => {
  //   navigate("/view");
  // };
  return (
    <Breadcrumb style={{ fontSize: "14px" }}>
      <Breadcrumb.Item href="#/view">
        <HomeOutlined style={{ fontSize: "20px" }} />
      </Breadcrumb.Item>

      <Breadcrumb.Item>{breadname}</Breadcrumb.Item>
    </Breadcrumb>
  );
}
