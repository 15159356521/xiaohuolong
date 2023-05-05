import request from "../utils/request";
// 获取用户列表
export function getAllList(data) {
  return request({
    url: "/Home/index",
    method: "post",
    data,
  });
}
