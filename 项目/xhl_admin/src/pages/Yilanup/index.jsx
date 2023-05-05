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
  Image,
} from "antd";
import aa from "../Yilanuser/logo.png";
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

import { getRoleBtn } from "../../api/role";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

import { useRef } from "react";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { baseIMgURL } from "../../utils/request";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import routerContant from "../../utils/constant";
// 存在上传的bug 后续解决
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const { Column } = Table;
let list = [];
let imgList = [];
export default function ParentAccount() {
  const location = useLocation();
  const id = routerContant[location.pathname.split("/").pop()].split("-").pop();
  const [selectValue, setSelectValue] = useState("");
  const formRef = useRef();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [tokey, setToKey] = useState();

  let upData = 0; //用于计算要上传的数量

  const navigate = useNavigate();

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
    user_class: [],
  });
  const [upFormData, setUpFormData] = useState([
    {
      name: "",
      cover: "",
      src: "",
      platform: 0,
      category_id: 1,
      tags: [],
      is_draft: true,
    },
  ]);
  // 上传图片
  const [upfileList, setUpFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [upVideoList, setUpVideoList] = useState([]);
  const [videoStatus, setVideoStatus] = useState("+ 上传视频");
  const [imgStatus, setImgStatus] = useState("+ 上传图片");
  const [log, setLog] = useState([]);
  const [imgLog, setImgLog] = useState([]);
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
    imgLog.push(file);
    setImgLog(imgLog);
    // console.log(imgLog.length, "log");

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

    const { code, resData, msg } = await getYilanuserData();
    console.log(resData, "resData");
    const obj = { ...formOption };
    obj.user_class = resData.map((item) => {
      return { value: item.name, key: item.id };
    });
    if (code === 200) {
     
       console.log(obj, "obj");
    setFormOption(obj);
      
    }else if (code === 401) {
      message.warning(msg);
      navigate("/login", { replace: false, state: { id: id } });
    }
 

   
  };

  useEffect(() => {
    (async function () {
      getParentAccountData();

    })();
  }, []);
  const handlePicCancel = () => {
    setPreviewOpen(false);
  };
  // 搜索功能

  const [keyForm] = Form.useForm();
  const cancel = () => {};

  return (
    <div className={styles.root}>
      <Card className="upViedo">
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item href="#/parentAccount">批量上传</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <Form layout="inline">
            <Form.Item label="上传的账号" name="title">
              {" "}
              <Select
                showArrow
                style={{
                  width: 200,
                }}
                value={selectValue}
                onChange={async (item) => {
                  console.log(formOption.user_class[item], "item");
                  setSelectValue(item);
                  try {
                    const { code, resData } = await getAllKey(
                      formOption.user_class[item].key
                    );
                    console.log(code, "sdf");
                    // console.log(resData.info, "resData");
                    setToKey(resData.info.token);
                    message.success("获取成功");
                  } catch (e) {
                    message.warning("获取token失败可能该账号没有上传权限");
                  }
                }}
                allowClear
              >
                {formOption.user_class.map((item, index) => (
                  // console.log(item),
                  <Select.Option value={index} key={index}>
                    {item.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Upload
                accept="video/*"
                beforeUpload={(file) => {
                  upData++;
                
                  log.push(file);
                  setLog(log);
                  console.log(log.length, "log");

                  console.log(log, "log");
                }}
                // action={`/openapi/upload/img${tokey}`}
                customRequest={(file) => {
                  const formData = new FormData();

                  // formData.append("filename", "abc");
                  // formData.append("platform", 0);
                  console.log(tokey);

                  axios
                    .get(
                      // `api/upload/video?filename=${file.file.name}&platform=0`,
                      `https://mp.yilan.tv/openapi/upload/video?filename=${file.file.name}&platform=0`,
                      {
                        headers: { Token: tokey },
                      }
                    )
                    .then((res) => {
                      setVideoStatus("上传视 频中");

                      const { code, msg } = res.data;
                      console.log(code, msg, "resData");
                      //   console.log(res.data.data, "res.data");
                      if (code === 0) {
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
                              name: file.file.name.slice(file.name, -4),
                              title: file.file.name.slice(file.name, -4),
                              status: "done",
                              url: `${aa}`,
                              src: res.data.data.object_key,
                              cover: null,
                              cover1: null,
                              platform: 0,
                              category_id: 23,
                              tags: [],
                              is_draft: false,
                              src1: "aaa",
                            };
                            list.push(imgs);
                            console.log(list, 2);
                            //   upVideoList.push(imgs);
                            // setUpVideoList(list);
                            if (log.length === list.length) {
                              message.success("全部上传成功");
                            } else {
                              message.success({content:`上传成功第${list.length}个`,key: 'upLoad'});
                            }

                            keyForm.setFieldsValue({
                              title: list[0].name,
                            });
                            setUpVideoList((list) => [...list, imgs]);

                            if (log.length === list.length) {
                              console.log(
                                log.length,
                                upVideoList.length,
                                "1log.length,upVideoList.length"
                              );
                              setVideoStatus("上传视频");
                            } else if (log.length > upVideoList.length) {
                              console.log(
                                log.length,
                                upVideoList.length,
                                "2log.length,upVideoList.length"
                              );
                              setVideoStatus("+ 上传视频中");
                            } else {
                              console.log(
                                log.length,
                                upVideoList.length,
                                "3log.length,upVideoList.length"
                              );
                              setVideoStatus("上传视频");
                            }

                            //   return Promise.resolve(imgs);
                          });
                      } else if (code === 10009) {
                        message.warning("token失效或则未选择账号");
                        setLog([]);
                        throw new Error(msg);
                      } else {
                        message.warning(msg);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      setVideoStatus("+ 上传视 频");
                    });

                  console.log(file, "file");

                  // file.action = "https://data.xiaozhuyouban.com/upload";
                }}
                listType="picture-card"
                fileList={upVideoList}
                multiple={true}
                onPreview={(file) => {
                  console.log(file, "file");
                }}
                onRemove={(file) => {
                  setVideoStatus("+ 上传视频");
                  setUpVideoList([]);
                }}
              >
                {`${videoStatus}`}
              </Upload>
            </Form.Item>
            <Form.Item name="cover">
              {/* <ImgCrop rotate> */}
              <Upload
                beforeUpload={beforeUpload}
                accept="image/*"
                multiple={true}
                // action={`/openapi/upload/img${tokey}`}
                customRequest={(file) => {
                  console.log(file);
                  // file.action = "https://data.xiaozhuyouban.com/upload";
                  const formData = new FormData();

                  // formData.append("filename", "abc");
                  // formData.append("platform", 0);
                  // console.log(tokey);
                  try {
                    axios
                      .get(
                        // `api/upload/img?filename=${file.file.name}&platform=0`,
                        `https://mp.yilan.tv/openapi/upload/img?filename=${file.file.name}&platform=0`,
                        {
                          headers: { Token: tokey },
                        }
                      )
                      .then((res) => {
                        setImgStatus("上传封面中");
                        keyForm.resetFields(["cover"]);
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
                              name: file.file.name.slice(file.name, -4),
                              status: "done",
                              url: res.data.data.src,
                              src: res.data.data.object_key,
                            };
                            console.log(imgs, "imgs");
                            let flag = false;

                        
                              if (upVideoList !== []) {
                                for (let i = 0; i < upVideoList.length; i++) {
                                  if (upVideoList[i].name === imgs.name) {
                                    imgList.push(imgs);
                                    flag = true;
                                    console.log(
                                      upVideoList[i].cover,
                                      "upVideoList"
                                    );
                                    if (upVideoList[i].cover === null) {
                                      console.log(i);
                                      upVideoList[i].cover = imgs.url;
                                      // upVideoList[i].cover1 = imgs.src;

                                      // setUpVideoList(obj);
                                      setUpFileList((imgList) => [
                                        ...imgList,
                                        imgs,
                                      ]);
                                     
                                      if (imgLog.length === imgList.length) {
                                        console.log(
                                          imgLog.length,
                                          imgList.length,
                                          "1imgLog.length,upVideoList.length"
                                        );
                                        setImgStatus("上传封面");
                                      } else if (
                                        imgLog.length > imgList.length
                                      ) {
                                        console.log(
                                          imgLog.length,
                                          imgList.length,
                                          "2imgLog.length,upVideoList.length"
                                        );
                                        setImgStatus("上传封面中");
                                      } else {
                                        console.log(
                                          imgLog.length,
                                          upfileList.length,
                                          "3imgLog.length,upVideoList.length"
                                        );
                                        setImgStatus("上传封面");
                                      }
  
                                      message.success({
                                        content: "上传成功",
                                        key: "upImg",
                                      });
                                      break;
                                    } else {
                                      continue;
                                    }
                                    // debugger

                               
                                    // throw new Error("添加成功");
                                    
                                  }
                                }
                              } else {
                                message.warning("请先上传视频或视频未完全上传");
                           
                              }
                              if (flag !== true) {
                                message.warning("请选择名字与视频相同的封面");
                                const upImg = [...imgLog];
                                upImg.splice(0, 1);
                                setImgLog(upImg);
                              }
                              return file.file;
                         
                          })
                          .then((res) => {
                            const formData = new FormData();
                            formData.append("file", res);
                            console.log(res, "sdfsdfsdfsdgsdgdfgdfg");
                            axios({
                              url: "/admin/common.upload/uploadimage",
                              method: "post",
                              data: formData,
                            }).then((res) => {
                              console.log(res.data.data.url);
                              upVideoList[upVideoList.length - 1].cover1 =
                                res.data.data.url;
                            });
                          });
                      });
                  } catch (e) {
                    message.warning("获取token失败请选择正确的账号");
                    setImgLog([]);
                  }
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
                {`${imgStatus}`}
              </Upload>
              {/* </ImgCrop> */}
            </Form.Item>
          </Form>
        
          {upVideoList.length > 0 ? (
          <div className="footButton">
              <div>需要上传{log.length}条视频已上传     <span style={{color:"red"}}> {list.length}</span> 条</div>
            
            {upVideoList.length===log.length?(
                   <Button
                   onClick={() => {
                     upVideoList.map((item, index) => {
                       {
                        // 校验表单
                  
                         upYilanuserById(1, item).then((res) => {
                           console.log(res, "res");
                           if (res.code === 200) {
                             message.success("上传成功");
                             setUpVideoList([]);
                             setUpFileList([]);
                             setImgLog([]);
                             setLog([]);
                           } else if(res.msg==="cover不能为空"){
                             message.error({content:"图片未上传",key:"upImg"});
                           }else if(res.msg==="tags不能为空"){
                             message.error({content:"标签未填写",key:"upImg"});
                           }
                         });
                       }
                     });
                   }}
                 >
                   发布视频
                 </Button>):(
                    <Button
                    disabled
                    >
                      发布视频
                    </Button>)

            }
       
          </div>
        ) : null}
        </Card>
        {upVideoList !== []
          ? upVideoList.map((item, index) => {
              return (
                <Card key={index}>
                  {console.log(item, index, "表单")}
                  <Form
                  ref={formRef}
                    layout="inline"
                    initialValues={{
                      ...item,
                    }}
                  >
                    <Form.Item label="视频" name="src">
                      <Image width={100} src={item.url} />
                    </Form.Item>
                    <Form.Item label="封面" name="cover">
                      <Image width={100} src={item.cover} />
                    </Form.Item>
                    <Form.Item
                      label="标题"
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: "请输入标题",
                        },
                      ]}
                    >
                      <Input
                        placeholder="请输入标题"
                        onChange={(value) => {
                          const obj = [...upVideoList];
                          obj[index].title = value.target.value;
                          console.log(obj, "标题");
                          setUpVideoList(obj);
                        }}
                      />
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
                          console.log(item);

                          const obj = [...upVideoList];
                          console.log(obj, "fromdata");
                          obj.platform = item;
                          obj[index].category_id = item;
                          console.log(obj[index], "obj");
                          setUpVideoList(obj);
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
                      label="平台"
                      name="platform"
                      rules={[{ required: true, message: "请选择您的平台" }]}
                    >
                      <Select
                        placeholder="请选择分类"
                        showArrow
                        value=""
                        onChange={(item) => {
                          console.log(item);
                          const obj = [...upVideoList];
                          console.log(obj, "fromdata");
                          // obj.platform = item;
                          obj[index].platform = item;
                          console.log(obj[index], "obj");
                          // setUpVideoList(obj);
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
                      className="tag"
                      rules={[
                        {
                          required: true,
                          message: "没有标签",
                          validator: (rule, value) => {
                  
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
                        placeholder="请输入标签，请按回车隔开,单个标签请大于两个字符"
                        onChange={(item) => {
                          console.log(item);
                          const obj = [...upVideoList];
                          obj[index].tags = item;
                          setUpVideoList(obj);
                        }}
                        allowClear
                        tokenSeparators={[","]}
                      ></Select>
                    </Form.Item>
                    <Form.Item label="是否删除">
                      <Button
                        type="primary"
                        danger
                        onClick={() => {
                          const obj = [...upVideoList];
                          console.log(obj, "index");
                          obj.splice(index, 1);

                          setUpVideoList(obj);

                          const upObj = [...log];
                          upObj.splice(index, 1);
                          setLog(upObj);
                          const upImg = [...imgLog];
                          upImg.splice(index, 1);
                          setImgLog(upImg);
                          const listImg = [...upfileList];
                          listImg.splice(index, 1);
                          setUpFileList(listImg);
                        }}
                      >
                        删除
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              );
            })
          : null}


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
