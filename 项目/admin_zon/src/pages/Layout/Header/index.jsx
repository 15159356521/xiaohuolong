import React, { useEffect, useState } from "react";
import { Layout, Menu, message, Modal, Avatar  } from "antd";
import logo from "./uploads/logo.png";
import {
  MenuFoldOutlined,
  SnippetsOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import avatar from "./uploads/logo.png";
import styles from "./index.module.scss";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/reducer/authSlice";
import { useLogoutFnMutation } from "../../../store/api/authApi";
import { 
  saveCurrentMenuItem,
  saveSelectedMenuItem,
} from "../../../store/reducer/menuSlice";
const { Header } = Layout;
const menus = JSON.parse(localStorage.getItem("XIAOHUOLONG_APP_MENU_LIST"));
export default function Haeder(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const username = useSelector((state) => state.auth.user_info?.name);

  const [logoutFn, res] = useLogoutFnMutation();
  const { openDialog,clickKey } = props;

  const showDrawer = () => {
    openDialog();
     clickKey();
  };

  const handlerOk = async () => {
    window.localStorage.clear();
    dispatch(
      saveSelectedMenuItem({
        keys: -1,
      })
    );
    await logoutFn();
    dispatch(logout());
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

  const headerMenu = useSelector((state) => state.auth.menu_list) || [];
  const bindHeadMenu = (data) => {
    if (!data) return;
    const res = [{ key: -1, label: "首页" }];
    data?.forEach((item) => {
      res.push({
        key: item.id,
        label: item.title,
      });
    });
    return res;
  };
  const [menuList, setMenuList] = useState([]);
  useEffect(() => {
    if (headerMenu.length === 0) return;
    const menus = bindHeadMenu(headerMenu);
    setMenuList(menus);
  }, [headerMenu]);

  const changeAside = (e) => {
    const res = headerMenu.find((item) => item.id == e.key);
    props.getAside(res?.children);

    const currentRole = menuList.find((item) => {
      console.log(item.key, e.key, "---------");
      return item.path == e.path;
    });
    if(e.key==-1){
      navigate("/");
    }else{
          menus.map((item) => {
      if (item.id == e.key) {
        //  console.log("跳转", item.children[0].children?item.children[0].children[0].path:item.children[0].path);
        console.log("跳转", item);
        navigate(
          item.children[0].children
            ? item.children[0].children[0].path
            : item.children[0].path
        );
       clickKey(item.children[0].children?item.children[0].children[0].id:item.children[0].id)
        localStorage.setItem("Aside_menu", JSON.stringify(res.children));
      } 
    });
    }

  

    // dispatch(
    //   saveCurrentMenuItem({
    //     currentMenuItem: currentRole,
    //   })
    // );
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
        <p className="logoInfo">龙垚后台管理系统</p>
        <MenuFoldOutlined className="trigger" onClick={showDrawer} />
        <Menu
          onClick={changeAside}
          className="menu"
          theme="dark"
          mode="horizontal"
          selectedKeys={props.headerSelectedKey}
          items={menuList}
        />
      </div>
      <div className="leftWrapper">
        {/* <SnippetsOutlined className="icon" /> */}
        {/* <img src={avatar} alt="" /> */}
        <Avatar src={avatar} />
        <span className="username" >{username}</span>

        <a  onClick={handlerLogout}>
          退出
        </a>
      </div>
    </Header>
  );
}
