// 用户 Token 的本地缓存键名
const TOKEN_KEY = "xhl_token";
const MENU_LIST = "xhl_menuList";
const USER_INFO = "xhl_userInfo";

/**
 * 从本地缓存中获取 Token 信息
 */
export const getTokenInfo = () => {
  console.log(TOKEN_KEY);
  return JSON.parse(localStorage.getItem(TOKEN_KEY));
};

/**
 * 将 Token 信息存入缓存
 * @param {Object} tokenInfo 从后端获取到的 Token 信息
 */
export const setTokenInfo = (tokenInfo) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenInfo));
};

/**
 * 删除本地缓存中的 Token 信息
 */
export const removeTokenInfo = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 判断本地缓存中是否存在 Token 信息
 */
export const hasToken = () => {
  return !!getTokenInfo();
};

/**
 *  存储列表到本地
 *  */
export const setMenuList = (data) => {
  localStorage.setItem(MENU_LIST, JSON.stringify(data));
};

/**
 *  从本地获取列表
 *  */ export const getMenuList = () => {
  return JSON.parse(localStorage.getItem(MENU_LIST)) || {};
};

/**
 *  判断本地是否存在列表
 *  */ export const hasMenuList = () => {
  return !!getMenuList();
};

export const removeMenuList = () => {
  localStorage.removeItem(MENU_LIST);
};

/**
 *  存储用户信息到本地
 *  */
export const setUserInfo = (data) => {
  localStorage.setItem(USER_INFO, JSON.stringify(data));
};

/**
 *  从本地获取用户信息
 *  */ export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem(USER_INFO)) || {};
};

/**
 *  判断本地是否存在用户信息
 *  */ export const hasUserInfo = () => {
  return !!getMenuList();
};

export const removeUserInfo = () => {
  localStorage.removeItem(USER_INFO);
};
