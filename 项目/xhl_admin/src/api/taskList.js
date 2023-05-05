import request from "../utils/request"

export const getTaskListById = (id) => {
    return request({
        url: `/admin/task.task/edit?id=${id}`,
    })
}

export const getAllTaskListData = () => {
    return request({
        url: '/admin/task.task/index',
        method: 'post'
    })
}


export const updateTaskListById = (id, data) => {
    return request({
        url: `/admin/task.task/edit?id=${id}`,
        method: 'post',
        data
    })
}

export const addTaskList = (data) => {
    return request({
        url: '/admin/task.task/add',
        method: 'post',
        data
    })
}

export const addTaskItem = () => {
    return request({
        url: '/admin/task.task/add',
    })
}


export const deleteTaskListById = (id) => {
    return request({
        url: `/admin/task.task/del?id=${id}`,
        method: 'post'
    })
}

export const getOptions = () => {
    return request({
        url: '/admin/task.task/index',
        method: 'get'
    })
}

export const searchTaskList = (data) => {
    return request({
        url: '/admin/task.task/index',
        method: 'post',
        data
    })
}
