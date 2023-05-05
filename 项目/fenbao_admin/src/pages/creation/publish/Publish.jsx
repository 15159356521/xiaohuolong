import styles from "./publish.module.scss";
import { pubUp, getTaskList, pubUpVideo } from "../../../api/user";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Upload,
  message,
  Modal,
  Form,
  Progress,
  Input,
  Button,
  Divider,
  Select,
  Space,
} from "antd";
import {
  ProFormUploadButton,
  ProFormTextArea,
  ProFormText,
} from "@ant-design/pro-components";
import Progre from "./Progre";
import React, { useState, useRef, useEffect } from "react";
import jsonp from "fetch-jsonp";
import qs from "qs";
import imgs from "../../../imgs/dist.png";
import TcVod from "vod-js-sdk-v6";
import MP4Box from "mp4box";
const { Dragger } = Upload;
const { Option } = Select;
let timeout;
let currentValue;
const dataList = [
  {
    name: "电视剧",
    children: [
      { name: "武侠神话" },
      { name: "古装宫廷" },
      { name: "军旅抗战" },
      { name: "罪案谍战" },
      { name: "农村" },
      { name: "都市爱情" },
      { name: "青春校园" },
      { name: "搞笑喜剧" },
      { name: "惊悚恐怖" },
    ],
  },
  {
    name: "电影",
    children: [
      { name: "神话玄幻" },
      { name: "武侠" },
      { name: "军旅抗战" },
      { name: "罪案谍战" },
      { name: "爱情" },
      { name: "喜剧" },
      { name: "恐怖惊悚" },
      { name: "科幻" },
      { name: "剧情" },
      { name: "战争" },
      { name: "动作" },
      { name: "动画" },
      { name: "其他" },
    ],
  },
  {
    name: "动漫",
    children: [
      { name: "国产动漫" },
      { name: "日韩动漫" },
      { name: "欧美动漫" },
      { name: "其他" },
    ],
  },
  {
    name: "少儿",
    children: [
      { name: "少儿节目" },
      { name: "早教益智" },
      { name: "青少其他" },
    ],
  },
  {
    name: "纪录片",
    children: [
      { name: "美食" },
      { name: "自然" },
      { name: "历史" },
      { name: "军事" },
      { name: "科技" },
      { name: "人文" },
      { name: "旅游" },
      { name: "其他" },
    ],
  },
];
const listData = [
  {
    name: "解说",
    children: [
      { name: "惊悚" },
      { name: "幽默" },
      { name: "历史" },
      { name: "个性化" },
    ],
  },
  {
    name: "混剪",
    children: [
      { name: "节奏" },
      { name: "伤感" },
      { name: "颜值" },
      { name: "CP" },
      { name: "个性化" },
    ],
  },
  {
    name: "拆条",
    children: [{ name: "名场面" }],
  },
];
const getSignature = () => {
  return pubUpVideo().then(function (response) {
    console.log(response.data.sign);
    return response.data.sign;
  });
};
const tcVod = new TcVod({
  getSignature: getSignature, // 前文中所述的获取上传签名的函数
});
let uploader = {};

