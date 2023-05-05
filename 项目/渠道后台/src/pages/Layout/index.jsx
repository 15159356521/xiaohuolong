import { Layout, Menu, message } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import routes from "./json/router.json";
import Bread from "../../components/Bread";
import { Logout, StoreHomeApi } from "../../utils/api";
import { getstore_id } from "../../utils/store_id";
const { Header, Sider, Content, Footer } = Layout;

const LayoutComponent = () => {
  const id = localStorage.getItem("id");
  const store_id = getstore_id();
  const navigate = useNavigate();
  // const location = useLocation;
  // const [avatar, setAvatar] = useState();
  const [nickname, setNickname] = useState("游客");
  const [collapsed, setCollapsed] = useState(false);
  const [defaultkey, setDefaultkey] = useState("");
  const [item, setItem] = useState(null);

  // useEffect(() => {
  //   let path = location.pathname;
  //   let key = path.split("/")[1];
  //   setDefaultkey(key);
  // }, [location.pathname]);
  useEffect(() => {
    StoreHomeApi({ id, store_id }).then((res) => {
      console.log(res.data.data);
    });
    // window.location.reload();
    // debugger;
    // console.log("===========================================");
    let real_name1 = localStorage.getItem("real_name");
    if (real_name1) {
      setNickname(real_name1);
    }

    // window.location.reload();
    const items = routes.map((item, index) => {
      if (store_id) {
        if (item.permission == "店家管理") {
          return true;
        }
        return {
          key: item.key ? item.key : item.id,
          // icon: React.createElement(iconsArr[index]),
          label: item.permission,
          children: item.children
            ? item.children.map((chilItem, j) => {
                if (chilItem.permission == "我的推广码") {
                  return;
                }
                return {
                  index,
                  key: chilItem.key,
                  label: chilItem.permission,
                };
              })
            : null,
        };
      } else {
        // if (item.permission == "店家管理") {
        //   return;
        // }
        return {
          key: item.key ? item.key : item.id,
          // icon: React.createElement(iconsArr[index]),
          label: item.permission,
          children: item.children
            ? item.children.map((chilItem, j) => {
                if (chilItem.permission == "我的会员") {
                  return;
                }
                if (chilItem.permission == "充值记录") {
                  return;
                }
                return {
                  index,
                  key: chilItem.key,
                  label: chilItem.permission,
                };
              })
            : null,
        };
      }
    });

    setItem(items);
  }, [store_id]);
// 监听网页宽度设置
  // 退出登录
  const class_id = localStorage.getItem("class");
  const handleClick = () => {
    Logout();
    // window.localStorage.removeItem("token");
    message.success("请稍等,正在退出");
    window.localStorage.clear();
    setTimeout(() => navigate("/login"), 1000);
  };
  const showDrawer = () => {
   setCollapsed(pre=>{
    return !pre
   })
  };
  const handleClickMenu = (e) => {
    console.log(e.key);
    navigate(e.key);
    setDefaultkey(e.key);
  };

  return (
    <>
      <Layout className={styles.root}>
        <Sider  breakpoint="lg" className="site-layout-background" collapsedWidth="0"     onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}>
          <Sider >
          
              <h1
              style={{
                fontSize: "20px",
                marginLeft: "20px",
                padding: "15px",
                color: "#009688",
              }}
            >
              {class_id ? "店家后台" : "服务商后台"}
            </h1>
            <Menu
              onClick={handleClickMenu}
              theme="dark"
              mode="inline"
              // selectedKeys={[defaultkey]}
              defaultSelectedKeys={["1.1"]}
              defaultOpenKeys={["1", "2", "3"]}
              style={{
                height: "100%",
              }}
              items={item}
            />
           
            
          </Sider>
        </Sider>

        <Layout className="content">
          <Header className="layout-header">
          {/* <MenuFoldOutlined className="trigger" onClick={showDrawer} /> */}
            <div style={{ display: "flex", float: "right" }}>
              {/* <img src={thumb} alt="头像" style={{ marginRight: "20px" }} /> */}
             
              <p style={{ marginRight: "20px" }}>{nickname}</p>
              <a onClick={handleClick}> 退出 </a>
            </div>
          </Header>

          <Content>
            <div className="box">
              <div className="layout-bread">
                <Bread />
              </div>{" "}
              <Outlet></Outlet>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default LayoutComponent;
