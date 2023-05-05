import request from "../utils/request"

export const getUp = (id) => {
    return request({
        url: `/mall/index/a/goods.Goodsc/b/single`,
        method: 'post',
        data:{
            id
        }
    })
}

export const getAllList = (data) => {
    return request({
        url: '/mall/index/a/goods.Goodsc/b/index',
        method: 'post',
        data
    })
}
export const PostUp = (data) => {
    return request({
        url: `/mall/index/a/goods.Goodsc/b/addedit`,
        method: 'post',
        data
    })
}
export const postAdd = (id,data) => {
    return request({
        url: `/mall/index/a/goods.Goodsc/b/addedit`,
        method: 'post',
        data
    })
}

export const postDel = (id) => {
    return request({
        url: `/mall/index/a/goods.Goodsc/b/del`,
        method: 'post',
        data:{
            id
        }
    })
}
export const getShop = (id) => {
    return request({
        url: `/mall/index/a/goods.GoodsSkuc/b/index`,
        method: 'post',
        data:{
            id
        }
    })
}
export const delShop = (id) => {
    return request({
        url: `/mall/index/a/goods.GoodsSkuc/b/del`,
        method: 'post',
        data:{
            id
        }
    })
}
export const upShop=(data)=>{
    console.log(data,"data")
    return request({
        url: `/mall/index/a/goods.GoodsSkuc/b/index`,
        method: 'post',
        data
    })
}
export const postShop=(data)=>{
    return request({
        url: `/mall/index/a/goods.GoodsSkuc/b/addedit`,
        method: 'post',
        data
    })
}