import request from "../utils/request"

export const getAllRoleGroupById = (id) => {
    return request({
        url: `/admin/auth.admuser/edit?id=${id}`,
    })
}

export const getAllRoleGroup = () => {
    return request({
        url: '/admin/auth.admuser/index',
        method: 'post'
    })
}

export const getRoleBtn = (id) => {
    return request({
        url: `/admin/home/btnlist?id=${id}`,
        method: 'post'
    })
}

export const addRoleGroup = (data) => {
    return request({
        url: '/admin/auth.admuser/add',
        method: 'post',
        data
    })
}

export const deletRoleGroupById = (id) => {
    return request({
        url: `/admin/auth.admuser/del?id=${id}`,
        method: 'post'
    })
}


export const getPlatOption = () => {
    return request({
        url: '/admin/auth.admuser/add',
        method: 'get'
    })
}

export const updateRoleGroupById = (id, data) => {
    return request({
        url: `/admin/auth.admuser/edit?id=${id}`,
        method: 'post',
        data
    })
}