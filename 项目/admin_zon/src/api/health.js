import request from "../utils/request";
// 获取用户列表
export function getAllList(data) {
  return request({
    url: "/tdb/index/a/tdb.Health/b/index",
    method: "post",
    data,
  });
}
// 查
export const getUp = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Health/b/edit?id=${id}`,
  });
};
export const getRoleBtn = (id) => {
  return request({
    url: `/home/btnlist?id=${id}`,
    method: "post",
  });
};
// 改
export const PostUp = (id, data) => {
  return request({
    url: `/tdb/index/a/tdb.Health/b/edit?id=${id}`,
    method: "post",
    data,
  });
};
// 增
export const PostAdd = (data) => {
  return request({
    url: "/tdb/index/a/tdb.Health/b/add",
    method: "post",
    data,
  });
};
export const PostDel = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Health/b/del?id=${id}`,
    method: "post",
  });
};
export const UpImg= (data) => {
  return request({
    url: "/common.upload/uploadImage",
    method: "post",
    data,
  });
}
export const getAdd = () => {
  return request({
      url: '/tdb/index/a/tdb.Health/b/add',
      method: 'get',

  })
}