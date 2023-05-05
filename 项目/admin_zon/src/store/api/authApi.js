import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

import request from '../../utils/request'

const axiosBaseQuery = () => {
	return async ({ url, method, data, responseType = '' }) => {
		return await request({
			url,
			method,
			data,
			responseType,
		})
	}
}

const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: axiosBaseQuery(),
	endpoints(build) {
		return {
			register: build.mutation({
				query(user) {
					// console.log(user)
					return {
						url: '/auth/local/register',
						method: 'post',
						data: user,
					}
				},
			}),
			loginFn: build.mutation({
				query(user) {
					// console.log(user)
					return {
						url: 'home/login',
						method: 'post',
						data: user,
					}
				},
			}),
			// 有问题，
			getCodeImg: build.query({
				query(t) {
					return {
						url: `home/verify?t=${t}`,
						method: 'get',
					}
				},
				transformResponse(baseQueryReturnValue, meta) {
					return baseQueryReturnValue.data
				},
			}),
			getMenuList: build.query({
				query() {
					return {
						url: 'home/getmenulist',
						method: 'post'
					}
				},
				// keepUnusedDataFor: true, // 设置数据缓存的时间, 默认是60s,
			}),
			logoutFn: build.mutation({
				query() {
					return {
						url: 'home/logout',
						method: 'get'
					}
				}
			})
		}
	},
})

export const { useRegisterMutation, useLoginFnMutation, useGetCodeImgQuery, useGetMenuListQuery, useLogoutFnMutation } = authApi
export default authApi
