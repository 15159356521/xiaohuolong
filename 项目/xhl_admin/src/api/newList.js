import request from "../utils/request"

export const getNewItemById = (id) => {
    return request({
        url: `/admin/task.news/edit?id=${id}`,
    })
}

export const getAllNewListData = () => {
    return request({
        url: '/admin/task.news/index',
        method: 'post'
    })
}

export const updateNewListById = (id, data) => {
    return request({
        url: `/admin/task.news/edit?id=${id}`,
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

export const getOptions = () => {
    return request({
        url: '/admin/task.news/index',
        method: 'get'
    })
}

export const searchNewList = (data) => {
    return request({
        url: '/admin/task.news/index',
        method: 'post',
        data
    })
}
