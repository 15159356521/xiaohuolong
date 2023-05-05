import request from "../utils/request"

// export const getUp = (id) => {
//     return request({
//         url: `/tdb/index/a/statistics.Shopfy/b/edit?id=${id}`,
//         method: 'get'
//     })
// }

export const getAllList = (data) => {
    return request({
        url: '/tdb/index/a/tdb.Feedback/b/index',
        method: 'post',
        data
    })
}
export const PostUp = (id, data) => {
    return request({
        url: `/tdb/index/a/tdb.Feedback/b/edit?id=${id}`,
        method: 'post',
        data
    })
}