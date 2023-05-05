import request from "../utils/request"

// newActiveity有问题
export const getActiveAllData = () => {
    return request({
        url: `/admin/task.newactivity/index`,
        method: 'post'
    })
}

export const getAciveDataById = (id) => {
    return request({
        url: `/admin/task.newactivity/edit?id=${id}`,
    })
}

export const updateActiveDataById = (id, data) => {
    return request({
        url: `/admin/task.newactivity/edit?id=${id}`,
        method: 'post',
        data
    })
}

export const getActiveMenu = () => {
    return request({
        url: `/admin/task.newactivity/add`,
    })
}

export const addActiveItem = (data) => {
    return request({
        url: '/admin/task.newactivity/add',
        method: 'post',
        data
    })
}

export const deleteActiveItemById = (id) => {
    return request({
        url: `/admin/task.newactivity/del?id=${id}`,
        method: 'post',
    })
}

export const searchActive = (data) => {
    return request({
        url: `/admin/task.newactivity/index`,
        method: 'post',
        data
    })
}