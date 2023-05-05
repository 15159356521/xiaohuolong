// import styles from './index.module.scss'
import React, { useState } from "react";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  ScissorOutlined,
  AreaChartOutlined,
  VideoCameraOutlined,
  DollarOutlined,
  ExceptionOutlined,
  GlobalOutlined,
  SettingOutlined,
  PartitionOutlined,
} from "@ant-design/icons";

// import routes from "./json/routes.json";
import { useEffect } from "react";
// console.log(routes);


const iconsArr = [
  HomeOutlined,
  ScissorOutlined,
  VideoCameraOutlined,
  PartitionOutlined,
  AreaChartOutlined,
  DollarOutlined,
  ExceptionOutlined,
  GlobalOutlined,
  SettingOutlined,
];


export default function Aside(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dekey, setDeksy] = useState("");
  const [menu, setMenu] = useState(JSON.parse(localStorage.getItem('menu')));
  const changeMenu = (e) => {
    // console.log(e)
    navigate(e.key);
  };
  let defaultedKeys = "";
  if (location.pathname === "/overview") {
    defaultedKeys = "/overview";
  } else {
    defaultedKeys = location.pathname;
  }
  useEffect(() => {
    // console.log(location.pathname)
    setDeksy(defaultedKeys);
    // console.log(defaultedKeys);
  }, [location.pathname]);

const items = menu.map((item, index) => {
  return {
    key: item.key ? item.key : item.id,
    icon: React.createElement(iconsArr[index]),
    label: item.permission,
    children: item.children
      ? item.children.map((chilItem, j) => {
          return {
            key: chilItem.key,
            label: chilItem.permission,
          };
        })
      : null,
  };
});
  return (
    <Menu
      // className={styles.root}
      style={{ overflowY: "auto" }}
      onClick={changeMenu}
      theme="white"
      mode="inline"
      inlineCollapsed={true}
      className="menuWrapper"
      selectedKeys={dekey}
      defaultOpenKeys={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
      {...props}
      items={items}
    />
  );
}