const Publish = () => {
  const [imgRoute, setImgRoute] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flag, setFlag] = useState(1);
  const [titles, setTitle] = useState("");
  const [items, setItems] = useState(dataList);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const inputRef = useRef(null);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [video, setVideo] = useState("");
  const [videoTime, setVideoTime] = useState("");
  const [videoSize, setVideoSize] = useState("");
  const progress = useRef(0);
  const [upData, setUpData] = useState({
    classification: "",
    status: "",
  });

  const [list, setList] = useState([]);
  useEffect(() => {
    let data = [];
    console.log("执行了", titles);
    inputRef.current.value = titles;
    getTaskList(upData).then((res) => {
      // 赋值res.data.title
      console.log(res.data);
      data = res.data.data.map((item) => {
        return <Option key={item.title}>{item.title}</Option>;
      });
      // console.log(data);

      setList(data);
    });
  }, [titles]);
  // useEffect(() => {
  //   // console.log('执行了');
  //   // 设置倒计时100秒
  //   let timer = setInterval(() => {
  //   ti.current++;

  //   }
  //   , 1000);
  //   // 清除倒计时
  // console.log(ti.current);
  // });

  const inputCha = (e) => {
    // console.log(e.target.value);
    setTitle(e.target.value);
  };

  const SearchInput = (props) => {
    const [data, setData] = useState([]);

    const handleSearch = (newValue) => {
      if (newValue) {
        fetch(newValue, setData);
      } else {
        setData([]);
      }
    };

    const handleChange = (newValue) => {
      console.log(newValue);
      setValue(newValue);
    };

    const options = data.map((d) => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        showSearch
        value={value}
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
    );
  };

  const fetch = (value, callback) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    currentValue = value;

    const fake = () => {
      const str = qs.stringify({
        code: "utf-8",
        q: value,
      });
      jsonp(`https://suggest.taobao.com/sug?${str}`)
        .then((response) => response.json())
        .then((d) => {
          // console.log(d, "=====");
          if (currentValue === value) {
            const { result } = d;
            const data = result.map((item) => ({
              value: item[0],
              text: item[0],
            }));
            // debugger;
            callback(data);
          }
        });
    };

    timeout = setTimeout(fake, 300);
  };

  const isSize = (file) => {
    // console.log(file.name);

    setTitle(file.name.slice(file.name, -4));
    return new Promise((resolve, reject) => {
      resolve = (file) => {
        uploader = tcVod.upload({
          mediaFile: file, // 媒体文件（视频或音频或图片），类型为 File
        });
        uploader.on("media_progress", function (file) {
          // console.log(file.percent * 100 );
          progress.current = (file.percent * 100).toFixed(0);
          // setPercent((((file.percent * 100) / 100) * 100).toFixed(0));

          if (file.percent !== 1) {
            setLoading(true);
            setFlag(2);
          } else {
            setLoading(false);
          }
        });
        uploader
          .done()
          .then(function (doneResult) {
            console.log(doneResult);
            setVideo(doneResult.fileId);
            // ti.current=(doneResult.video.url);
            // console.log(video + "上传的");

            message.success({
              content: "上传成功",
            });
          })
          .catch(function (err) {
            // deal with error
            console.log(err);
            message.error({
              content: "上传失败",
            });
          });
      };
      reject = (file) => {};
      const videoUrl = URL.createObjectURL(file);
      const videoObj = document.createElement("video");
      videoObj.muted = true;
      const mp4boxFile = MP4Box.createFile();
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      // debugger
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        arrayBuffer.fileStart = 0;
        mp4boxFile.appendBuffer(arrayBuffer);
        // console.log(e);
      };
      mp4boxFile.onReady = function (info) {
        if (
          info.mime.indexOf("mp4v") === -1 &&
          info.mime.indexOf("flv1") === -1 &&
          info.mime.indexOf("fmp4") === -1 &&
          info.mime.indexOf("mp43") === -1
        ) {
          videoObj.autoplay = true;
          // console.log(videoObj, 12);
          // 检测视频尺寸
          videoObj.preload = "metadata";
          videoObj.src = videoUrl;

          //  debugger;
          videoObj.addEventListener("canplaythrough", () => {
            // console.log("==============");
            //  debugger;

            const { videoWidth, videoHeight } = videoObj;
            URL.revokeObjectURL(videoUrl);
            let times = Math.round(videoObj.duration);
            // console.log("time", times);
            // console.log(videoWidth, videoHeight);
            if (videoWidth < 1280 || videoHeight < 720) {
              message.error("视频尺寸不符合要求");
              if (parseFloat(times) < 40) {
                console.log("大于30秒");
                message.warning("上传的视频应在在40秒以上");
                reject();
              }
              setVideoTime(times + "秒");
            } else {
              setVideoSize(videoWidth + "X" + videoHeight);
              resolve(file);
            }
          });
        } else {
          reject(file);
          message.error({
            content:
              "上传的文件格式不正确,无法在网页正常播放,比如qq录屏的视频和ev录屏的视频",
          });
        }
      };

      // debugger;
    });
  };

  // 验证视频上传情况
  const props = {
    accept: ".mp4,.wmv,.ogm,.mpg,.avi,.m4v,.webm,.mpeg,.flv",
    name: "file",
    multiple: true,

    listType: "",
    percent: 0,
    maxCount: 1,

    beforeUpload(file, fileList) {
      setFlag(1);
      isSize(file);
      // console.log(file, "file", fileList);
      // 对视频进行判断，可以预先对视频的大小还有宽高进行一次判断
    },

    onDrop(e) {
      //
      // console.log(e);

      if (e.dataTransfer.files[0].type.slice(0, 5) !== "video") {
        // console.log( e.dataTransfer.files[0].type.slice(0,5));
        message.error({
          content: "请上传mp4格式的视频",
        });
      } else {
        isSize(e);
        setFlag(2);
      }
    },
  };
  // 视频上传按钮
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传视频
      </div>
    </div>
  );
  // 示例弹窗
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values) => {
    // console.log(values);
    values.title = titles;
    // console.log(video);
    values.video = video;
    // setValue("");
    // values.label
    // 遍历字符串将字符串中的空格替换成数组
    // values.label = values.label.replace(/\s+/g, ",");
    console.log(values.label);
    values.upload = imgRoute;

    values.times = videoTime;
    values.size = videoSize;
    console.log(values);
    // 提交到后台
    pubUp(values).then((res) => {
      console.log(res.code);
      if (res.code === 1) {
        message.success({
          content: "发布成功",
        });
        setFlag(1);
        form.resetFields();
        setName("");
        setDesc("");

        setValue("");
      } else {
        message.error({
          content: "发布失败",
        });
      }
    });
    // 保留两位小数点
    // values.price=values.price.toFixed(2)
  };
  const cancel = () => {
    setFlag(1);
    setLoading(false);
    form.resetFields();
    setName("");
    setDesc("");
    setValue("");
    uploader.cancel();
    // setValue("")
    // console.log(titles);
  };
  // 影片分类
  const btu = (e, names) => {
    e.stopPropagation();
    // console.log(name);
    setName(names);
    //  多选框失去焦点

    setVisible(false);
    // console.log(true);

    //  console.log(name);
  };
  const btu1 = (e, names) => {
    e.stopPropagation();
    // console.log(name);
    setDesc(names);
    //  多选框失去焦点

    setOpen(false);
    // console.log(true);

    //  console.log(name);
  };
  // 分类遍历
  function a(data) {
    // console.log(2);
    // console.log(data);
    return data.map((item, index) => {
      return (
        <div className="list" key={index}>
          <div className="list-title">{item.name}</div>
          <div className="list-content">
            {item.children.map((item, index) => {
              return (
                <Button
                  style={{ color: "black" }}
                  type="link"
                  onClick={(e) => btu(e, item.name)}
                  className="list-content-item"
                  key={index}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>
      );
    });
  }
  // 灵感遍历
  function b(data) {
    // console.log(2);
    // console.log(data);
    return data.map((item, index) => {
      return (
        <div className="list" key={index}>
          <div className="list-title">{item.name}</div>
          <div className="list-content">
            {item.children.map((item, index) => {
              return (
                <Button
                  style={{ color: "black" }}
                  type="link"
                  onClick={(e) => btu1(e, item.name)}
                  className="list-content-item"
                  key={index}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>
      );
    });
  }
  form.setFieldsValue({
    type: name,
    inspiration: desc,
    copyright: value,
    title: titles,
  });
  // const Progre=(props)=>{
  //   const {percent}=props
  //   return(
  //     <Progress
  //     strokeColor={{
  //       "0%": "#108ee9",
  //       "100%": "#87d068",
  //     }}
  //     percent={percent}
  //   />

  //   )
  // }
  return (
    <div className={styles.root}>
      <div className="box" style={{ display: flag === 1? "flex" : "none" }}>
        <Dragger {...props}>{loading ? uploadButton : uploadButton}</Dragger>

        <div className="font">
          支持上传竖版视频。请勿将竖版视频转为横版上传，否则会影响推荐。
          <span
            style={{ color: "rgb(67,149,255)", cursor: "pointer" }}
            onClick={showModal}
          >
            {" "}
            查看示例
          </span>
          <div>
            <span>
              横版视频建议时长40秒以上，分辨率≥1920*1080，合理时长的高清视频推荐效果更佳
            </span>
          </div>
        </div>

        <Modal
          title="上传示例"
          footer={null}
          open={isModalOpen}
          onCancel={handleCancel}
          className="modal"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <img src={imgs} alt="正确案例" />
        </Modal>
      </div>
      <div className="foot" style={{ display: flag === 2 ? "block" : "none" }}>
        <Progre percent={progress.current} />
        <Form onFinish={onFinish} className="foot" form={form}>
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                min: 4,
                max: 10,
                maxlength: "4",
                //  正则表达式 中文英文数字特殊字符加上空格
                pattern:
                  /^[\u4e00-\u9fa5_a-zA-Z0-9\s\.\,\!\?\:\;\'\"\[\]\{\}\(\)\-\_\@\#\$\%\^\&\*\+\=\/\\\|\<\>\~\`\·\￥\…\—\“\”\‘\’\【\】\（\）\《\》\？\，\。\、\；\：\！\……\～\·\|\{\}\[\]\`\~\-\=\+\*\&\^\%\$\#\@\!\?]{4,30}$/,
                //  pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9\s\.\,\!\?\:\;\'\"\[\]\{\}\(\)\-\_\@\#\$\%\^\&\*\+\=\/\\\|\<\>\~\`\·\￥\…\—\“\”\‘\’\【\】\（\）\《\》\？\，\。\、\；\：\！\……\～\·\|\{\}\[\]\`\~\-\=\+\*\&\^\%\$\#\@\!\?]{4,30}$/,
                message: "合辑标题请输入4-30个字",
              },
            ]}
          >
            <input
              ref={inputRef}
              onChange={(value) => inputCha(value)}
              className="CollectionsTitle"
            />
          </Form.Item>
          <ProFormUploadButton
            name="upload"
            label="封面"
            max={1}
            fieldProps={{
              name: "file",
              listType: "picture-card",
            }}
            rules={[{ required: true, message: "没有图片" }]}
            required={false}
            accept=".jpg,.bmp,.png,.mpg,.webp,.raw,.jpeg"
            listType="picture-card"
            action="/sub_admin/common.Upload/uploadImage"
            onChange={(info) => {
              // console.log(info);
              if (info.file.status === "done") {
                // Get this url from response in real world.
                console.log("info" + info);
                setImgRoute(info.file.response.msg.url);
              }
            }}
          />
          <Form.Item
            width="lg"
            label="分类"
            name="type"
            rules={[{ required: true, message: "请输入分类" }]}
            required={false}
          >
            <Select
              // ref={SelectRef}
              open={visible}
              //  onBlur={()=>setVisible(false)}
              onDropdownVisibleChange={(visible) => setVisible(visible)}
              // onClick={() => {
              //   setVisible(true);
              //   console.log(visible);
              // }}
              placeholder="请选择分类"
              dropdownRender={() => (
                <>
                  <Input
                    placeholder="可进行搜索"

                    // value={name}
                    // onChange={onNameChange}
                  />
                  <Divider
                    style={{
                      margin: "8px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <div>{a(items)}</div>
                    {/* <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Add item
            </Button> */}
                  </Space>
                </>
              )}
            >
              {/* {items.map((item) => (
        <Option key={item}>{item}</Option>
      ))} */}
            </Select>
          </Form.Item>
          <Form.Item label="灵感" name="inspiration">
            <Select
              // ref={inputRef}
              open={open}
              onDropdownVisibleChange={(visible) => setOpen(visible)}
              placeholder="请选择分类"
              dropdownRender={() => (
                <>
                  <Input
                    placeholder="可进行搜索"

                    // value={name}
                    // onChange={onNameChange}
                  />
                  <Divider
                    style={{
                      margin: "8px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <div>{b(listData)}</div>
                    {/* <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Add item
            </Button> */}
                  </Space>
                </>
              )}
            >
              {/* {items.map((item) => (
        <Option key={item}>{item}</Option>
      ))} */}
            </Select>
          </Form.Item>
          <ProFormTextArea
            name="brief"
            label="简介"
            width="lg"
            placeholder="请在这里输入简介"
          />
          {/* <ProFormText
            name="copyright"
            label="版权"
            width="lg"
            required={false}
            placeholder="请输入版权"
            rules={[{ required: true, message: "未输入版权" }]}
          /> */}
          <Form.Item
            label="版权："
            required={false}
            name="copyright"
            rules={[{ required: true, message: "未输入版权" }]}
          >
            <SearchInput placeholder="请输入版权" />
          </Form.Item>
          <Form.Item
            name="label"
            label="标签"
            width="lg"
            rules={[{ required: true, message: "没有标签" }]}
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
            name="activity"
            label="活动"
            width="lg"
            required={false}
          
            rules={[{ required: true, message: "没有活动" }]}
          >
            <Select
       placeholder="请输入活动"
          
            >
              {list}
              {/* {children}

{console.log("list",list)} */}
            </Select>
          </Form.Item>
          {/* 发布按钮和取消按钮 */}
          <Form.Item className="fromFoot">
            <div>
              <Button type="primary" htmlType="submit" className="submit">
                发布
              </Button>
              <Button type="primary" onClick={cancel}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Publish;
