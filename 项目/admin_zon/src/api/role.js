import request from "../utils/request"

export const getUp = (id) => {
    return request({
        url: `/auth.admgroup/edit?id=${id}`,
    })
}

export const getAllList = (data) => {
    return request({
        url: '/auth.admgroup/index',
        method: 'post',
        data
    })
}
export const addRole = (data) => {
    return request({
        url: 'auth.admgroup/add',
        method: 'post',
        data
    })
}

export const getDel = (id) => {
    return request({
        url: `/auth.admgroup/del?id=${id}`,
        method: 'post'
    })
}


export const getAdd = () => {
    return request({
        url: '/auth.admgroup/add',
        method: 'get'
    })
}

export const PostUp = (id, data) => {
    return request({
        url: `/auth.admgroup/edit?id=${id}`,
        method: 'post',
        data
    })
}