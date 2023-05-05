import React from "react";

import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

// import AdminSand from "../views/admin/adminSand";
// import Login from "../views/login/Login";
import Login from "./../pages/Login/index";
import Layout from "../pages/Layout";
import Message from "./../pages/message/Message";
import Notice from "../pages/noticelist/notice/Notice";
import Signup from "./../pages/signup/Signup";
import Static from "../pages/static/Static";

import View from "./../pages/view/View";
import Views from "./../pages/views/Views";
import Pack from "./../pages/activityCenter/missions/pack/Pack";

import Watch from "../pages/manage/watch/Watch";

export default function indexRouter() {
  return (
    <HashRouter>
      <Routes>
        {console.log(localStorage.getItem("token"))}

        <Route path="/login" element={<Login />} />
        {/* <Route path="/" component={adminSand} /> */}
        <Route path="/*" element={<Layout />} />

        {/* 消息通知 */}

        <Route path="packs" element={<Pack />} />

        <Route path="/message" element={<Message />} />

        <Route path="/notice/:type/:id" element={<Notice />} />
        {/* 注册账号 */}
        <Route path="/signup" element={<Signup />} />
        {/* 服务条框 */}
        <Route path="/static" element={<Static />} />

        {/* 任务详情*/}
        <Route
          path="/view/:id"
          element={
            localStorage.getItem("token") ? <View /> : <Navigate to="/login" />
          }
        />
          <Route
          path="/views/:id"
          element={
            localStorage.getItem("token") ? <Views/> : <Navigate to="/login" />
          }
        />
        {/* <Route path="/*" element={localStorage.getItem("token")?<Layout/> : <Navigate to="/login"/>} /> */}
        <Route
          path="/watch/:id"
          element={
            localStorage.getItem("token") ? <Watch /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </HashRouter>
  );
}
