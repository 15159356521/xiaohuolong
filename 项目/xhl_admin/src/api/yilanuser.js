import request from "../utils/request";

export const getYilanuserById = (id) => {
  return request({
    url: `/admin/yilan.yilanuser/edit?id=${id}`,
  });
};
export const upYilanuserById = (id,data) => {
  return request({
    url: `/admin/yilan.yilanuser/uploadfile?id=${id}`,
    method:"post",
    data
  });
};
export const getYilanuserData = (data) => {
  return request({
    url: "/admin/yilan.yilanuser/index",
    method: "post",
    data
  });
};

export const updateTaskListById = (id, data) => {
  return request({
    url: `/admin/yilan.yilanuser/edit?id=${id}`,
    method: "post",
    data,
  });
};

export const addTaskList = (data) => {
  return request({
    url: "/admin/yilan.yilanuser/add",
    method: "post",
    data,
  });
};

export const addTaskItem = (data) => {
  return request({
    url: "/admin/yilan.yilanuser/edit",
    method: "post",
    data
  });
};

export const deleteTaskListById = (id) => {
  return request({
    url: `/admin/yilan.yilanuser/del?id=${id}`,
    method: "post",
  });
};

export const getOptions = () => {
  return request({
    url: "/admin/yilan.yilanuser/index",
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
export const getAllKey = (id) => {
  return request({
      url: `/admin/yilan.yilanuser/uploadfile?id=${id}`,

  })
}