import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import AuthForm from './api/authApi'
import taskListApi from './api/taskListApi'
import authAdmuser from './api/authAdmuser'
import { authSlice } from './reducer/authSlice'
import { menuSlice } from './reducer/menuSlice'

const store = configureStore({
	reducer: {

		[AuthForm.reducerPath]: AuthForm.reducer,
		[taskListApi.reducerPath]: taskListApi.reducer,
		[authAdmuser.reducerPath]: authAdmuser.reducer,
		auth: authSlice.reducer,
		menuSlice: menuSlice.reducer,

	},
	
	// 将AuthForm中间件配置到原有的中间件中
	middleware: (getDefaultMiddleWare) =>
		getDefaultMiddleWare().concat(
			// authSlice.middleware,
			AuthForm.middleware,
			taskListApi.middleware,
			authAdmuser.middleware,
		),
})

// 处理缓存问题, 变化的时候(断网, 失去焦点)重新加载数据
setupListeners(store.dispatch)
console.log(AuthForm,'AuthForm');
export default store
