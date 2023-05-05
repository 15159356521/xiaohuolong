import React, { useRef } from 'react'
import { message, Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import styles from './index.module.scss'
import logo from './uploads/logo.png'
import PwdLogin from './PwdLogin'
import { login } from '../../store/reducer/authSlice'
import { useGetMenuListQuery, useLoginFnMutation } from '../../store/api/authApi'
import { saveBtnList } from '../../store/reducer/authSlice'
import request from '../../utils/request'
import {
	saveCurrentMenuItem,
	sliceCurrentMenuItem,
  } from "../../store/reducer/menuSlice";
export default function Login() {
	const [loginFn, { error: loginError }] = useLoginFnMutation()
	const dispatch = useDispatch()
	const ChildRef = useRef(null);
	const navigate = useNavigate()
	if (loginError) {
		message.warning(loginError.error)
		return
	}

	const onChange = (key) => {
		// console.log(key)
	}

	// 验证码登录
	const codeLogin = (codeObj) => {
		navigate('/')
		message.success('登录成功')
	}

	// 账号密码登录
	const pwdLogin = async (pwdObj) => {
		loginFn({
			phone: pwdObj.phone,
			pwd: pwdObj.pwd,
			code: pwdObj.code,
		}).then(async (res) => {
			if (res.data.code !== 200) {
			ChildRef.current.getImgCode(Date.now())
				message.warning('登录失败,' + res.data.msg)
			} else {
				
				dispatch(login({
					user_info: res.data.data.user_info
				}))
				dispatch(
					sliceCurrentMenuItem({
					  current_Menu_Item: [{key: -1, label: '首页', closable: false}],
					  selected: -1,  
					}))
				
				// 存储列表数据
				const result = await request.post('home/getmenulist')
				if(result.data.code === 200) {
					dispatch(saveBtnList({
						menu_list: result.data.data.menu_list,
						btn_list: result.data.data.btn_list
					}))

					console.log("🚀 ~ file: PrivateRouter.jsx ~ line 27 ~ getMenuList ~ res.data.data.menu_list", result.data.data.menu_list)
				}else {
					console.log('超时登录')	
				}

				navigate('/', { replace: true })
			}
		})
	}

	return (
		<div className={styles.root}>
			<div className="loginWrapper">
				<div className="logo">
					<h1>
						<img src={logo} alt="" />
						<p>龙垚</p>
					</h1>
					<p className="info">欢迎登陆使用龙垚后台</p>
				</div>

				<Tabs
					centered
					defaultActiveKey="1"
					onChange={onChange}
					items={[
						{
							label: `账户密码登录`,
							key: '1',
							children: <PwdLogin pwdLogin={pwdLogin} onRef={ChildRef} />,
						},
						/* {
                            label: `手机号登录`,
                            key: '2',
                            children: <CodeLogin codeLogin={codeLogin}/>,
                        }, */
					]}
				/>
			</div>
		</div>
	)
}
