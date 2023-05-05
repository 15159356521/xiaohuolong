import request from '../utils/request'

// 版权归属平台增删改
export const getPlatRoleList = () => {
    return request({
        url: '/admin/copyright.copyrightplatform/index',
        method: 'post'
    })
}

export const getPlatRoleById = (id) => {
    return request({
        url: `/admin/copyright.Copyrightplatform/edit?id=${id}`,
        method: 'get'
    })
}

export const updateRole = (id, data) => {
    return request({
        url: `/admin/copyright.Copyrightplatform/edit?id=${id}`,
        method: 'post',
        data
    })
}

export const addRole = (data) => {
    return request({
        url: '/admin/copyright.Copyrightplatform/add',
        method: 'post',
        data
    })
}

export const delRoleById = (id) => {
    return request({
        url: `/admin/copyright.Copyrightplatform/del?id=${id}`,
        method: 'post'
    })
}

export const getOptions = () => {
    return request({
        url: '/admin/copyright.Copyrightplatform/index',
        method: 'get'
    })
}

export const searchRole = (data) => {
    return request({
        url: '/admin/copyright.Copyrightplatform/index',
        method: 'post',
        data
    })
}