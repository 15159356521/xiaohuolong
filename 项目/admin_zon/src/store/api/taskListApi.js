import {
	createApi,
	fetchBaseQuery,
} from '@reduxjs/toolkit/dist/query/react/index'
// 创建Api对象, createApi 用来创建RTKQ中的api对象, RTKQ的所有功能都需要通过该对象来进行
// createApi() 需要一个对作为参数
// import { baseUrl } from '../constant'

const studentApi = createApi({
	reducerPath: 'taskListApi', // api唯一标识, 不能和其他Api或reducer重复
	baseQuery: fetchBaseQuery({
		// 指定查询的基础信息, 发送请求使用的工具
		// baseUrl, // 发送请求的基地址
		prepareHeaders: (headers, { getState }) => {
			// 用来统一设置请求头
			// 获取的用户的token
			const user_info = getState().auth.user_info
			console.log(user_info)
			if (user_info) {
				headers.set(
					'Authorization',
					`${user_info.user_id},${user_info.token}`
				)
			}
			return headers
		},
	}),
	tagTypes: ['taskList'], // 用来指定api中的标签的类型
	endpoints(build) {
		// endpoints 用来指定Api中的各种功能, 是一个方法, 需要一个对象作为返回值
		// build: 请求构建器. 通过build来设置请求的相关信息
		return {
			getTaskLists: build.query({
				query() {
					// 用来指定子路径
					return {
						url: '/admin/task.task/index',
						method: 'post',
					}
				},

				providesTags: [{ type: 'taskList', id: 'LIST' }], // 到[]中的标签只要一个标签失效都会重新加载数据
			}),
			getStudentById: build.query({
				query(id) {
					// 生成钩子函数调用的参数会被传入到query中
					return `students/${id}`
				},
				transformResponse(baseQueryReturnValue, meta) {
					return baseQueryReturnValue.data
				},
				// result: 查询的结果(transformResponse方法中的返回值), error: 错误信息, id: 传递的id(query方法中的id)
				providesTags: (result, error, id) => [{ type: 'taskList', id }],
				keepUnusedDataFor: 60, // 设置数据缓存的时间, 默认是60s,
			}),
			delStudent: build.mutation({
				query(id) {
					return {
						// 如果发送的不是get请求, 需要返回一个对象来设置请求的信息
						url: `students/${id}`,
						method: 'delete',
					}
				},
				invalidatesTags: ['taskList'],
			}),
			addStudent: build.mutation({
				query(stu) {
					// console.log('stu: ', stu)
					return {
						url: 'students',
						method: 'post',
						body: { data: stu }, // 自动转换为json
					}
				},
				invalidatesTags: [{ type: 'taskList', id: 'LIST' }],
			}),
			updataStudent: build.mutation({
				query(stu) {
					// console.log('stu: ', stu)
					return {
						url: `students/${stu.id}`,
						method: 'put',
						body: { data: stu.attributes },
					}
				},
				invalidatesTags: (result, error, stu) => [
					{ type: 'taskList', id: stu.id },
					{ type: 'taskList', id: 'LIST' },
				],
			}),
			// getStudents: build.query(),
			// updateStudent: build.mutation()     // 修改, 添加使用mutation. 查询使用query
		}
	},
})

// Api对象创建后, 对象会根据各种方法走动的生成对应的钩子函数
// 通过这些钩子函数, 可以来向服务器发送请求
// 钩子函数的的命名函数 getStudents -> useGetStudentQuery
export const {
	useGetTaskListsQuery,
	useGetStudentByIdQuery,
	useDelStudentMutation,
	useAddStudentMutation,
	useUpdataStudentMutation,
} = studentApi

export default studentApi
