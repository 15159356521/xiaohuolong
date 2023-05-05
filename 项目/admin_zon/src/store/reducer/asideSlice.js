import { createSlice } from "@reduxjs/toolkit";
import { TableOutlined } from "@ant-design/icons";
import {
  getAsideMenuItem,
  getSelectMenuItem,
  setAsideMenuItem,
  setSelectMenuItem,
} from "../../utils/storage";

export const asideSlice = createSlice({
  name: "authSlice",
  // 从本地获取数据
  initialState: () => {
    const currentMenuItem = getAsideMenuItem();
    if (!currentMenuItem) {
      return {
        current_Menu_Item: [
            { label: "暂无侧边栏", key: "item-1", icon: <TableOutlined /> },
        ],
        selected_Menu_Item: -1,
      };
    }

    return {
      current_Menu_Item: getAsideMenuItem(),
      selected_Menu_Item: getSelectMenuItem(),
    };
  },
  reducers: {
    saveAsideMenuItem(state, actions) {
        console.log(actions.payload);
    //   let arr = state.current_Menu_Item.find(
    //     (item) => item.key == actions.payload.currentMenuItem.key
    //   );
    //   if (!arr) {
    //     state.current_Menu_Item = [
    //       ...state.current_Menu_Item,
    //       actions.payload.currentMenuItem,
    //     ];
    //   }
    //   state.selected_Menu_Item = actions.payload.currentMenuItem.key;
      setAsideMenuItem(state.current_Menu_Item);
      setSelectMenuItem(state.selected_Menu_Item);
    },
    saveSelectedMenuItem(state, actions) {
      state.selected_Menu_Item = actions.payload.keys;
      setSelectMenuItem(state.selected_Menu_Item);
    },
    sliceAsideMenuItem(state, actions) {
      state.current_Menu_Item = actions.payload.current_Menu_Item;

      state.selected_Menu_Item = actions.payload.selected;
      setAsideMenuItem(state.current_Menu_Item);
    },
  },
});

export const {
  saveAsideMenuItem,
  saveAsideSelectItem,
  sliceAsideMenuItem,
  saveSelectedMenuItem,
} = asideSlice.actions;
