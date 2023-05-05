import React, { useState, useEffect } from "react";
import {
  Card,
  Breadcrumb,
  Button,
  Table,
  Space,
  Modal,
  Form,
  message,
  Input,
  Upload,
  Select,
  Switch,
} from "antd";
import aa from "./logo.png";
import axios from "axios";
import {
  addTaskItem,
  addTaskList,
  getYilanuserById,
  getYilanuserData,
  updateTaskListById,
  deleteTaskListById,
  getAllKey,
  upYilanuserById,
} from "../../api/yilanuser";
import ImgCrop from "antd-img-crop";
import { getRoleBtn } from "../../api/role";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { getBase64 } from "../../utils";
import { useRef } from "react";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { baseIMgURL } from "../../utils/request";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import routerContant from "../../utils/constant";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
const { Column } = Table;

export default function ParentAccount() {
  const location = useLocation();
  const id = routerContant[location.pathname.split("/").pop()].split("-").pop();
  const [roleBtn, setRoleBtn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isKeyModal, setIsKeyModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [tokey, setToKey] = useState();

  const formRef = useRef();

  const keyRef = useRef();
  const navigate = useNavigate();
  const [paginationPramas, setPaginationPramas] = useState({
    current: 1, //当前页码
    pageSize: 10, // 每页数据条数
    total: "", // 总条数
    onChange: (current, size) => handlePageChange(current, size), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: true,
  });
  const [formOption, setFormOption] = useState({
    task_class: [
      { key: 1, value: "体育" },
      { key: 3, value: "军事" },
      { key: 4, value: "搞笑" },
      { key: 5, value: "财经" },
      { key: 7, value: "科技" },
      { key: 9, value: "汽车" },
      { key: 10, value: "音乐" },
      { key: 13, value: "健康" },
      { key: 16, value: "广告" },
      { key: 19, value: "资讯" },
      { key: 22, value: "电影" },
      { key: 23, value: "电视剧" },
      { key: 24, value: "综艺" },
      { key: 26, value: "美食" },
      { key: 58, value: "百科" },
      { key: 63, value: "历史" },
      { key: 68, value: "广场舞" },
      { key: 70, value: "两性" },
      { key: 72, value: "健身" },
      { key: 79, value: "记录访谈" },
      { key: 81, value: "摄影" },
      { key: 85, value: "时尚" },
      { key: 90, value: "母婴" },
      { key: 93, value: "游戏" },
      { key: 94, value: "情感" },
      { key: 97, value: "书画" },
      { key: 98, value: "教育" },
      { key: 103, value: "职场" },
      { key: 104, value: "宗教" },
      { key: 112, value: "收藏" },
      { key: 120, value: "萌娃" },
      { key: 121, value: "二次元" },
      { key: 122, value: "读书" },
      { key: 134, value: "美女" },
      { key: 188, value: "手工" },
      { key: 191, value: "家居" },
      { key: 192, value: "旅行" },
      { key: 194, value: "趣玩" },
      { key: 196, value: "少儿" },
      { key: 197, value: "星座命理" },
      { key: 199, value: "萌宠" },
      { key: 209, value: "曲艺" },
      { key: 216, value: "三农" },
      { key: 218, value: "猎奇" },
      { key: 242, value: "动漫" },
      { key: 1005, value: "vlog" },
    ],
    platform_class: [
      { key: 0, value: "pgc" },
      { key: 1, value: "ugc" },
    ],
  });
  const handlePageChange = (current, pageSize) => {
    setPaginationPramas((preState) => ({ ...preState, current, pageSize }));
  };
  const [formData, setFormData] = useState({
    name: "",
    app_key: "",
    app_secret: "",
    author_hash: "",
    createtime: "",
  });
  const [upFormData, setUpFormData] = useState({
    title: "",
    cover: "",
    cover1: "",
    src: "",
    platform: 0,
    category_id: 1,
    tags: [],
    is_draft: true,
  });
  // 上传图片
  const [upfileList, setUpFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [upVideoList, setUpVideoList] = useState([]);
  const [videoStatus, setVideoStatus] = useState("+ 上传视频");
  const [titles, setTitle] = useState("");
  const onUpdataChange = ({ fileList: newFileList }) => {
    // setUpFileList(newFileList);
    // console.log(newFileList,'newFileList');
    //   console.log(upfileList, "xxx");
    //   setFormData((preState) => ({
    //     ...preState,
    //     img:
    //       newFileList.length === 0 ? null : upfileList
    //   }));
  };

  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/gif" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("图片仅支持jpg,png,gif,jpeg");
    }

    const isLt2M = file.size / 1024 / 1024 < 5;

    if (!isLt2M) {
      message.error("图片大小为5MB");
    }

    return isJpgOrPng && isLt2M;
  };
  const onUpdataPreview = async (file) => {
    console.log(file);
    if (!file.url && !file.preview) {
      file.preview = await file.url;
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url);
  };

  const getParentAccountData = async () => {
    setLoading(true);
    const { code, resData, count } = await getYilanuserData();
    console.log(resData, "resData");
    setTableData(resData);
    setPaginationPramas((preState) => ({ ...preState, total: count }));
    setLoading(false);
  };

  useEffect(() => {
    (async function () {
      getParentAccountData();
      const { code, resData, count, msg } = await getRoleBtn(id);
      console.log(
        "🚀 ~ file: index.jsx ~ line 71 ~ code, resData, count, msg",
        code,
        resData,
        count,
        msg
      );
      if (code === 200) {
        setRoleBtn(resData.btn_list);
      } else if (code === 401) {
        message.warning(msg);
        navigate("/login", { replace: false, state: { id: id } });
      }
    })();
  }, []);

  // 修改、添加
  const handleOk = async () => {
    if (formData.id) {
      const fileds = await formRef.current.validateFields();
      console.log(11, fileds, formData);
      const { code, msg } = await updateTaskListById(formData.id, {
        ...fileds,
      });

      if (code === 200) {
        getParentAccountData();
        message.success(msg);
        setIsOpenModal(false);
      } else {
        setIsOpenModal(false);
        message.warning(msg);
      }
    } else {
      const fileds = await formRef.current.validateFields([
        "name",
        "app_key",
        "app_secret",
        "author_hash",
      ]);
      console.log(fileds);
      const { code, msg } = await addTaskList({
        ...fileds,
      });
      if (code === 400) {
        message.warning(msg);
        return;
      } else {
        message.success(msg);
        getParentAccountData();
        setIsOpenModal(false);
      }
    }
  };

  // 删除
  const handlerOk = async (id) => {
    try {
      const res = await deleteTaskListById(id);
      await getParentAccountData();
      message.success("删除成功");
    } catch (e) {
      message.warning("删除失败");
    }
  };

  const handlerDel = (record) => {
    Modal.confirm({
      title: `确定删除${record.name}吗?`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: () => handlerOk(record.id),
    });
  };

  // 点击添加按钮显示弹窗
  const handlerAdd = async () => {
    setIsOpenModal(true);
    setFormData({
      name: "",
      app_key: "",
      app_secret: "",
      author_hash: "",
    });

  };

  // 编辑操作
  const handlerEidt = async (record) => {
    console.log(
      "🚀 ~ file: index.jsx ~ line 192 ~ handlerEidt ~ record",
      record
    );
    try {
      const { msg, resData, code } = await getYilanuserById(record.id);
      console.log(
        "🚀🚀🚀 ~ file: index.jsx ~ line 194 ~ handlerEidt ~ resData",
        resData
      );
      if (code === 200) {
        setFormOption(resData);
        console.log(111, resData);
        setFormData(resData.info);
        // const filesList = [];
        // filesList.push({
        //   name: resData.info.avatar.split("/")[
        //     resData.info.avatar.split("/").length - 1
        //   ],
        //   url: `${baseIMgURL}${resData.info.avatar}`,
        // });
        // console.log(
        //   "🚀 ~ file: index.jsx ~ line 203 ~ handlerEidt ~ filesList",
        //   filesList
        // );

        setIsOpenModal(true);
      } else {
        message.warning(msg);
        return;
      }
    } catch (error) {
      message.warning(error);
    }
    setIsOpenModal(true);
  };
  // 上传视频
  const upVideo = async (record) => {
    // console.log(record,"record");

    try {
      setIsKeyModal(true);
      const { resData } = await getAllKey(record.id);
      console.log(resData);
      setToKey(resData.info);
    } catch (error) {
      message.warning(error);
    }
  };
  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
  };

  const handlePicCancel = () => {
    setPreviewOpen(false);
  };
  // 搜索功能
  const [form] = Form.useForm();
  const [keyForm] = Form.useForm();
  keyForm.setFieldsValue({
    title: titles,
  });
  const onReset = async () => {
    form.resetFields();
  };

  const onFinish = async (value) => {
    const { code, msg, resData } = await getYilanuserData(value);
    if (code === 200) {
      message.success("查询成功");
      setTableData(resData);
      setPaginationPramas((preState) => ({
        ...preState,
        total: resData.total,
      }));
      console.log(msg);
    } else {
      message.warning(msg);
      return;
    }
  };
  const handleKeyOk = async () => {
    let fileds = await keyRef.current.validateFields();
    fileds.cover = upfileList[0].src;
    fileds.src = upVideoList[0].src;
    fileds.cover1 = upFormData.cover1;
    fileds.src1 = `http://b-pgc.oss-cn-beijing.aliyuncs.com/${upVideoList[0].src}`;
    // console.log(upVideoList[0].src1, "upVideoList[0].src1");
 
    // fileds.platform = Number(0);
    // fileds.category_id = 1;
    console.log(formData.cover1, "fileds");
    // console.log(fileds);
    const { msg, code } = await upYilanuserById(1, fileds);
    if (code === 200) {
      message.success("上传成功");
      setUpFormData({
        cover: "",
        src: "",
        title: "",
        tags: [],
      });
      setIsKeyModal(false);

      setUpVideoList([]);
      setUpFileList([]);

      setVideoStatus("+ 上传视频");
    } else {
      // 字符串前两位字删除
      // console.log(msg.split(";")[2], "code");

      message.warning({
        content: msg,
        maxCount: 1,
        key: "task",
      });
      return;
    }
  };
  const handleKeyCancel = () => {
    setUpVideoList([]);
    setUpFileList([]);
    setVideoStatus("+ 上传视频");
    setIsKeyModal(false);
  };

  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item href="#/parentAccount">一览账号</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <Form layout="inline" onFinish={onFinish} form={form}>
            <Form.Item label="名称" name="name">
              <Input
                placeholder="请输入搜索名称"
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  搜索
                </Button>
                <Button
                  htmlType="button"
                  onClick={onReset}
                  icon={<ReloadOutlined />}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card>
          {roleBtn.find((item) => item.title === "添加") ? (
            <Button type="primary" onClick={() => handlerAdd()}>
              添加
            </Button>
          ) : null}
          <Table
            scroll={{ x: 1400 }}
            pagination={paginationPramas}
            rowKey="id"
            dataSource={tableData}
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            <Column
              align="center"
              title="账号"
              dataIndex="name"
              key="name"
              fixed="left"
            />
            <Column
              align="center"
              title="app_key"
              dataIndex="app_key"
              key="app_key"
            />
            <Column
              align="center"
              title="author"
              dataIndex="author_hash"
              key="author_hash"
            />
            <Column
              align="center"
              title="app_secret"
              dataIndex="app_secret"
              key="app_secret"
            />
            <Column
              align="center"
              title="创建时间"
              dataIndex="createtime"
              key="createtime"
            />
            <Column
              align="center"
              title="操作"
              key="operation"
              fixed="right"
              render={(_, record) => (
                <Space size="middle">
                  {roleBtn.find((item) => item.title === "删除") ? (
                    <Button type="link" onClick={() => handlerDel(record)}>
                      删除
                    </Button>
                  ) : null}
                  {roleBtn.find((item) => item.title === "编辑") ? (
                    <Button type="link" onClick={() => handlerEidt(record)}>
                      编辑
                    </Button>
                  ) : null}
                  {roleBtn.find((item) => item.title === "发布视频") ? (
                    <Button type="link" onClick={() => upVideo(record)}>
                      发布视频
                    </Button>
                  ) : null}
                </Space>
              )}
            />
          </Table>

          {isOpenModal ? (
            <Modal
              width={1200}
              title="新增数据"
              open={isOpenModal}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="确定"
              cancelText="取消"
            >
              {console.log(formData)}
              <Form
                ref={formRef}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                initialValues={{
                  ...formData,
                  // status: formData.id? formData.status+'': '',
                  // activeTime: formData.id? [moment(formData.start_time, dateFormat), moment(formData.end_time, dateFormat)]: null
                }}
                autoComplete="off"
              >
                <Form.Item
                  label="名称"
                  name="name"
                  rules={[{ required: true, message: "请输入您的账号名称" }]}
                >
                  <Input placeholder="请输入账号名称" />
                </Form.Item>
                <Form.Item
                  label="密钥"
                  name="app_key"
                  rules={[{ required: true, message: "请输入您的密钥" }]}
                >
                  <Input placeholder="请输入密钥" />
                </Form.Item>

                <Form.Item
                  label="作者"
                  name="author_hash"
                  rules={[{ required: true, message: "请输入作者" }]}
                >
                  <Input placeholder="请输入作者" />
                </Form.Item>

                <Form.Item
                  label="app_secret"
                  name="app_secret"
                  rules={[{ required: true, message: "请输入您的信用评分" }]}
                >
                  <Input placeholder="请输入作者" />
                </Form.Item>
              </Form>
            </Modal>
          ) : null}
          {isKeyModal ? (
            <Modal
              width={1200}
              title="上传视频"
              open={isKeyModal}
              onOk={handleKeyOk}
              onCancel={handleKeyCancel}
              okText="确定"
              cancelText="取消"
            >
              <Form
                ref={keyRef}
                labelCol={{ span: 5 }}
                form={keyForm}
                wrapperCol={{ span: 16 }}
                initialValues={{
                  ...upFormData,
                }}
                autoComplete="off"
              >
                <Form.Item
                  label="封面上传"
                  name="cover"
                  rules={[
                    {
                      // validator: changePic,
                      validator: (rule, value, callback) => {
                        console.log(upfileList, "upfileList");
                        if (upfileList[0]) {
                          callback();
                        } else {
                          callback("请上传封面");
                        }
                      },
                    },
                  ]}
                >
                  {/* <ImgCrop rotate> */}
                  <Upload
                    beforeUpload={beforeUpload}
                    accept="image/*"
                    // action={`/openapi/upload/img${tokey}`}
                    customRequest={(file) => {
                      console.log(file);
                      // file.action = "https://data.xiaozhuyouban.com/upload";
                      const formData = new FormData();

                      // formData.append("filename", "abc");
                      // formData.append("platform", 0);
                      // console.log(tokey);
                      axios
                        .get(
                          // `api/upload/img?filename=${file.file.name}&platform=0`, //线下 这个是可以的

                          `https://mp.yilan.tv/openapi/upload/img?filename=${file.file.name}&platform=0`, //线上 这个出现跨域
                          {
                            headers: {
                              Token: tokey.token,
                              // 携带发送options请求
                              // "Content-Type": "application/json; charset=utf-8",
                              // "Access-Control-Allow-Origin": "*",
                              // "Access-Control-Allow-Methods":
                              //   "GET, POST, PUT, DELETE, OPTIONS",
                              // "Access-Control-Allow-Headers":
                              //   "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild",

                            },
                          }
                        )
                        .then((res) => {
                          console.log(res, "==========================");
                          keyForm.resetFields(["cover"]);
                          console.log(res.data.data, "res.data");
                          const urImg = res.data.data;
                          console.log(urImg, "urImg");
                          formData.append(
                            "OSSAccessKeyId",
                            urImg?.ptk?.accessid
                          );
                          formData.append("key", urImg.object_key);
                          formData.append("callback", urImg.ptk.callback);
                          formData.append("dir", urImg.ptk.dir);
                          formData.append("expire", urImg.ptk.expire);
                          formData.append("policy", urImg.ptk.policy);
                          formData.append("signature", urImg.ptk.signature);
                          formData.append("file", file.file);
                          axios
                            .post(`${urImg.ptk.host}`, formData)
                            .then((res) => {
                              const imgs = {
                                uid: file.file.uid,
                                name: file.file.name,
                                status: "done",
                                url: res.data.data.src,
                                src: res.data.data.object_key,
                              };
                              // console.log(imgs, "imgs");
                              const obj = { ...upFormData };
                              obj.cover = imgs.src;
                              setUpFormData(obj);
                              setUpFileList([imgs]);
                              return file.file
                            }).then(res=>{
                              const formData = new FormData();
                              formData.append("file", res);
                              console.log(res,'sdfsdfsdfsdgsdgdfgdfg')
                              axios({url:'/admin/common.upload/uploadimage',method:"post",data:formData}).then(res=>{
                            
                                const obj = { ...upFormData };
                                obj.cover1 =  res.data.data.url;
                                setUpFormData(obj);
                              })
                            });;
                        });
                    }}
                    listType="picture-card"
                    fileList={upfileList}
                    onChange={onUpdataChange}
                    onPreview={onUpdataPreview}
                    onRemove={(file) => {
                      console.log(file);
                      const obj = { ...upFormData };
                      obj.cover = "";
                      setUpFormData(obj);
                      setUpFileList([]);
                    }}
                  >
                    {upfileList.length < 1 && "+ 上传封面"}
                  </Upload>
                  {/* </ImgCrop> */}
                </Form.Item>
                <Form.Item
                  label="视频上传"
                  name="src"
                  rules={[
                    {
                      required: true,
                      message: "请上传视频",
                      validator: (rule, value, callback) => {
                        console.log(upfileList, "upfileList");
                        if (upVideoList[0]) {
                          callback();
                        } else {
                          callback("请上传视频");
                        }
                      },
                    },
                  ]}
                >
                  <Upload
                    accept="video/*"
                    // action={`/openapi/upload/img${tokey}`}
                    customRequest={(file) => {
                      console.log(file, "file");

                      setTitle(file.file.name.slice(file.name, -4));

                      // file.action = "https://data.xiaozhuyouban.com/upload";
                      const formData = new FormData();

                      // formData.append("filename", "abc");
                      // formData.append("platform", 0);
                      console.log(tokey);
                      axios
                        .get(
                          //  `api/upload/video?filename=${file.file.name}&platform=0`,
                          `https://mp.yilan.tv/openapi/upload/video?filename=${file.file.name}&platform=0`,
                          {
                            headers: { Token: tokey.token },
                          }
                        )
                        .then((res) => {
                          keyForm.resetFields(["src"]);
                          setVideoStatus("上传视频中");

                          console.log(res.data.data, "res.data");
                          const urImg = res.data.data;
                          console.log(urImg, "urImg");
                          formData.append("OSSAccessKeyId", urImg.ptk.accessid);
                          formData.append("key", urImg.object_key);
                          formData.append("callback", urImg.ptk.callback);
                          formData.append("dir", urImg.ptk.dir);
                          formData.append("expire", urImg.ptk.expire);
                          formData.append("policy", urImg.ptk.policy);
                          formData.append("signature", urImg.ptk.signature);
                          formData.append("file", file.file);
                          axios
                            .post(`${urImg.ptk.host}`, formData)
                            .then((res) => {
                              const imgs = {
                                uid: file.file.uid,
                                name: file.file.name,
                                status: "done",
                                url: `${aa}`,
                                src1: res.data.data.url,
                                src: res.data.data.object_key,
                              };
                              console.log(imgs, "res.data.data.src");
                              const obj = { ...upFormData };
                              obj.src = imgs.src;
                              obj.title = imgs.name;
                              setUpFormData(obj);
                              setUpVideoList([imgs]);
                            });
                        });
                    }}
                    listType="picture-card"
                    fileList={upVideoList}
                    onChange={onUpdataChange}
                    onPreview={onUpdataPreview}
                    onRemove={(file) => {
                      setVideoStatus("+ 上传视频");
                      setUpVideoList([]);
                      setUpFormData({ ...upFormData, src: "" });
                    }}
                  >
                    {upVideoList.length < 1 && `${videoStatus}`}
                  </Upload>
                </Form.Item>
                <Form.Item
                  label="标题上传"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "请输入标题",
                    },
                  ]}
                >
                  <Input placeholder="请输入标题" />
                </Form.Item>
                <Form.Item
                  label="分类"
                  name="category_id"
                  rules={[{ required: true, message: "请选择您的分类" }]}
                >
                  <Select
                    placeholder="请选择分类"
                    showArrow
                    value=""
                    onChange={(item) => {
                      setFormData((preState) => ({
                        ...preState,
                        group_id: item,
                      }));
                    }}
                    allowClear
                  >
                    {formOption.task_class.map((item, index) => (
                      // console.log(item),
                      <Select.Option value={item.key} key={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="分类"
                  name="platform"
                  rules={[{ required: true, message: "请选择您的分类" }]}
                >
                  <Select
                    placeholder="请选择分类"
                    showArrow
                    value=""
                    onChange={(item) => {
                      setFormData((preState) => ({
                        ...preState,
                        platform: item,
                      }));
                    }}
                    allowClear
                  >
                    {formOption.platform_class.map(
                      (item, index) => (
                        console.log(item),
                        (
                          <Select.Option value={item.key} key={item.key}>
                            {item.value}
                          </Select.Option>
                        )
                      )
                    )}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="tags"
                  label="标签"
                  width="lg"
                  rules={[
                    {
                      required: true,
                      message: "没有标签",
                      validator: (rule, value) => {
                        console.log(value, "value");
                        if (value.length > 2 && value.length < 6) {
                          return Promise.resolve();
                        }
                        return Promise.reject("请输入三个到五个标签");
                      },
                    },
                  ]}
                  required={false}
                >
                  <Select
                    mode="tags"
                    style={{
                      width: "100%",
                    }}
                    open={false}
                    placeholder="请输入标签，请按回车隔开"
                    // onChange={handleChange}
                    tokenSeparators={[","]}
                  ></Select>
                </Form.Item>
                <Form.Item
                  label="是否先发布在草稿箱里"
                  name="is_draft"
                  rules={[{ required: true, message: "" }]}
                >
                  <Switch
                    checked={upFormData.is_draft}
                    onChange={(e) =>
                      setUpFormData((preState) => ({
                        ...preState,
                        is_draft: e,
                      }))
                    }
                  />
                </Form.Item>
              </Form>
            </Modal>
          ) : null}
        </Card>
      </Card>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handlePicCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
}
