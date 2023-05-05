import request from "../utils/request"

export const getUp = (id) => {
    return request({
        url: `/tdb/index/a/statistics.Shopfy/b/edit?id=${id}`,
        method: 'get'
    })
}

export const getAllList = (data) => {
    return request({
        url: '/tdb/index/a/statistics.Shoprechargelog/b/index',
        method: 'post',
        data
    })
}
export const PostUp = (id, data) => {
    return request({
        url: `/tdb/index/a/statistics.Shopfy/b/edit?id=${id}`,
        method: 'post',
        data
    })
}
export const PostAdd = (data) => {
    return request({
        url: '/tdb/index/a/statistics.Shoprechargelog/b/addminute',
        method: 'post',
        data
    })
}