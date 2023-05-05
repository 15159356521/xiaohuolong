import request from "../utils/request"

export const getUp = (id) => {
    return request({
        url: `/zhibo/index/a/room.Roomlist/b/edit?id=${id}`,
        method: 'get',
    })
}

export const getAllList = (data) => {
    return request({
        url: '/zhibo/index/a/room.Roomlist/b/index',
        method: 'post',
        data
    })
}
export const PostUp = (data) => {
    return request({
        url: `/zhibo/index/a/room.Roomlist/b/edit`,
        method: 'post',
        data
    })
}
export const postAdd = (data) => {
    return request({
        url: `/zhibo/index/a/room.Roomlist/b/add`,
        method: 'post',
        data
    })
}

export const postDel = (id) => {
    return request({
        url: `/zhibo/index/a/room.Roomlist/b/del`,
        method: 'post',
        data:{
            id
        }
    })
}