import axios from "axios";
import { message } from "antd";
import { logout } from "../api/user";
// axios.defaults.baseURL = "https://sub.admin.xiaohuolongfujiankeji.com";
export const post = axios.create({
  timeout: 3000, //延迟时间
  method: "POST",
  headers: {
    "content-Type": "application/x-www-form-urlencoded",
    // "pc-token": "4a82b23dbbf3b23fd8aa291076e660ec", //后端提供
  },
});
export const get = axios.create({
  timeout: 3000, //延迟时间
  method: "GET",
  headers: {
    "content-Type": "application/x-www-form-urlencoded",
    // "pc-token": "4a82b23dbbf3b23fd8aa291076e660ec", //后端提供
  },
});

// 请求拦截
post.interceptors.request.use((config) => {
  // 设置请求头和携带的token
  // let token = localStorage.getItem("token");
  // if (token) {
  //   config.headers.token = localStorage.getItem("token");
  // }
  // const params = new URLSearchParams();
  if (localStorage.getItem("recognize")) {
    config.data.append("recognize", localStorage.getItem("recognize"));

  return config;
  }else{

    return config;
  }


});
// 响应拦截
post.interceptors.response.use(
  (response) => {
  // console.log(response);
    if (response.data.code == 401) {
      message.error({content:"登录过期，请重新登录",key:"error"});
      window.location.href = "/#/login";
      window.localStorage.clear();
      logout()
      return  
    } else{
      return response.data
      //  console.log(36);
    }
  },
  (err) => {
    console.log(err);
  }
);

get.interceptors.request.use((config) => {
  return config;
});

// 响应拦截
get.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (err) => {
    console.log(err);
  }
);
