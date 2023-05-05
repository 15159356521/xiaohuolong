import request from "../utils/request"

export const getMessageById = (id) => {
    return request({
        url: `/admin/task.message/edit?id=${id}`,
    })
}

export const getAllMessageListData = () => {
    return request({
        url: '/admin/task.message/index',
        method: 'post'
    })
}

export const updateMessageById = (id, data) => {
    return request({
        url: `/admin/task.message/edit?id=${id}`,
        method: 'post',
        data
    })
}

export const addMessageItem = (data) => {
    return request({
        url: '/admin/task.message/add',
        method: 'post',
        data
    })
}

export const getAddMenu = () => {
    return request({
        url: '/admin/task.message/add',
    })
}


export const deleteMessageById = (id) => {
    return request({
        url: `/admin/task.message/del?id=${id}`,
        method: 'post'
    })
}

export const searchMenuPrompt = (data) => {
    return request({
        url: '/admin/task.message/index',
        method: 'post',
        data
    })
}