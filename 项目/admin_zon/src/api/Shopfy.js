import request from "../utils/request"

export const getUp = (id) => {
    return request({
        url: `/tdb/index/a/statistics.Shopfy/b/edit?id=${id}`,
        method: 'get'
    })
}

export const getAllList = (data) => {
    return request({
        url: '/tdb/index/a/statistics.Shopfy/b/index',
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
// 获取单个店家信息
export const getShop = (id,data) => {
    return request({
        url: `/tdb/index/a/statistics.Shopfy/b/log?shop_id=${id}`,
        method: 'post',
        data
    })
}