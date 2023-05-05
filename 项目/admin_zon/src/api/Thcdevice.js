import request from "../utils/request";

export const getUp = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Thcdevice/b/index`,
    method: "get",
  });
};

export const getAllList = (data) => {
  return request({
    url: "/tdb/index/a/tdb.Thcdevice/b/index",
    method: "post",
    data,
  });
};
export const addRole = (data) => {
  return request({
    url: "auth.admgroup/add",
    method: "post",
    data,
  });
};

export const getDel = (id) => {
  return request({
    url: `/auth.admgroup/del?id=${id}`,
    method: "post",
  });
};

export const postAdd = (data) => {
  return request({
    url: "/tdb/index/a/tdb.Thcdevice/b/add",
    method: "post",
    data,
  });
};

export const PostUp = (id, data) => {
  return request({
    url: `/tdb/index/a/tdb.Thcdevice/b/edit?id=${id}`,
    method: "post",
    data,
  });
};
// 绑定
export const PostBind = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Thcdevice/b/sendqrcode?id=${id}`,
    method: "post",
  });
}
export const PostVideo = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Thcdevice/b/sendvideo?id=${id}`,
    method: "post",
  });
}