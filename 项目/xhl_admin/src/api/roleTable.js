import request from "../utils/request";

export const getPlatData = () => {
    return request({
        url: '/admin/copyright.Copyright/index',
        method: 'post',
    })
}

export const getPlatDataById = (id) => {
    return request({
        url: `/admin/copyright.Copyright/edit?id=${id}`,
        method: 'get'
    })
}


export const updataPlatDataById = (id, data) => {
    console.log(data);
    return request({
        url: `/admin/copyright.Copyright/edit?id=${id}`,
        method: 'post',
        data
    })
}

export const deletePlatDataById = (id) => {
    return request({
        url: `/admin/copyright.Copyright/del?id=${id}`,
        method: 'post'
    })
}

export const getPlatOption = () => {
    return request({
        url: '/admin/copyright.Copyright/add',
        method: 'get'
    })
}

export const addPlatData = (data) => {
    return request({
        url: '/admin/copyright.Copyright/add',
        method: 'post',
        data
    })
}


export const getOptions = () => {
    return request({
        url: '/admin/copyright.Copyright/index',
        method: 'get'
    })
}

export const searchPlatList = (data) => {
    return request({
        url: '/admin/copyright.Copyright/index',
        method: 'post',
        data
    })
}
