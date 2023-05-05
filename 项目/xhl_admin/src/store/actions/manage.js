import request from '../../utils/request'


export const saveRole = (payload) => {
    console.log(payload)
    return {
        type: 'manage/saveRole',
        payload
    }
}

export const getRole = (data) => {
    return async dispatch => {
        const {resData} = await request({
            url: '/admin/auth.admgroup/index',
            method: 'post',
            data
        })

        dispatch(saveRole(resData))
    }
}
