import request from "../utils/request";
// 获取用户列表
export function getAllList(data) {
  return request({
    url: "/tdb/index/a/tdb.Thcearningsratio/b/index",
    method: "post",
    data,
  });
}
// 查
export const getUp = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Thcearningsratio/b/edit?id=${id}`,
  });
};

// 改
export const PostUp = (id, data) => {
  return request({
    url: `/tdb/index/a/tdb.Thcearningsratio/b/edit?id=${id}`,
    method: "post",
    data,
  });
};
// 增
export const PostAdd = (data) => {
  return request({
    url: "/tdb/index/a/tdb.Thcearningsratio/b/add",
    method: "post",
    data,
  });
};
export const getDel = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Thcearningsratio/b/del?id=${id}`,
    method: "post",
  });
};
export const getAdd = () => {
    return request({
        url: '/auth.admgroup/add',
        method: 'get'
    })
}