// import axios from "axios";
import { post, get } from "../utils/request";
const Id = localStorage.getItem("Id");
// 登入
export function login(data) {
  console.log(data);
  const params = new URLSearchParams();
  params.append("name", data.name);
  params.append("pwd", data.pwd);
  params.append("dataId", 1);
 params.append("equipment", data.equipment);
  console.log(params);
  return post({
    url: "/sub_admin/index/login",
    method: "post",
    data: params,
  });
}
// 退出登入
export function logout() {
  return get({
    url: "/sub_admin/index/logout",
    method: "get",
  });
}
// 子账号管理
export function getSubAccount(page, pageSize) {
  const Id = localStorage.getItem("Id");
  const params = new URLSearchParams();

  params.append("id", Id);
  params.append("page", page);
  params.append("limit", pageSize);
  return post({
    url: "/sub_admin/subcontractor.SubcontractorSubc/sel",
    // method: "post",
    data: params,
  });
}

//版权展示>
export function getHot() {
  const params = new URLSearchParams();
  return post({
    url: "/sub_admin/copyright.Copyrightc/sel",
    // method: "post",
  data: params,
  });
}

// 获取版权展示的所有信息 //搜索版权的查询
export function getCopyright() {
  // const params = new URLSearchParams();
  // params.append();
  return post({
    url: "/sub_admin/copyright.Copyrightc/serach",
    // data: params,
  });
}

export function postCopyright(value) {
  const params = new URLSearchParams();
  params.append("value", value);
  return post({
    url: "/sub_admin/copyright.Copyrightc/serach",
    data: params,
  });
}

// 任务的筛选与获取
export function postCopyrighttype(type) {
  const params = new URLSearchParams();
  params.append("year", type.year);
  params.append("classify", type.classify);
  params.append("regiona", type.regiona);
  params.append("level", type.level);
  params.append("score", type.score);
  params.append("shelves", type.shelves);
  params.append("make", type.make);
  params.append("hot", type.hot);
  return post({
    url: "/sub_admin/copyright.Copyrightc/serach",
    data: params,
  });
}
// 新用户注册
export function signUp(data) {
  const params = new URLSearchParams();
  params.append("name", data.name);
  params.append("pwd", data.password);
  params.append("confirm", data.confirm);
  params.append("code", data.code);
  params.append("captcha", data.captcha);
  params.append("file", data.file);
  params.append("nickname", data.nickname);
  params.append("videodirection", data.videodirection);
  params.append("often", data.often);
  params.append("type", data.type);
  params.append("card_id", data.card_id);
  params.append("names", data.names);
  params.append("introduction", data.introduction);

  return post({
    url: "/sub_admin/index/signin",
    data: params,
  });
}
// 上传视频
export function pubUp(data) {
  console.log(data.label);
  const Id = localStorage.getItem("Id");
  const params = new URLSearchParams();
  params.append("titles", data.activity);
  params.append("subcontractor_sub_id", Id);
  params.append("introduction", data.brief);
  params.append("copyright", data.copyright);
  params.append("type", data.inspiration);
  params.append("label", data.label);
  params.append("title", data.title);
  params.append("classify", data.type);
  params.append("img", data.upload);
  params.append("video", data.video);
  // params.append("times", data.times);
  // params.append("size", data.size);
  return post({
    url: "/sub_admin/video.Videoc/add",
    data: params,
  });
}
// 上传图片
export function pubUpImg(data) {
  console.log(data);
  const params = new URLSearchParams();
  params.append("file", data);
  console.log(params);
  return post({
    url: "/sub_admin/common.Upload/uploadImage",
    data: data,
  });
}
// 上传视频
export function pubUpVideo() {
console.log(5);
  return post({
    url: "/sub_admin/common.upload/uploadvideosign",
  });
}
// 获取任务抽屉
export function getTask() {
  return get({
    url: "/sub_admin/task.TaskDrawerc/sel",
  });
}
// 获取活动列表
export function getTaskList(data) {
  const params = new URLSearchParams();
  // params.append("status", data.status);
  params.append("hot", data.classification);
  params.append("page", 1);
  params.append("pageSize", 100);

  return post({
    url: "/sub_admin/news.NewActivityc/sel",
    data: params
  });
}
// 获取我的活动
export function getMyTaskList(data) {
 
  const params = new URLSearchParams();
  params.append("id", Id);
  params.append("page", data.page);
  params.append("hot", data.classification);
  params.append("pageSize", data.pageSize);
  return post({
    url: "/sub_admin/news.NewActivitySub/join",
    data: params
  });
}
// 获取任务列表
export function getJob(data) {
  const params = new URLSearchParams();
  params.append("type", data.type);
 params.append("page", data.page);
  params.append("pageSize", data.pageSize);
  params.append("speed", data.speed);
  params.append("times", data.times);
  params.append("id", data.id);
  params.append("Verticillata", data.Verticillata);
 
  // console.log(data);
  return post({
    url: "/sub_admin/task.Taskc/sel",
    data: params
  });
}
// 获取我抢到的任务
export function getMyJob(data) {
  const params = new URLSearchParams();
  params.append("id", Id);
  params.append("page", data.page);
  params.append("pageSize", data.pageSize);
  params.append("speed", data.speed);
  params.append("times", data.times);
  params.append("Verticillata", data.Verticillata);
  return post({
    url: "/sub_admin/task.TaskJoinc/rob",
    data: params
  });
}


