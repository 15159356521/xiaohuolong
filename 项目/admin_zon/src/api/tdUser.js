
import request from "../utils/request"
// 获取用户列表
export function getAllList(data) {
    return request({
        url: "/tdb/index/a/user.Users/b/index",
        method: "post",
        data,
    })
}
// 查
export const getUp = (id) => {
    return request({
        url: `/tdb/index/a/user.Users/b/edit?id=${id}`,
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
        url: `/tdb/index/a/user.Users/b/edit?id=${id}`,
        method: 'post',
        data
    })
}
// 增
export const PostAdd = (data) => {
    return request({
        url: '/tdb/index/a/user.Users/b/add',
        method: 'post',
        data
    })
}
export const PostDel = (id) => {
    return request({
        url: `/tdb/index/a/user.Users/b/del?id=${id}`,
        method: 'post'
    })
}
// 查看分钟详情
export const getShop = (id,data) => {
    console.log(id,data);
    return request({
        url: `/tdb/index/a/user.Usersshopminute/b/index?id=${id}`,
        method: 'post',
        data
    })
}
// 查看分店分钟详情
export const getShopMinute = (data) => {

    return request({
        url: `/tdb/index/a/user.Usersshopminutechange/b/index`,
        method: 'post',
        data
    })
}