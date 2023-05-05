import request from "../utils/request"

export const getUp = (id) => {
    return request({
        url: `/tdb/index/a/statistics.Shopfy/b/edit?id=${id}`,
        method: 'get'
    })
}

export const getAllList = (data) => {
    return request({
        url: '/tdb/index/a/statistics.Thcwithdraw/b/index',
        method: 'post',
        data
    })
}
// 审核
export const PostAud = (data) => {
    return request({
        url: `/tdb/index/a/statistics.Thcwithdraw/b/audit`,
        method: 'post',
        data
    })
}
// 出款
export const PostDis = (id,data) => {
    return request({
        url: `/tdb/index/a/statistics.Thcwithdraw/b/disbursements?id=${id}`,
        method: 'post',
        data
    })
}
// 上传发票
export const PostTic = (id,data) => {
    return request({
        url: `/tdb/index/a/statistics.Thcwithdraw/b/ticket?id=${id}`,
        method: 'post',
        data
    })
}