// 抢任务
export function getRob(data) {
  const params = new URLSearchParams();
  const Id = localStorage.getItem("Id");
  // console.log(data);
  params.append("task_id", data);
  params.append("subcontractor_id", Id);
  return post({
    url: "/sub_admin/task.TaskJoinc/join",
    data: params,
  });
}
// 获取公告列表
export function getNotice() {
  return get({
    url: "/sub_admin/news.Newsc/sel",
  });
}
// 获取全部的公告
export function getNoticeAll(data) {
  const params = new URLSearchParams();
  params.append("Notice", data.Notice);

  params.append("page", data.page);
  params.append("pageSize", data.pageSize);
  // console.log(data);
  return post({
    url: "/sub_admin/news.Newsc/allsel",
    data: params,
  });
}
// 获取公告活动列表
export function getNoticeList() {
  return get({
    url: "/sub_admin/news.NewActivityc/inquire",
  });
}
// 获取我的视频列表
export function getMyVideo(data) {
  const params = new URLSearchParams();
  params.append("id", data.id);
  params.append("page", data.page);
  params.append("limit", data.pageSize);
  params.append("past", data.past);
  params.append("video", data.video);
  params.append("state", data.state);
  params.append("past", data.past);
  params.append("theDay", data.theDay);
  return post({
    url: "/sub_admin/video.Videoc/selcontent",
    data: params,
  });
}
// 删除对应的我的视频
export function delMyVideo(data) {
  console.log(data);
  const params = new URLSearchParams();
  params.append("id", data);
  return post({
    url: "/sub_admin/video.Videoc/delcontent",
    data: params,
  });
}
// 获取任务详情文
export function getTaskDetail(data) {
  const params = new URLSearchParams();
  params.append("id", data);
  return post({
    url: "/sub_admin/task.Taskc/single",
    data: params,
  });
}
// 获取活动详情文
export function getTaskDetailList(data) {
  const params = new URLSearchParams();
  params.append("id", data);
  return post({
    url: "/sub_admin/news.NewActivityc/single",
    data: params,
  });
}
    
// 获取视频列表
export function getVideoList(data) {
  const params = new URLSearchParams();
  params.append("id", data.id);
  params.append("page", data.page);
  params.append("limit", data.pageSize);
  params.append("past", data.past);
  params.append("theDay", data.theDay);
  params.append("title", data.value);
  return post({
    url: "/sub_admin/video.VideoFilec/sel",
    data: params,
  });
}
// 获取视频查询
export function getVideo() {
  const Id = localStorage.getItem("Id");
  const params = new URLSearchParams();
  params.append("id", Id);
  return post({
    url: "/sub_admin/video.VideoCollectionc/sel",
    data: params,
  });
}

// 消息通知查询
export function getMessage() {
  return post({
    url: "/sub_admin/message.Messagec/sel",
  });
}
// 获取状态数据
export function getAccountstatus() {
  const Id = localStorage.getItem("Id");
  const params = new URLSearchParams();
  params.append("id", Id);
  return post({
    url: "/sub_admin/subcontractor.SubcontractorSubc/selectaccount",
    data: params,
  });
}
// 上传合辑数据
export function getVideoCollectionc(values) {
  return post({
    url: "/sub_admin/video.VideoCollectionc/add",
    data: values,
  });
}
// 设置 
// 获取安全操作
export function getSafe(data) {
  console.log(data);
  const params = new URLSearchParams();
  params.append("id", Id);
  params.append("page", data.page);
  // params.append("equipment", data.equipment);
  // params.append("ip", data.ip);
  params.append("pageSize", data.pageSize);

  return post({
    url: "/sub_admin/LoginRecordc/sel",
    data: params,
  });
}
// 提交设备型号
export function getEquipment(data) {
  const params = new URLSearchParams();
  params.append("equipment", data.equipment);
  params.append("login_time", data.login_time);
  return post({
    url: "/sub_admin/LoginRecordc/add",
    data: params,
  });
}
