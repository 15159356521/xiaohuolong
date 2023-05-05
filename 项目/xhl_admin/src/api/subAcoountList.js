import request from "../utils/request"

export const getSubAccountListById = (id) => {
    return request({
        url: `admin/subcontractor.subcontractorsub/edit?id=${id}`,
    })
}

export const getAllSubAccounListData = () => {
    return request({
        url: '/admin/subcontractor.subcontractorsub/index',
        method: 'post'
    })
}

export const updateSubAccountListById = (id, data) => {
    return request({
        url: `/admin/subcontractor.subcontractorsub/edit?id=${id}`,
        method: 'post',
        data
    })
}