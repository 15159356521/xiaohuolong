import request from "../utils/request"

export const getAllRoleGroupById = (id) => {
    return request({
        url: `/admin/auth.admrule/edit?id=${id}`,
    })
}

export const getAllRule = () => {
    return request({
        url: '/admin/auth.admrule/index',
        method: 'post'
    })
}


export const addRoleGroup = (data) => {
    return request({
        url: '/admin/auth.admrule/add',
        method: 'post',
        data
    })
}

export const deletRoleGroupById = (id) => {
    return request({
        url: `/admin/auth.admrule/del?id=${id}`,
        method: 'post'
    })
}


export const getPlatOption = () => {
    return request({
        url: '/admin/auth.admrule/add',
        method: 'get'
    })
}

export const updateRule = data => {
    return request({
        url: `/admin/auth.admrule/save`,
        method: 'post',
        data
    })
}