import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Personal from "./pages/Personal";
import Password from "./pages/Password";
import Storeclassify from "./pages/Management/Storeclassify";
import Storelist from "./pages/Management/Storelist";
import Storereport from "./pages/Management/Storereport";
import Underreview from "./pages/Management/Underreview";
import Equipmentlist from "./pages/Operation/Equipmentlist";
import Earnings from "./pages/Operation/Earnings";
import Member from "./pages/Operation/Member";
import Promocode from "./pages/Operation/Promocode";
import Recharge from "./pages/Operation/Recharge";
import Withdrawals from "./pages/Operation/Withdrawals";
import Device from "./pages/Operation/Device";
import Equipmentlistxiangqing from "./pages/Operation/Equipmentlistxiangqing";
import View from "./pages/View";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Detail from "./pages/Detail";
import Error from "./pages/Error";
import Minup from "./pages/Minup";
import Detaillist from "./pages/Detail/Detaillist";
import Prozhuce from "./pages/Prozhuce";
import { Auth } from "./components/Auth";
import StoreLogin from "./pages/StoreLogin";
import Detaillistfenye from "./pages/Detail/Detaillistfenye";

function App() {
  // const class_id = localStorage.getItem("class");
  // console.log(class_id);
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            // <Auth>
            //   {" "}
            //   <Layout />{" "}
            // </Auth>
            <Layout to="/" replace />
          }
          // element={<Navigate to="/" replace />}
        >
          <Route path="/" element={<Navigate to="/view" replace />} />
          {/* 主页 */}
          <Route path="/view" element={<View />} replace></Route>
          {/* <Route path="/view" element={<View />} Navigate></Route> */}
          <Route path="/detail/:id" element={<Detail />}></Route>
          <Route path="/detail/list/:id" element={<Detaillist />}></Route>
          <Route
            path="/detail/listfenye/:id"
            element={<Detaillistfenye />}
          ></Route>
          {/* 设置 */}
          <Route path="/personal" element={<Personal />}></Route>
          <Route path="/password" element={<Password />}></Route>
          {/* 店家管理 */}
          <Route
            path="/Management/storeclassify"
            element={<Storeclassify />}
          ></Route>
          <Route path="/Management/storelist" element={<Storelist />}></Route>
          <Route
            path="/Management/underreview"
            element={<Underreview />}
          ></Route>
          <Route
            path="/Management/storereport"
            element={<Storereport />}
          ></Route>
          {/* 运营管理 */}
          <Route
            path="/Operation/equipmentlist"
            element={<Equipmentlist />}
          ></Route>
          <Route
            path="/Operation/equipmentlistxiangqing/:id"
            element={<Equipmentlistxiangqing />}
          ></Route>

          <Route
            path="/Operation/withdrawals"
            element={<Withdrawals />}
          ></Route>
          <Route path="/Operation/earnings" element={<Earnings />}></Route>
          <Route path="/Operation/device" element={<Device />}></Route>
          <Route path="/Operation/promocode" element={<Promocode />}></Route>
          <Route path="/Operation/member" element={<Member />}></Route>
          <Route path="/minup/:id" element={<Minup />}></Route>
          <Route path="/Operation/recharge" element={<Recharge />}></Route>
        </Route>

        <Route path="/login" element={<Login />}></Route>
        <Route path="/prozhuce/:id" element={<Prozhuce />}></Route>
        <Route path="/storelogin" element={<StoreLogin />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
