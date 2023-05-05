import request from "../utils/request"

export const getTaskDrawerById = (id) => {
    return request({
        url: `/admin/task.taskdrawer/edit?id=${id}`,
    })
}

export const getAllTaskDrawerData = () => {
    return request({
        url: '/admin/task.taskdrawer/index',
        method: 'post'
    })
}


export const updateTaskById = (id, data) => {
    return request({
        url: `/admin/task.taskdrawer/edit?id=${id}`,
        method: 'post',
        data
    })
}

export const addTask = (data) => {
    return request({
        url: '/admin/task.taskdrawer/add',
        method: 'post',
        data
    })
}

export const deleteTaskById = (id) => {
    return request({
        url: `admin/task.taskdrawer/del?id=${id}`,
        method: 'post'
    })
}