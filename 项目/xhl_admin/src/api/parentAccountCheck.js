import request from "../utils/request"

export const getParentAccountCheckById = (id) => {
    return request({
        url: `/admin/subcontractor.subcontractoraudit/audit?id=${id}`,
    })
}

export const getAllParentAccounChecktData = () => {
    return request({
        url: '/admin/subcontractor.subcontractoraudit/index',
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

export const addNewList = (data) => {
    return request({
        url: '/admin/task.news/add',
        method: 'post',
        data
    })
}

export const getAddMenu = () => {
    return request({
        url: '/admin/task.news/add',
    })
}


export const deleteNewListById = (id) => {
    return request({
        url: `/admin/task.news/del?id=${id}`,
        method: 'post'
    })
}