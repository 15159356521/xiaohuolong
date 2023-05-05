import request from "../utils/request"

export const getUp = (id) => {
    return request({
        url: `/tdb/index/a/tdb.Business/b/edit?id=${id}`,
        method: 'get'
    })
}

export const getAllList = (data) => {
    return request({
        url: '/tdb/index/a/tdb.Business/b/index',
        method: 'post',
        data
    })
}
export const PostAdd = (data) => {
    return request({
        url: '/tdb/index/a/tdb.Business/b/add',
        method: 'post',
        data
    })
}


export const PostUp = (id, data) => {
    return request({
        url: `/tdb/index/a/tdb.Business/b/edit?id=${id}`,
        method: 'post',
        data
    })
}