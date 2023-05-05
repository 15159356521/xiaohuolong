const initValue = {
	roles:  []
}


export default function reducer(state = initValue, action) {
	const { type, payload } = action
	switch (type) {
		case 'manage/saveRole':
			return	{
				...state,
				roles: payload
			}
		case 'manage/getRoleById':
			return { }
		default:
			return state
	}
}
