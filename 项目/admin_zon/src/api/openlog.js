import request from "../utils/request"

export const getUp = (id) => {
    return request({
        url: `/tdb/index/a/tdb.Thcdevice/b/openlog/edit?id=${id}`,
        method: 'get'
    })
}

export const getAllList = (data) => {
    return request({
        url: '/tdb/index/a/tdb.Thcdevice/b/openlog',
        method: 'post',
        data
    })
}
export const addRole = (data) => {
    return request({
        url: 'auth.admgroup/add',
        method: 'post',
        data
    })
}

export const getDel = (id) => {
    return request({
        url: `/auth.admgroup/del?id=${id}`,
        method: 'post'
    })
}


export const getAdd = () => {
    return request({
        url: '/auth.admgroup/add',
        method: 'get'
    })
}

export const PostUp = (id, data) => {
    return request({
        url: `/auth.admgroup/edit?id=${id}`,
        method: 'post',
        data
    })
}
// 退款
export const PostRefund = (id) => {
    return request({
        url: `/tdb/index/a/tdb.Startinglog/b/refundfz?id=${id}`,
        method: 'post'
    })
}