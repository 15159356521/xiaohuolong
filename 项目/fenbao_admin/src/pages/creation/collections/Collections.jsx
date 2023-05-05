import React, { useState, useEffect } from "react";
import img from "../../../assets/xhl.png";
import { DeleteFilled } from "@ant-design/icons";
import {
  LoadingOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import styles from "./collections.module.scss";
import {
  Form,
  Input,
  Button,
  Upload,
  Modal,
  Card,
  Checkbox,
  message,
  List,
  Table,
} from "antd";
import { getVideo, getVideoCollectionc } from "../../../api/user";
// import img2 from "../../../assets/xhl.png";
import axios from "axios";

const { TextArea } = Input;

const { Search } = Input;
// 对封面进行转义
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

  if (!isJpgOrPng) {
    message.error("请使用 JPG/PNG 格式!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isLt2M) {
    message.error("请上传小于2MB!");
  }

  return isJpgOrPng && isLt2M;
};

export default function Collections() {
  const [open, setOpen] = useState(false);
  // 弹窗渲染数据
  const [compilationvideodata, setCompilationvideodata] = useState([]);
  // 渲染list表数据
  const [data, setData] = useState([]);
  // 点击复选框的数据
  const [arr, setArr] = useState([]);

  const [videoid, setVideoid] = useState([]);
  // 上传封面图片
  const [imgurl, setImgurl] = useState();

  const [lengthdata, setLengthdata] = useState();
  // 判断视频个数长度
  const [length, setLength] = useState(0);
  // 表单提交
  const [form] = Form.useForm();
  // const [searchdata, setSearchdata] = useState();
  const onSearch = (value) => {
    console.log(value);
    // setSearchdata(value);

    axios
      .post("/sub_admin/video.VideoCollectionc/sel", {
        value,
        id: 1,
      })
      .then((res) => {
        console.log(res);
        setCompilationvideodata(res.data.data);
      });
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = (e) => {
    setData(arr);
    setVideoid(arrid);
    setOpen(false);
    setLength(lengthdata);
  };

  const hideModal = (e) => {
    setOpen(false);
  };

  // 提交表单
  const onFinish = (values) => {
    console.log("成功", values, videoid);
    values.id = videoid;
    values.img = imgurl;

    axios
      .post("/sub_admin/video.VideoCollectionc/add", values)
      .then((res) => console.log(res));
  };

  // 图片回显

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        setImgurl(info.file.response.msg.url);
      });
    }
  };

  // 上传文件是空的时候会警告 这个是消除警告的
  const normFile = (e) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // 请求视频数据
  useEffect(() => {
    getVideo()
      .then((res) => {
        console.log(res);
        setCompilationvideodata(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // 点击删除
  const handleClick = () => {
    console.log("删除");
    let a = arr.splice(0, 1);
    let newArr = [];
    let idarr = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== a) {
        newArr.push(arr[i]);
      }
      if (arr[i].id !== a.id) {
        idarr.push(arr[i].id);
      }
    }
    setVideoid(idarr);
    // console.log("aaaaaaaaaaaa", a);
    setData(newArr);
    setLength(newArr.length);
  };
  // 判断长度是否显示
  useEffect(() => {
    const listdisplay = document.getElementsByClassName("listdisplay")[0];
    if (length > 0) {
      listdisplay.style.display = "block";
    } else {
      listdisplay.style.display = "none";
    }
  }, [length]);

  // 点击添加数据
  const [arrid, setArrid] = useState([]);
  const handlechangecheck = (e) => {
    setArr(e);
    let dataarr = [];
    for (let i = 0; i < e.length; i++) {
      // arrids.push(e[i].id);
      dataarr.push(e[i].id);
    }
    setArrid(dataarr);
    setLengthdata(e.length);
    // console.log("eeeeee", e);
  };
  // console.log("hhhh", videoid);

  // 上传合辑视频数据
  function Compilationvideo() {
    return compilationvideodata.map((item, index) => {
      return (
        <Checkbox value={item} key={index}>
          <div>
            <Card
              bordered={false}
              size={"small"}
              style={{
                width: "140px",
                height: "80px",
                marginLeft: "40px",
                marginTop: "20px",
                paddingRight: "5px",
              }}
              cover={
                <img
                  alt="video"
                  src={item.img}
                  style={{ width: "135px", height: "60px" }}
                />
              }
            >
              {/* <p>{item.often}</p> */}
              <div>{item.title}</div>
              <span>{item.add_time}</span>
            </Card>
          </div>
        </Checkbox>
      );
    });
  }

  //合辑封面
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传合辑封面
      </div>
    </div>
  );

  return (
    <div className={styles.root}>
      <Form
        form={form}
        style={{ width: "800px" }}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 20,
        }}
        layout="horizontal"
        onFinish={onFinish}
      >
        {/* 输入合辑标题 */}
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              min: 4,
              max: 10,
              pattern: new RegExp(/^[\u4e00-\u9fa5_a-zA-Z0-9]{4,30}$/),
              message: "合辑标题请输入4-30个字",
            },
          ]}
        >
          <Input
            onChange={(e) => {
              console.log(e.target.value);
            }}
            maxLength={30}
            className="CollectionsTitle"
            placeholder="请输入合辑标题"
          />
        </Form.Item>
        {/* 列表 */}

        <Form.Item>
          <p>已添加{length}个视频</p>
          <List
            className="listdisplay"
            split={true}
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <div className="remmend-item">
                  <img
                    src={item.img}
                    style={{ width: "120px", height: "60px" }}
                  />
                  <span>{item.often}</span>
                </div>
                <div className="remmend">
                  {" "}
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#222222",
                      fontWeight: "bold",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      marginTop: "20px",
                      fontsize: "14px",
                      color: "#B2B2B2",
                    }}
                  >
                    {item.add_time}
                  </div>
                </div>

                <a style={{ float: "right", color: "#666" }}>
                  <DeleteFilled onClick={handleClick} />
                </a>
              </List.Item>
            )}
          />
        </Form.Item>
        {/*上传合辑视频  */}
        <Form.Item getValueFromEvent={normFile} valuePropName="fileList">
          <Button type="dashed" style={{ width: "600px" }} onClick={showModal}>
            <PlusOutlined style={{ color: "skyblue" }} />
            上传合辑视频
          </Button>
          <Modal
            title="添加视频至合辑"
            open={open}
            onOk={handleOk}
            onCancel={hideModal}
            okText="确认"
            cancelText="取消"
            width={800}
            style={{ marginTop: "150px", height: "600px" }}
          >
            <Search
              placeholder="输入标题关键字搜索"
              onSearch={onSearch}
              style={{
                width: 300,
              }}
            />
            <div className="compvideo">
              <div
                style={{
                  display: "flex",
                  flex: "wrap",
                  overflow: "auto",
                  height: "250px",
                }}
              >
                {" "}
                <Checkbox.Group onChange={handlechangecheck}>
                  {Compilationvideo()}
                </Checkbox.Group>
              </div>
            </div>
          </Modal>
        </Form.Item>
        <Form.Item
          name="img"
          getValueFromEvent={normFile}
          valuePropName="fileList"
          rules={[{ required: true, message: "请上传视频封面" }]}
        >
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            action="/sub_admin/common.Upload/uploadImage"
            maxCount={1}
          >
            {/* 将上传后的图片进行展示 */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: "100%",
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item name="brief">
          <TextArea rows={4} placeholder="请输入合辑简介(可不写)" />
        </Form.Item>
        <Form.Item
          className="fromButton"
          shape="round"
          icon={<DownloadOutlined />}
        >
          <Button type="primary" shape="round" size="large" htmlType="submit">
            提交合辑
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
