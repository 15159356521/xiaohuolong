import React from 'react'
import { useRoutes } from 'react-router-dom'
import loadable from '@loadable/component'
import { useSelector } from 'react-redux'
import Home from './Home'
import Layout from './Layout'
import Login from './Login'
import NotFound from './NotFound'
import Test from './Test'
import OrderAdd from './sc/index/a/Order.add'
import OrderSales from './sc/index/a/Order.sales'

export default function PrivateRouter() {
    const menuList = useSelector(state => state.auth.menu_list) || []

	const bindRouter = (list) => {
		if(typeof list === 'undefined' || !list) {
			return
		}
		let arr = [{path: '/',
			element: <Home />,},
	]
		list?.map((item) => {
			if (item.children && item.children.length > 0) {
				arr.push({
					path: '',
					// element: <ComponentNode />,
					children: [...bindRouter(item.children)],
				})
			} else {
				const ComponentNode = loadable(() => {
					return import('.' + item.path)
				})
				arr.push({
					path: item.path,
					element: <ComponentNode />,
				})
			}
		})
		// console.log(bindRouter(menulist), 'privateRouter');
		arr.push({
			path:'/order.add/:id',
			element: <OrderAdd/>,
		},{
			path:"/order.sales/:id",
			element: <OrderSales/>,
		}
		)
		return arr
	}

 console.log(bindRouter(menuList), 'privateRouter');
 
	return useRoutes([
	
		{
			path: '/',
			element: <Layout /> ,
			children: [...bindRouter(menuList)],
		},
		{
			path: '/login',
			element: <Login />,
		},
		{
			path: '/test',
			element: <Test />,
		},
		{
			path: '*',
			element: <NotFound />,
		},
	])
}
