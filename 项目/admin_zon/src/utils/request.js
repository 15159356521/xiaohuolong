import { message } from 'antd'

import axios from 'axios'
import { history } from './history'
import {  getUserInfo,hasUserInfo } from './storage'
 export const baseIMgURL = 'https://src.longyaoapp.com'
//  export const baseIMgURL = 'https://cs.src.longyaoapp.com/'
const request = axios.create({
	baseIMgURL,
})

// 添加请求拦截器
request.interceptors.request.use(
	function (config) {
		if(hasUserInfo()) {
			config.headers.Authorization = `${getUserInfo().user_id},${getUserInfo().token}`
		}
		return config
	
	},
	function (error) {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

// 添加响应拦截器
request.interceptors.response.use(
	function (response) {
		// 对响应数据做点什么
		const { code, data, msg } = response.data
		if (code == "401") {
			window.localStorage.clear();
			message.warning({content:'登录失效,请先登录在操作',key:'login'})
			history.push('/login')
		}
		return response
	},
	function (error) {
		// 对响应错误做点什么
		return Promise.reject(error)
	}
)

export default request
