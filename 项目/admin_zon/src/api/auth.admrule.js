
import request from "../utils/request"
// 获取用户列表
export function getAllList(data) {
    return request({
        url: "/auth.admrule/index",
        method: "post",
        data,
    })
}
// 查
export const getUp = (id) => {
    return request({
        url: `/auth.admrule/edit?id=${id}`,
    })
}
// 改
export const PostUp = (id, data) => {
    return request({
        url: `/auth.admrule/save?id=${id}`,
        method: 'post',
        data
    })
}
// 增
export const PostAdd = (data) => {
    return request({
        url: '/auth.admrule/save',
        method: 'post',
        data
    })
}
export const PostDel = (id) => {
    return request({
        url: `/auth.admrule/del?id=${id}`,
        method: 'post'
    })
}
