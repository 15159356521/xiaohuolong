import request from "../utils/request"

export const getShop = (id,data) => {
    console.log(id,data);
    return request({
        url: `/tdb/index/a/statistics.Businessfy/b/log?business_id=${id}`,
        method: 'post',
        data
    })
}

export const getAllList = (data) => {
    return request({
        url: '/tdb/index/a/statistics.Businessfy/b/index',
        method: 'post',
        data
    })
}
export const PostUp = (id, data) => {
    return request({
        url: `/tdb/index/a/statistics.Businessfy/b/edit?id=${id}`,
        method: 'post',
        data
    })
}
