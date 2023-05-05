import request from '../utils/request'

// 版权归属平台增删改
export const getInvitationList = () => {
    return request({
        url: '/admin/subcontractor.subcontractorinvitationcode/index',
        method: 'post'
    })
}

export const addInvitationList = () => {
    return request({
        url: '/admin/subcontractor.subcontractorinvitationcode/add',
        method: 'post',
    })
}


export const getPlatRoleById = (id) => {
    return request({
        url: `/admin/subcontractor.subcontractorinvitationcode/edit?id=${id}`,
        method: 'get'
    })
}

export const updateRole = (id, data) => {
    return request({
        url: `/admin/subcontractor.subcontractorinvitationcode/edit?id=${id}`,
        method: 'post',
        data
    })
}


export const delRoleById = (id) => {
    return request({
        url: `/admin/subcontractor.subcontractorinvitationcode/del?id=${id}`,
        method: 'post'
    })
}

export const getOptions = () => {
    return request({
        url: '/admin/subcontractor.subcontractorinvitationcode/index',
        method: 'get'
    })
}

export const searchRole = (data) => {
    return request({
        url: '/admin/subcontractor.subcontractorinvitationcode/index',
        method: 'post',
        data
    })
}