import request from "../utils/request";

export const getYilanuserById = (id) => {
  return request({
    url: `/admin/yilan.yilanfile/edit?id=${id}`,
  });
};
export const upYilanuserById = (id,data) => {
  return request({
    url: `/admin/yilan.yilanfile/uploadfile?id=${id}`,
    method:"post",
    data
  });
};
export const getYilanuserData = (data) => {
  return request({
    url: "/admin/yilan.yilanfile/index",
    method: "post",
    data
  });
};

export const updateTaskListById = (id, data) => {
  return request({
    url: `/admin/yilan.yilanfile/edit?id=${id}`,
    method: "post",
    data,
  });
};

export const addTaskList = (data) => {
  return request({
    url: "/admin/yilan.yilanfile/add",
    method: "post",
    data,
  });
};

export const addTaskItem = (data) => {
  return request({
    url: "/admin/yilan.yilanfile/edit",
    method: "post",
    data
  });
};

export const deleteTaskListById = (id) => {
  return request({
    url: `/admin/yilan.yilanfile/del?id=${id}`,
    method: "post",
  });
};

export const getOptions = () => {
  return request({
    url: "/admin/yilan.yilanfile/index",
    method: "post",
  });
};

export const searchTaskList = (data) => {
  return request({
    url: "/admin/task.task/index",
    method: "post",
    data,
  });
};
export const getAllKey = (id) => {
  return request({
      url: `/admin/yilan.yilanfile/uploadfile?id=${id}`,

  })
}