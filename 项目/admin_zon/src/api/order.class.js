import request from "../utils/request"

export const getUp = (id) => {
    return request({
        url: `/mall/index/a/goods.Categoryc/b/singleindex`,
        method: 'post',
        data:{
            id
        }
    })
}

export const getAllList = (data) => {
    return request({
        url: '/mall/index/a/goods.Categoryc/b/index',
        method: 'post',
        data
    })
}
export const PostUp = (data) => {
    return request({
        url: `/mall/index/a/goods.Categoryc/b/addedit`,
        method: 'post',
        data
    })
}
// export const postAdd = (id,data) => {
//     return request({
//         url: `/tdb/index/a/statistics.Shopfy/b/log?shop_id=${id}`,
//         method: 'post',
//         data
//     })
// }

export const postDel = (id) => {
    return request({
        url: `/mall/index/a/goods.Categoryc/b/del`,
        method: 'post',
        data:{
            id
        }
    })
}