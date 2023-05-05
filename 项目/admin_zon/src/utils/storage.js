/**
 * 存储用户相关信息  
 */
const user_info = 'XIAOHUOLONG_APP_USERINFO'
const menu_list = 'XIAOHUOLONG_APP_MENU_LIST'
const btn_list = 'XIAOHUOLONG_APP_BTN_LIST'
const expiration_time = 'XIAOHUOLONG_EXPIRATIONTIME'
const current_menu_item = 'XIAOHUOLONG_APP_CURRENT_MENU_ITEM'
const selected_menu_item ='XIAOHUOLONG_APP_SELECT_MENU_ITEM'
const aside_menu_item ='XIAOHUOLONG_APP_ASIDE_MENU_ITEM'
export const setUserInfo = userInfo => {
    if(typeof userInfo === 'object' && typeof userInfo !== null) {
        userInfo = JSON.stringify(userInfo)
    }
    localStorage.setItem(user_info, userInfo)
}

export const getUserInfo = () => {
    let userInfo = localStorage.getItem(user_info)
    if(typeof userInfo === 'string' && userInfo !== 'undefined') {
        userInfo = JSON.parse(userInfo)
    }
    return userInfo
}

export const hasUserInfo = () => {
    return !!getUserInfo()
}

export const removeUserInfo = () => {
    localStorage.removeItem(user_info)
}

/**
 * 存储用户点击的菜单项
 * 
 */ 
export const getCurrentMenuItem = () => {
    let menuItem = localStorage.getItem(current_menu_item)
    if(typeof menuItem === 'string' && menuItem !== 'undefined') {
        menuItem = JSON.parse(menuItem)
    }
    return menuItem
}

export const setCurrentMenuItem = menuItem => {
    if(typeof menuItem === 'object' && typeof menuItem !== null) {
        menuItem = JSON.stringify(menuItem)
    }
    // console.log(menuItem,"reducer");
    localStorage.setItem(current_menu_item, menuItem)
}

export const removeCurrentMenuItem = () => {
    localStorage.removeItem(current_menu_item)
}
// 侧边栏
export const getAsideMenuItem = () => {
    let menuItem = localStorage.getItem(aside_menu_item)
    if(typeof menuItem === 'string' && menuItem !== 'undefined') {
        menuItem = JSON.parse(menuItem)
    }
    return menuItem
}

export const setAsideMenuItem = menuItem => {
    if(typeof menuItem === 'object' && typeof menuItem !== null) {
        menuItem = JSON.stringify(menuItem)
    }
    localStorage.setItem(aside_menu_item, menuItem)
}

export const removeAsideMenuItem = () => {
    localStorage.removeItem(aside_menu_item)
}
export const hasCurrentMenuItem = () => {
    return !!getCurrentMenuItem()
}

/**
 * 存储用户选中的item
 * */ 
 export const getSelectMenuItem = () => {
    let slecetmenuItem = localStorage.getItem(selected_menu_item)
    if(typeof slecetmenuItem === 'string' && slecetmenuItem !== 'undefined') {
        slecetmenuItem = JSON.parse(slecetmenuItem)
    }
    return slecetmenuItem
}

export const setSelectMenuItem = slecetmenuItem => {
    if(typeof slecetmenuItem === 'object' && typeof slecetmenuItem !== null) {
        slecetmenuItem = JSON.stringify(slecetmenuItem)
    }
    localStorage.setItem(selected_menu_item, slecetmenuItem)
}

export const removeSelectMenuItem = () => {
    localStorage.removeItem(selected_menu_item)
}

export const hasSelectMenuItem = () => {
    return !!getSelectMenuItem()
}


/**
 * 存储用户表单
 */ 

export const setMenuList = menuList => {
    if(typeof menuList === 'object' && typeof menuList !== null) {
        menuList = JSON.stringify(menuList)
    }
    localStorage.setItem(menu_list, menuList)
}

export const getMenuList = () => {
    let menuList = localStorage.getItem(menu_list)
    if(typeof menuList === 'string' && menuList !== 'undefined') {
        menuList = JSON.parse(menuList)
    }
    return menuList
}

export const hasMenuList = () => {
    return !!getMenuList()
}

export const removeMenuList = () => {
    localStorage.removeItem(menu_list)
}

/**
 * 存储用户权限按钮
 */ 

 export const setBtnList = btnList => {
    if(typeof btnList === 'object' && typeof btnList !== null) {
        btnList = JSON.stringify(btnList)
    }
    localStorage.setItem(btn_list, btnList)
}

export const getBtnList = () => {
    let btnList = localStorage.getItem(btn_list)
    if(typeof btnList === 'string' && btnList !== 'undefined') {
        btnList = JSON.parse(btnList)
    }
    return btnList
}

export const hasBtnList = () => {
    return !!getBtnList()
}

export const removeBtnList = () => {
    localStorage.removeItem(btn_list)
}

/**
 * 存储用户登录过期时间
 */ 

export const setExpirationTime = expirationTime => {
    localStorage.setItem(expiration_time, expirationTime)
}

export const getExpirationTime = () => {
    return localStorage.getItem(expiration_time)
}

export const removeExpirationTime = () => {
    localStorage.removeItem(expiration_time)
}
