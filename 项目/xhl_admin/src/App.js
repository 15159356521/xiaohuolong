import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import ManageSub from "./pages/ManageSub";
import MenuManagement from "./pages/MenuManagement";
import CopyRightManager from "./pages/CopyRight/CopyRightManager";
import PlatRole from "./pages/PlatRole";
import TaskDrawer from "./pages/TaskDrawer";
import React from "react";
import RoleTable from "./pages/RoleTable";
import TaskList from "./pages/TaskList";
import ActiveList from "./pages/ActiveList";
import NewList from "./pages/NewList";
import MessagePrompt from "./pages/MessagePrompt";
import ParentAccount from "./pages/ParentAccount";
import ParentAccountCheck from "./pages/ParentAccountCheck";
import SubAccountCheck from "./pages/SubAccountCheck";
import SubAcoountList from "./pages/SubAcoountList";
import RoleGroup from "./pages/RoleGroup";
import NotFound from "./pages/NotFound";
import ParentAccountInvite from "./pages/ParentAccountInvite";
import VideoList from "./pages/VideoList";
import Yilanuser from "./pages/Yilanuser";
import Yilanfile from "./pages/Yilanfile";
import Yilanup from './pages/Yilanup'
import NeedAuth from "./components/NeedAuth";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/"
          element={
            <NeedAuth>
              <Layout />
            </NeedAuth>
          }
        >
          <Route path="/manageSub" element={<ManageSub />}></Route>
          <Route path="/menuManagement" element={<MenuManagement />}></Route>
          <Route
            path="/copyRightManager"
            element={<CopyRightManager />}
          ></Route>
          <Route path="/platRole" element={<PlatRole />}></Route>
          <Route path="/roleTable" element={<RoleTable />}></Route>
          <Route path="/taskDrawer" element={<TaskDrawer />}></Route>
          <Route path="/taskList" element={<TaskList />}></Route>
          <Route path="/activeList" element={<ActiveList />}></Route>
          <Route path="/newList" element={<NewList />}></Route>
          <Route path="/messagePrompt" element={<MessagePrompt />}></Route>
          <Route path="/parentAccount" element={<ParentAccount />}></Route>
          <Route
            path="/parentAccountCheck"
            element={<ParentAccountCheck />}
          ></Route>
          <Route path="/subAccountCheck" element={<SubAccountCheck />}></Route>
          <Route path="/subAcoountList" element={<SubAcoountList />}></Route>
          <Route path="/roleGroup" element={<RoleGroup />}></Route>
          <Route
            path="/parentAccountInvite"
            element={<ParentAccountInvite />}
          ></Route>
          <Route path="/videoList" element={<VideoList />}></Route>
          <Route path="/yilanuser" element={<Yilanuser />}></Route>
         <Route path='/yilanfile' element={< Yilanfile/>}></Route>
          <Route path="/alluploadfile" element={<Yilanup />}></Route>
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
