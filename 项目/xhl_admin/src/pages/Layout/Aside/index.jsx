import React, { useRef } from "react";
import { Menu, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuList } from "../../../utils/storage";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getRole } from "../../../store/actions/manage";
import routerContant from "../../../utils/constant";

export default function Aside(props) {
  const [asideItem, setAsidaItem] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const changeMenuList = (data) => {
    console.log(data);
    if (Object.keys(data).length === 0) {
      // message.warning('用户未登录， 请先登录')
      navigate("/login");
      return;
    }

    const newList = data.map((item1) => {
      return {
        ...item1,
        key: item1.id,
        label: item1.title,
        defaultKey: item1.id,
        children: item1.children?.map((item2) => {
          return {
            ...item2,
            key: item2.id,
            label: item2.title,
            defaultKey: item1.id + "-" + item2.id,
            children:
              "children" in item2
                ? item2.children.map((item3) => ({
                    ...item3,
                    defaultKey: item1.id + "-" + item2.id + "-" + item3.id,
                    label: item3.title,
                    key: item3.id,
                  }))
                : null,
          };
        }),
      };
    });

    // console.log(newList)

    setAsidaItem(newList);
  };

  useEffect(() => {
    changeMenuList(getMenuList());
  }, []);

  const [defaultedKeys, setDefaultedKeys] = useState(
    routerContant[location?.pathname?.split("/").pop()]?.split("-")
  );
  useEffect(() => {
    // console.log('界面渲染了')
    if (location.pathname === "/") {
      setDefaultedKeys("");
    } else {
      setDefaultedKeys(
        routerContant[location?.pathname?.split("/").pop()].split("-")
      );
    }
  }, [location.pathname]);

  const changeMenu = async (e) => {
    // console.log(e.key);
    if (e.key === "5") {
      navigate("/roleGroup");
      await dispatch(getRole());
    } else if (e.key === "3") {
      navigate("/invitation");
    } else if (e.key === "7") {
      navigate("/menuManagement");
    } else if (e.key === "29") {
      navigate("/copyRightManager");
    } else if (e.key === "23") {
      navigate("/platRole");
    } else if (e.key === "28") {
      navigate("/roleTable");
    } else if (e.key === "34") {
      navigate("/taskDrawer");
    } else if (e.key === "39") {
      console.log("taskList");
      navigate("/taskList");
    } else if (e.key === "44") {
      navigate("/activeList");
    } else if (e.key === "49") {
      navigate("/newList");
    } else if (e.key === "54") {
      navigate("/messagePrompt");
    } else if (e.key === "67") {
      navigate("/parentAccount");
    } else if (e.key === "69") {
      navigate("/parentAccountCheck");
    } else if (e.key === "72") {
      navigate("/subAccountCheck");
    } else if (e.key === "76") {
      navigate("/subAcoountList");
    } else if (e.key === "6") {
      navigate("/manageSub");
    } else if (e.key === "110") {
      navigate("/parentAccountInvite");
    } else if (e.key === "114") {
      // console.log(2);
      navigate("/videoList");
    } else if (e.key === "120") {
      navigate("/yilanuser");
    } else if (e.key === "126") {
      navigate("/yilanfile");
    } else if (e.key === "128") {
      navigate("/alluploadfile");
    }
  };

  const onOpenChange = (keys) => {
    setDefaultedKeys(keys);
  };
  return (
    <Menu
      ref={menuRef}
      onClick={changeMenu}
      theme="white"
      mode="inline"
      className="menuWrapper"
      // defaultSelectedKeys={defaultedKeys}
      // defaultOpenKeys={defaultedKeys}
      selectedKeys={defaultedKeys}
      openKeys={defaultedKeys}
      onOpenChange={onOpenChange}
      {...props}
      items={asideItem}
    />
  );
}
