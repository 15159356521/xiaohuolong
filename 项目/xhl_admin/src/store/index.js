import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers'
import thunk from 'redux-thunk'
import { getTokenInfo } from '../utils/storage'
import { composeWithDevTools } from 'redux-devtools-extension'

/*
	加载缓存的 Token 来初始化 Redux
		目标：从缓存中读取 token 信息，如果存在则设置为 Redux Store 的初始状态
		
		【如果不做本操作的话，会出现当页面刷新后，缓存中有值而 Redux 中无值的情况】
*/ 
const store = createStore(
	reducer,
	// 初始化时要加载的状态
	{
		login: getTokenInfo(),
	},
	composeWithDevTools(applyMiddleware(thunk))
)
export default store


