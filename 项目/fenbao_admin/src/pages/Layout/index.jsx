import { Layout } from "antd";
import React, { useState, useEffect } from "react";
// import { Outlet } from 'react-router-dom'
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import OverView from "../overView/OverView";
import Publish from "../creation/publish/Publish";
import Collections from "../creation/collections/Collections";
import Manage from "../manage/Manage";
import SubAccount from "../subAccount/SubAccount";
import Analysis from "../analysis/Analysis";
import AnalySis from "../settlement/analysis/AnalySis";
import Center from "../settlement/center/Center";
import Activity from "../activityCenter/activity/Activity";
import Missions from "../activityCenter/missions/Missions";
import Copyright from "../copyright/Copyright";
import Setting from "../account/setting/Setting";
import Status from "../account/status/Status";
import Right from "../account/rights/Right";
import Log from "../account/log/Log";
/* import Tast from "../ctast/Tast"; */
import styles from "./index.module.scss";
import Aside from "./Aside";
import Haeder from "./Header";
import Help from "./../account/help/Help";
import Pack from "./../activityCenter/missions/pack/Pack";
import Message from "../message/Message";
import Noticelist from "./../noticelist/Noticelist";
const { Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const openDialog = () => {
    setCollapsed(!collapsed);
  };

  // 监听窗口宽度
  useEffect(() => {
    // console.log(window.innerWidth);
    if (window.innerWidth < 467) {
      // console.log(5);
      setCollapsed(true);
    } else {
      // console.log(window.innerWidth);
      setCollapsed(false);
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth < 467) {
        // console.log(5);
        setCollapsed(true);
      } else {
        // console.log(window.innerWidth);
        setCollapsed(false);
      }
    });
  }, []);

  return (
    <Layout className={styles.root}>
      <Haeder openDialog={openDialog}></Haeder>
      <Sider
        style={{
          overflow: "auto",
          height: "95vh",
          position: "fixed",
          left: 0,
          top: 200,
          bottom: 0,
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Aside
          className="aside"
          style={{
            height: "93vh",
            position: "fixed",
            maxWidth: "300px",
            top: "65px",
            zIndex: "1000",
            // 隐藏滚动条
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            //  隐藏谷歌滚动条

            overflowX: "hidden",
            // 隐藏谷歌滚动条
            "&::webkitScrollbar": {
              display: "none",
              width: 0,
            },
          }}
        ></Aside>
      </Sider>

      <Layout className="site-layout">
        <Content className="site-layout-background contentWrapper">
          {/* <Outlet /> */}
          <Routes>
            {localStorage.getItem("token") !== null ? (
              <>
                <Route path="/creation/publish" element={<Publish />}></Route>
                <Route
                  path="/creation/collections"
                  element={<Collections />}
                ></Route>
                {/* 跳转主页 */}
                <Route path="/overview" element={<OverView />} />
                {/* 跳转管理 */}
                <Route path="/manage" element={<Manage />} />
                {/* 跳转子账号管理 */}
                <Route path="/subAccount" element={<SubAccount />} />
                {/* 数据 */}
                <Route path="/analysis" element={<Analysis />} />
                {/* 收益 */}
                <Route path="/settlement/analysis" element={<AnalySis />} />
                <Route path="/settlement/center" element={<Center />} />
                {/* 活动中心 */}
                <Route path="/activity" element={<Activity />} />

                <Route path="/missions" element={<Missions />} />

                <Route path="/pack/:id" element={<Pack />} />

                {/* 版权中心 */}
                <Route path="/copyright" element={<Copyright />} />
                {/* <Route path='/resourcelist' */}
                {/* 设置 */}
                <Route path="/account/setting" element={<Setting />} />
                <Route path="/account/status" element={<Status />} />
                <Route path="/account/right" element={<Right />} />
                <Route path="/account/log" element={<Log />} />
                <Route path="/account/help" element={<Help />} />
              {/*   <Route path="/cs" element={<Tast />} /> */}
                <Route path="/message" element={<Message />} />
                {/* 公式页面 */}
                <Route path="/noticelist" element={<Noticelist />} />
                {/* 重定向到主页 */}
                <Route path="*" element={<Navigate to="/overview" />} />
                {/* <Route
                  path="*"
                  element={<Navigate replace from="/" to="overview" />}
                /> */}
              </>
            ) : (
              // console.log('asdfasf')
              <Route
                path="/*"
                element={<Navigate replace from="/*" to="login" />}
              />
              //   navigator('/login')
            )}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
