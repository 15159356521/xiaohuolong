import { Layout, Drawer, Tabs } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import Aside from "./Aside";
import Haeder from "./Header";
import { useDispatch, useSelector } from "react-redux";
import {
  saveCurrentMenuItem,
  sliceCurrentMenuItem,
} from "../../store/reducer/menuSlice";


const { Sider, Content } = Layout;

const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");

  const [isShowAside, setIsShowAside] = useState(false);
  const openDialog = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onResize = useCallback(() => {
    if (document.documentElement.clientWidth < 767) {
      setCollapsed(false);
      setIsShowAside(true);
    } else if (document.documentElement.clientWidth < 992) {
      setCollapsed(true);
      setIsShowAside(false);
    } else if (document.documentElement.clientWidth > 992) {
      setCollapsed(false);
      setIsShowAside(false);
    }
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  const aisde = JSON.parse(localStorage.getItem("Aside_menu")?localStorage.getItem('Aside_menu'):'[]');
  const [asidemenu, setAsidemenu] = useState(aisde);
  const getAside = (aside) => {
    setAsidemenu(aside);
  };

  const currentMenuItem = useSelector(
    (state) => state.menuSlice.current_Menu_Item
  );

  const [tabsMenuItem, setTabsMenuItem] = useState([]);
  useEffect(() => {
    const res = currentMenuItem.map((item) => {
      return {
        ...item,
        children: <Outlet></Outlet>,
      };
    });
    console.log(res, "heafer");
    setTabsMenuItem(res);
  }, [currentMenuItem]);

  const selectKey = useSelector((state) => state.menuSlice.selected_Menu_Item);

  // 初始化是选中侧边栏
  useEffect(() => {
    console.log("初始selectKey", selectKey);
  }, [tabsMenuItem]);

  // 为完成
  /* const location = useLocation()
	useEffect(() => {
		const pathname = location.pathname
		console.log("🚀 ~ file: index.jsx ~ line 81 ~ useEffect ~ pathname", pathname)		
		if(pathname === '') {
			
		}
	}, [location]) */

  function getParentIds(id, data) {
    // 深度遍历查找
    function dfs(data, id, parents) {
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        // 找到id则返回父级id
        if (item.id === id) return parents;
        // children不存在或为空则不递归
        if (!item.children || !item.children.length) continue;
        // 往下查找时将当前id入栈
        parents.push(item);

        if (dfs(item.children, id, parents).length) return parents;
        // 深度遍历查找未找到时当前id 出栈
        parents.pop();
      }
      // 未找到时返回空数组
      return [];
    }

    return dfs(data, id, []);
  }

  function treeFindPath(tree, func, path = []) {
    if (!tree) return [];
    for (const data of tree) {
      path.push(data.id + "");
      if (func(data)) return path;
      if (data.children) {
        const findChildren = treeFindPath(data.children, func, path);
        if (findChildren.length) return findChildren;
      }
      path.pop();
    }
    return [];
  }

  const dispath = useDispatch();
  const menuList = useSelector((state) => state.auth.menu_list);

  // 侧边栏， 顶部设置
  const [selectedkey, setSelectedkey] = useState();
  const [headerSelectedKey, setHeaderSelectedKey] = useState();
  // 点击三级进行侧边栏配置
  const onChangeTabs = (e) => {
    console.log(e, "onChangeTabs");
    const res = currentMenuItem.find((item) => item.key == e);
    console.log(res, "sdfsdfsdf");
    dispath(
      saveCurrentMenuItem({
        currentMenuItem: res,
      })
    );
    // 首页， 设置， 会员， 龙垚健康，判断
    if (res.key == 1 || res.key == 29 || res.key == 36) {
      const newLevel = menuList.find((item) => item.id == res.key);
      console.log(newLevel, "====+++++");
      setAsidemenu(newLevel.children);
      setHeaderSelectedKey(res.key + "");
    } else if (res.key == -1) {
      setAsidemenu("");
      navigate("/");
      setHeaderSelectedKey("-1");
    } else {
      let newLevel = getParentIds(res.key, menuList);
      // 根据切换Tabs设置侧边栏
      console.log(newLevel, "newLevel===========");
      setAsidemenu(newLevel[0].children);
      setHeaderSelectedKey(newLevel[0].id + "");
      // 根据当前key获取所有父级id
      let result = treeFindPath(newLevel, (node) => node.id === res.key);
      console.log(result, "result");

      setSelectedkey(result);
    }
  };
  const navigate = useNavigate();
  // 点击三级导航进行页面跳转
  const mapTss = (menus, e) => {
    menus.map((item) => {
      if (item.id == e) {
        // console.log("跳转",item.id,e,item.path);

        navigate(item.path);
      } else {
        if (item.children) {
          mapTss(item.children, e);
        }
      }
    });
  };

  const onTabClick = (e) => {
    // console.log(e,tabsMenuItem.flat(),'顶部');
    const menus = JSON.parse(localStorage.getItem("XIAOHUOLONG_APP_MENU_LIST"));
    mapTss(menus, e);
  };

  // 点击三级删除后页面选中
  const current_Menu_Item = useSelector(
    (state) => state.menuSlice.current_Menu_Item
  );
  useEffect(() => {
    console.log(current_Menu_Item, "current_Menu_Item");
    
  }, [current_Menu_Item]);
  const onEdit = (targetKey, action) => {
    console.log("删除", targetKey, action);
    let selected;
    for (let i = 0; i < current_Menu_Item.length; i++) {
      if (current_Menu_Item[i].key === targetKey) {
        if (i === current_Menu_Item.length - 1) {
          selected = current_Menu_Item[0];
        } else {
          selected = current_Menu_Item[i + 1];
        }
      }
    }

    const res = current_Menu_Item.filter((item) => item.key !== targetKey);
    console.log(res, selected, "res");
    dispath(
      sliceCurrentMenuItem({
        current_Menu_Item: res,
        selected: selected.key,

      })
    );
  };

  return (
    <Layout className={styles.root}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Drawer
          placement={placement}
          // closable={false}
          onClose={onClose}
          open={open}
          key={placement}
          width="177px"
          id="drawerWrapper"
          contentWrapperStyle={{ padding: 0 }}
        >
          <Aside
            asidemenu={asidemenu}
            selectedkey={selectedkey}
            style={{
              height: "100vh",
              position: "fixed",
              maxWidth: "177px",
              zIndex: "1000",
              top: "0px",
              left: "0px",
              overflow: "auto",
            }}
          ></Aside>
        </Drawer>
        {!isShowAside ? (
          <Aside
            asidemenu={asidemenu}
            selectedkey={selectedkey}
            style={{
              height: "100vh",
              position: "fixed",
              maxWidth: "200px",
              top: "50px",
              zIndex: "2",
              overflow: "auto",
              paddingBottom: "50px",

              "&::-webkit-scrollbar": {
                display: "none",
              },
              " -ms-overflow-style": "none",
              "scrollbar-width": "none",
              //隐藏谷歌滚动条
            }}
          ></Aside>
        ) : null}
      </Sider>

      <Layout className="site-layout">
        <Haeder
          openDialog={openDialog}
          getAside={getAside}
          headerSelectedKey={headerSelectedKey}
          clickKey={setHeaderSelectedKey}
        ></Haeder>
        <Content
          className="site-layout-background contentWrapper"
          style={{
            margin: "50px 0px",
            paddingLeft: 200,
            minHeight: 280,
            backgroundColor: "#f0f2f5",
            height: "100vh",
            color: "#000",
            display: "flex",
          }}
        >
          <Tabs
            type="editable-card"
            hideAdd
            onChange={onChangeTabs}
            activeKey={selectKey}
            onEdit={onEdit}
            style={{ width: "100%" }}
            items={tabsMenuItem}
            onTabClick={onTabClick}

            closeIcon={<CloseOutlined />}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
