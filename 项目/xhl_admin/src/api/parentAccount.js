import request from "../utils/request"

export const getParentAccountById = (id) => {
    return request({
        url: `/admin/subcontractor.subcontractor/edit?id=${id}`,
    })
}

export const getAllParentAccountData = () => {
    return request({
        url: '/admin/subcontractor.subcontractor/index',
        method: 'post'
    })
}

export const updateParentAccountById = (id, data) => {
    return request({
        url: `/admin/subcontractor.subcontractor/edit?id=${id}`,
        method: 'post',
        data
    })
}

export const getOptions = () => {
    return request({
        url: '/admin/subcontractor.subcontractor/index',
        method: 'get'
    })
}

export const searchParentAccount = (data) => {
    return request({
        url: '/admin/subcontractor.subcontractor/index',
        method: 'post',
        data
    })
}
