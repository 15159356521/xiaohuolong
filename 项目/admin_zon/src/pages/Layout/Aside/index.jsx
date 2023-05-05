import React, { useState, useEffect } from "react";
import { Menu, message } from "antd";
import { useNavigate, Link } from "react-router-dom";

import { TableOutlined } from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { saveCurrentMenuItem } from "../../../store/reducer/menuSlice";

export default function Aside(props) {
  const navigate = useNavigate();

  console.log(JSON.parse(localStorage.getItem("Aside_menu")), "][[[[");

  const bindMenuItem = (tree, res = []) => {
    if (!tree || tree.length === 0) return;
    tree.map((item) => {
      if (item.children && item.children.length > 0) {
        res.push({
          key: item.id,
          label: item.title,
          children: [...bindMenuItem(item.children)],
        });
      } else {
        res.push({
          key: item.id,
          label: item.title,
        });
      }
    });
    return res;
  };
const [select,setSelect]=useState(localStorage.getItem("XIAOHUOLONG_APP_SELECT_MENU_ITEM"))
  const [aside, setAside] = useState([]);
  useEffect(() => {
    let res = bindMenuItem(props.asidemenu);
    setAside(res);
  }, [props.asidemenu]);
useEffect(()=>{
setSelect(localStorage.getItem("XIAOHUOLONG_APP_SELECT_MENU_ITEM"))
},[localStorage.getItem("XIAOHUOLONG_APP_SELECT_MENU_ITEM")])

  function platFn(list) {
    let res = [];
    res = list.concat(
      ...list
        .map((item) => {
          if (item.children instanceof Array && item.children.length > 0) {
            return platFn(item.children);
          }
          return null;
        })
        .filter((o) => o instanceof Array && o.length > 0)
    );
    return res;
  }

  // 点击二级侧边栏切换路由
  const mapTss = (menus, e) => {
    // console.log('mapTss',JSON.parse(localStorage.getItem("XIAOHUOLONG_APP_MENU_LIST")))

    // 数组扁平化menus
    menus.map((item) => {
      // console.log('item',item);
      if (item.id == e) {
        console.log("跳转", item.id, e, item.path);
        navigate(item.path);
      } else {
        if (item.children) {
          mapTss(item.children, e);
        }
      }
    });
  };
  const dispatch = useDispatch();
  const changeMenuItem = (e) => {
    var platList = platFn(aside);
    const res = platList.find((item) => item.key == e.key);
    console.log(res, "侧边栏");
    dispatch(
      saveCurrentMenuItem({
        currentMenuItem: res,
      })
    );
    const menus = JSON.parse(localStorage.getItem("XIAOHUOLONG_APP_MENU_LIST"));
    mapTss(menus, e.key);
  };
  return (
    <>
      {!props.asidemenu || props.asidemenu.length === 0 ? (
        <Menu
          theme="dark"
          mode="inline"
          className="noAside"
          // defaultSelectedKeys={['6']}
          // defaultOpenKeys={['1', '2']}
          {...props}
          items={[
            { label: "暂无侧边栏", key: "item-1", icon: <TableOutlined /> },
          ]}
        />
      ) : (
        <Menu
          theme="dark"
          mode="inline"
          className="menuWrapper"
          // defaultSelectedKeys={['6']}
          // defaultOpenKeys={['1', '2']}
          openKeys={[
            "1",
            "2",
            "3",
            "5",
            "7",
            "29",
            "33",
            "36",
            "37",
            "50",
            "82",
            "94"
          ]}
          selectedKeys={select}
          onClick={changeMenuItem}
          {...props}
          items={aside}
        />
      )}
    </>
  );
}
