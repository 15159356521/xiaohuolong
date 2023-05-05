import request from "../utils/request"
// 获取地址
export const getUp = (id) => {
    return request({
        url: `/mall/index/a/order.Orderc/b/index`,
        method: 'post',
        data:{
            id
        }
    })
}

export const getAllList = (data) => {
    return request({
        url: '/mall/index/a/order.Orderc/b/index',
        method: 'post',
        data
    })
}
// 修改订单
export const PostUp = (data) => {
    return request({
        url: `/mall/index/a/order.Orderc/b/update`,
        method: 'post',
        data
    })
}
export const getShop = (id) => {
    return request({
        url: `/mall/index/a/order.Orderc/b/selgoods`,
        method: 'post',
        data:{
            id
        }
    })
}
// 发货
export const PostSend = (data) => {
    return request({
        url: `/mall/index/a/order.Orderc/b/delivergoods`,
        method: 'post',
        data
    })
}
// 售后
export const getAfter = (id) => {
    return request({
        url: `/mall/index/a/order.Orderc/b/sale`,
        method: 'post',
        data:{
            id
        }
    })
}
// 退款‘
export const PostRefund = (data) => {
    return request({
        url: `/mall/index/a/order.Orderc/b/salerefund`,
        method: 'post',
        data
    })
}
// 换货
export const PostChange = (data) => {
    return request({
        url: `/mall/index/a/order.Orderc/b/changesale`,
        method: 'post',
        data
    })
}