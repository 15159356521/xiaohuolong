
import request from "../utils/request"
// 获取用户列表
export function getAllList(data) {
    return request({
        url: "/user.users/index",
        method: "post",
        data,
    })
}
// 查
export const getUp = (id) => {
    return request({
        url: `/user.users/edit?id=${id}`,
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
        url: `/user.users/edit?id=${id}`,
        method: 'post',
        data
    })
}
// 增
export const PostAdd = (data) => {
    return request({
        url: '/user.users/add',
        method: 'post',
        data
    })
}
export const PostDel = (id) => {
    return request({
        url: `/user.users/del?id=${id}`,
        method: 'post'
    })
}
