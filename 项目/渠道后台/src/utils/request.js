import axios from "axios";
import { message } from "antd";
import { Logout } from "./api";
// axios.defaults.baseURL = "https://sub.admin.xiaohuolongfujiankeji.com";
const instance = axios.create({
  // baseUrl: "https://l.sub.admin.xiaohuolongfujiankeji.com/index.php/",
  timeout: 3000,
});
instance.interceptors.request.use((config) => {
  return config;
});
// 添加响应拦截器;
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    const { code, data, msg } = response.data;
    // console.log(response);
    if (code == "401") {
      window.localStorage.clear();
      message.warning("登录失效,请先登录在操作");
      Logout();
      setTimeout(() => {
        window.location.href = "/#/login";
      }, 10);
    }
    if (code == "112") {
      message.warning("没有权限");
    }
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;
