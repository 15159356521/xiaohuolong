import { createSlice } from "@reduxjs/toolkit";
import {
  getCurrentMenuItem,
  getSelectMenuItem,
  setCurrentMenuItem,
  setSelectMenuItem,
} from "../../utils/storage";

export const menuSlice = createSlice({
  name: "authSlice",
  // 从本地获取数据
  initialState: () => {
    const currentMenuItem = getCurrentMenuItem();
    if (!currentMenuItem) {
      return {
        current_Menu_Item: [
          {
            key: -1,
            label: "首页",
          closable: false,
          },
        ],
        selected_Menu_Item: -1,
      };
    }

    return {
      current_Menu_Item: getCurrentMenuItem(),
      selected_Menu_Item: getSelectMenuItem(),
    };
  },
  reducers: {
    saveCurrentMenuItem(state, actions) {
      let arr = state.current_Menu_Item.find(
        (item) => item.key == actions.payload.currentMenuItem.key
      );
      if (!arr) {
      
        state.current_Menu_Item = [
          ...state.current_Menu_Item,
          actions.payload.currentMenuItem,
        ];
      }
      console.log(state.current_Menu_Item,"arr");
      state.selected_Menu_Item = actions.payload.currentMenuItem.key;
      setCurrentMenuItem(state.current_Menu_Item);
      setSelectMenuItem(state.selected_Menu_Item);
    },
    saveSelectedMenuItem(state, actions) {
      state.selected_Menu_Item = actions.payload.keys;
      setSelectMenuItem(state.selected_Menu_Item);
    },
    sliceCurrentMenuItem(state, actions) {
      state.current_Menu_Item = actions.payload.current_Menu_Item;

      state.selected_Menu_Item = actions.payload.selected;
      setCurrentMenuItem(state.current_Menu_Item);
    },
  },
});

export const {
  saveCurrentMenuItem,
  saveCurrentSelectItem,
  sliceCurrentMenuItem,
  saveSelectedMenuItem,
} = menuSlice.actions;
