import request from "../utils/request"

export const getRoleById = (id) => {
    return request({
        url: `/admin/auth.admgroup/edit?id=${id}`,
    })
}

export const getAllRole = () => {
    return request({
        url: '/admin/auth.admgroup/index',
        method: 'post'
    })
}

export const getRoleBtn = (id) => {
    return request({
        url: `/admin/home/btnlist?id=${id}`,
        method: 'post'
    })
}

export const addRole = (data) => {
    return request({
        url: '/admin/auth.admgroup/add',
        method: 'post',
        data
    })
}

export const deletRoleById = (id) => {
    return request({
        url: `/admin/auth.admgroup/del?id=${id}`,
        method: 'post'
    })
}


export const getPlatOption = () => {
    return request({
        url: '/admin/auth.admgroup/add',
        method: 'get'
    })
}

export const updateRoleById = (id, data) => {
    return request({
        url: `/admin/auth.admgroup/edit?id=${id}`,
        method: 'post',
        data
    })
}