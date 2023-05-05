import {createSlice} from '@reduxjs/toolkit'
import { getBtnList, getMenuList, getUserInfo, removeBtnList, removeMenuList, removeUserInfo, setBtnList, setMenuList, setUserInfo, removeCurrentMenuItem, removeSelectMenuItem, setSelectMenuItem } from '../../utils/storage'

export const authSlice = createSlice({
    name: 'authSlice',
    // 从本地获取数据
    initialState: () => {
        const user_info = getUserInfo()
        if(!user_info) {
            return {
                user_info: null,
                btn_list: null,
                menu_list: null
            }
        }

        return {
            user_info: getUserInfo(),
            btn_list: getBtnList(),
            menu_list: getMenuList()
        }
    },
    reducers: {
        login(state, action) {
            state.user_info = action.payload.user_info
            setUserInfo(state.user_info)
        },
        logout(state, action) {
            state.user_info = null
            state.menu_list = null
            state.btn_list = null
            removeUserInfo()
            removeMenuList()
            removeBtnList()
        },
        saveBtnList(state, action) {
            state.menu_list = action.payload.menu_list
            state.btn_list = action.payload.btn_list
            setMenuList(state.menu_list)
            setBtnList(state.btn_list)
        }
    }
})

export const { login, logout, saveBtnList } = authSlice.actions