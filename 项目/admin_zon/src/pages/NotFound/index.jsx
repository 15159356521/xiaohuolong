import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './index.module.scss'
export default function NotFound() {
	const [time, setTime] = useState(10)
	const navigate = useNavigate()

	useEffect(() => {
		let timer = setInterval(() => {
			if (time === 0) {
				navigate('/')
			}
			setTime((preStae) => preStae - 1)
		}, 1000)

		return () => {
			window.clearInterval(timer)
		}
	}, [time])

	return (
		<div className={styles.root}>
			<div className="title">404, 页面丢失了</div>
			<div className="timeWrapper"><span className='time'>{time}s</span>回到登录页</div>
			<Button
				type="primary"
				onClick={() => navigate('/login', { replace: false })}
			>
				回到登录页
			</Button>
		</div>
	)
}
