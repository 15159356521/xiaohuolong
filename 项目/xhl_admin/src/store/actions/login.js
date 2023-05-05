import request from '../../utils/request'
import { setTokenInfo, removeTokenInfo, setMenuList, setUserInfo, removeMenuList, removeUserInfo } from '../../utils/storage'
import { message } from 'antd'

export const saveToken = (payload) => {
    return {
        type:'login/token',
        payload,
    }
}


export const login = (data) => {
    return async dispatch => {
        const {msg, code, resData} = await request({
            url: '/admin/home_login',
            method: 'post',
            data
        })

        // 操作成功 200 {user_info: {…}, menu_list: Array(2)}
        // 密码错误 400 []
        console.log(msg, code, resData)
        if(code === 400) {
            return message.warning(msg)
        }else {
            message.success('登录成功')
        }

        /*
            保存token在redux中(内存中存储token)
            使token基本响应式, 当改变token时可以第一时间获取到token变化
        */ 
        dispatch(saveToken(resData))
        /*
            本地存储token, 持久化Token,当页面退出在进入, token不会丢失, 但不具备响应式
                能力, 当token变化, 不会自动发现token变化
        */ 
        setTokenInfo(resData.user_info.token)
        setMenuList(resData.menu_list)
        setUserInfo(resData.user_info)
    }
}

export const logout = () => {
    return async dispatch => {
        // 移除本地token
        removeTokenInfo()
        removeMenuList()
        removeUserInfo()

        // 移除redux中的token
        dispatch({
            type: 'login/logout',
        })
    }
}
