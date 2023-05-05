import axios from 'axios'
import {message} from 'antd'
import { getTokenInfo, hasToken, getUserInfo } from './storage'
import { history } from './history'


// export const baseURL = 'http://admin.xiaohuolongfujiankeji.com'
export const baseIMgURL = 'https://sub.admin.xiaohuolongfujiankeji.com'
// export const baseURL = 'http://192.168.9.25'

const request = axios.create({
    // baseURL: baseURL,
    timeout: 50000,
})

request.interceptors.request.use(config => {
    if(hasToken()) {
        config.headers.Authorization = `${getUserInfo().user_id},${getTokenInfo()}`
    }
    return config
})

request.interceptors.response.use(response => {
    const {code, data: resData, msg, count} = response.data
    if (code === 401) {
        window.localStorage.clear();
        message.warning('登录失效,请先登录在操作')
        history.push('/login')
    }

    return {code, resData, msg, count}
}, error => {
    return Promise.reject(error)
})

export default request