import request from "../utils/request";

export const getVideoListById = (id) => {
  return request({
    url: `/admin/video.video/audit?id=${id}`,
  });
};

export const getVideoListData = () => {
  return request({
    url: "/admin/video.video/index",
    method: "post",
  });
};

export const updateTaskListById = (id, data) => {
  return request({
    url: `/admin/video.video/audit?id=${id}`,
    method: "post",
    data,
  });
};

export const addTaskList = (data) => {
  return request({
    url: "/admin/video.video/add",
    method: "post",
    data,
  });
};

export const addTaskItem = () => {
  return request({
    url: "/admin/video.video/add",
  });
};

export const deleteTaskListById = (id) => {
  return request({
    url: `/admin/video.video/del?id=${id}`,
    method: "post",
  });
};

export const getOptions = () => {
  return request({
    url: "/admin/video.video/index",
    method: "get",
  });
};

export const searchTaskList = (data) => {
  return request({
    url: "/admin/task.task/index",
    method: "post",
    data,
  });
};
