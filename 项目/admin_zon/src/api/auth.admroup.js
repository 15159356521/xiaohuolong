
import request from "../utils/request"
// 获取用户列表
export function getAllList(data) {
    return request({
        url: "/auth.admuser/index",
        method: "post",
        data,
    })
}
// 查
export const getUp = (id) => {
    return request({
        url: `/auth.admuser/edit?id=${id}`,
    })
}
export const getRoleBtn = (id) => {
    return request({
        url: `/home/btnlist?id=${id}`,
        method: 'post'
    })
}
// 改
export const PostUp = (id, data) => {
    return request({
        url: `/auth.admuser/edit?id=${id}`,
        method: 'post',
        data
    })
}
// 增
export const PostAdd = (data) => {
    return request({
        url: '/auth.admuser/add',
        method: 'post',
        data
    })
}
export const PostDel = (id) => {
    return request({
        url: `/auth.admuser/del?id=${id}`,
        method: 'post'
    })
}
export const getAdd = () => {
    return request({
        url: '/auth.admuser/add',
        method: 'get',

    })
}