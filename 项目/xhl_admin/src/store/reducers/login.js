
const initValue = {
	token: '',
	userInfo: {},
	menuList: []
}


export default function reducer(state = initValue, action) {
	const { type, payload } = action
	switch (type) {
		case 'login/token':
			return {...state, token: payload.user_info.token, ...payload}
		case 'login/logout':
			return { }
		default:
			return state
	}
}
