import request from "../utils/request"

export const getSubAccountCheckById = (id) => {
    return request({
        url: `/admin/subcontractor.subcontractorsubaudit/audit?id=${id}`,
    })
}

export const getAllSubAccounCheckData = () => {
    return request({
        url: '/admin/subcontractor.subcontractorsubaudit/index',
        method: 'post'
    })
}

export const updateSubAccountCheckById = (id, data) => {
    return request({
        url: `/admin/subcontractor.subcontractorsubaudit/audit?id=${id}`,
        method: 'post',
        data
    })
}