import {
	createApi,
	fetchBaseQuery,
} from '@reduxjs/toolkit/dist/query/react/index'
import request from '../../utils/request'

const axiosBaseQuery = () => {
	return async ({ url, method, data }) => {
		return await request({
			url,
			method,
			data,
		})
	}
}

const authAdmuserApi = createApi({
	reducerPath: 'authAdmuserApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['authAdmuser'],
	endpoints(build) {
		return {
			getRoleBtn: build.query({
				query(id) {
					// 用来指定子路径
					return {
						url: 'admin/home/btnlist?id=' + id,
						method: 'post',
					}
				},

				providesTags: [{ type: 'authAdmuser', id: 'LIST' }], // 到[]中的标签只要一个标签失效都会重新加载数据
			}),
			getAuthAdmuserLists: build.query({
				query() {
					// console.log('重新调用了getAuthAdmuserLists')
					// 用来指定子路径
					return {
						url: '/admin/auth.admuser/index',
						method: 'post',
					}
				},

				providesTags: [{ type: 'authAdmuser', id: 'LIST' }], // 到[]中的标签只要一个标签失效都会重新加载数据
			}),
			getAuthAdmuserById: build.query({
				query(id) {
					// 生成钩子函数调用的参数会被传入到query中
					return {
						url: `/admin/auth.admuser/edit?id=${id}`,
						method: 'get',
					}
				},
				transformResponse(baseQueryReturnValue, meta) {
					return baseQueryReturnValue.data
				},
				keepUnusedDataFor: 0, //设置数据缓存时间
				// result: 查询的结果(transformResponse方法中的返回值), error: 错误信息, id: 传递的id(query方法中的id)
				providesTags: (result, error, id) => [
					{ type: 'authAdmuser', id },
				],
				// keepUnusedDataFor: 60, // 设置数据缓存的时间, 默认是60s,
			}),
			delStudent: build.mutation({
				query(id) {
					return {
						// 如果发送的不是get请求, 需要返回一个对象来设置请求的信息
						url: `students/${id}`,
						method: 'delete',
					}
				},
				invalidatesTags: ['authAdmuser'],
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
				invalidatesTags: [{ type: 'authAdmuser', id: 'LIST' }],
			}),
			updataAuthAdmuserById: build.mutation({
				query(data) {
					// console.log('stu: ', data)
					return {
						url: `/admin/auth.admuser/edit?id=${data.id}`,
						method: 'POST',
						data,
					}
				},
				invalidatesTags: (result, error, data) => [
					{ type: 'authAdmuser', id: data.id },
					{ type: 'authAdmuser', id: 'LIST' },
				],
				keepUnusedDataFor: 60, // 设置数据缓存的时间, 默认是60s,
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
	useGetRoleBtnQuery,
	useGetAuthAdmuserListsQuery,
	useGetAuthAdmuserByIdQuery,
	useDelStudentMutation,
	useAddStudentMutation,
	useUpdataAuthAdmuserByIdMutation,
} = authAdmuserApi

export default authAdmuserApi
