import request from "../utils/request"

export const PostAdd = (data) => {
    return request({
        url: `/tdb/index/a/tdb.Banner/b/add`,
        method: 'post',
        data
    })
}

export const getAllList = (data) => {
    return request({
        url: '/tdb/index/a/tdb.Banner/b/index',
        method: 'post',
        data
    })
}
export const PostUp = (id, data) => {
    return request({
        url: `/tdb/index/a/tdb.Banner/b/edit?id=${id}`,
        method: 'post',
        data
    })
}
export const getUp = (id, ) => {
    return request({
        url: `/tdb/index/a/tdb.Banner/b/edit?id=${id}`,
    
    })
}
export const PostDel = (id) => {
    return request({
        url: `/tdb/index/a/tdb.Banner/b/del?id=${id}`,
        method: 'post'
    })
}