import { message } from 'antd'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
export default function NeedAuth(props) {
	const user_info = useSelector((state) => state.auth.user_info)
	console.log('user_info: ', user_info);
	const location = useLocation()
	if (user_info) {
		return props.children
	} else {
		message.warning('token失效,请向登录')
		return (
			<Navigate to="/login" replace state={{ preLocation: location }} />
		)
	}
}
