import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { message } from 'antd'

export default function NeedAuth(props) {
    const login = useSelector(state => state)
    
    const location = useLocation()
	if (login) {
		return props.children
	} else {
		message.warning('登录失效,请重新登录')
		return (
			<Navigate to="/login" replace state={{ preLocation: location }} />
		)
	}
}

