import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, YoutubeOutlined } from "@ant-design/icons";
import { Radio, Button, DatePicker, Modal, Pagination, Empty,Spin } from "antd";
import styles from "./Manage.module.scss";
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";
import { getMyVideo, delMyVideo } from "../../api/user";
const { RangePicker } = DatePicker;
const titles = [
  {
    title: {
      key: "video",
      label: "视频：",
    },
    type: ["全部", "合辑"],
  },
  {
    title: {
      key: "state",
      label: "状态：",
    },
    type: ["全部", "已发布", "未通过", "待审核"],
  },
  {
    title: {
      key: "quality",
      label: "质量：",
    },
    type: ["全部", "差", "好", "极好"],
  },
];
// 模拟视频数据
// let listData = [
//   {
//     img: "https://data.xiaozhuyouban.com/cover/JyLaV5kJaqb5.jpg/videocover?t=1664440772",
//     title: "你是我的眼：男子带失明好友回家吃饭，两人互谈过往感情逐渐升温",
//     upTime: "2022-09-29 00:47:24",
//     classify: "电视剧-都市爱情",
//     label: "你是我的眼,影视,剧情",
//     state: "已发布",
//     hot: "6",
//     video_id: "你是我的眼",
//     id: 1,
//   },
// ];
// for (let index = 0; index < 10; index++) {
//   listData[index] = listData[0];
// }
const dateFormat = "YYYY/MM/DD";
function Manage() {
  const [theDay, setTheDay] = useState([
    moment().subtract(1, "M").format("YYYY-MM-DD"),
    moment().format("YYYY-MM-DD"),
  ]);
  const [classification, setClassification] = useState({
    video: "全部",
    state: "全部",
    quality: "全部",
    page: 1,
    pageSize: 10,
    id: localStorage.getItem("Id"),
    past: moment().subtract(1, "M").format("YYYY-MM-DD"),
    theDay: moment().format("YYYY-MM-DD"),
  });
  const [listData, setListData] = useState([]);
  const [id, setId] = useState("");
  const [count, setCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 监听past的变化
  useEffect(() => {
    getMyVideo(classification)
      .then((res) => {
        console.log(res.data);
        setCount(res.data.count);
        setListData(res.data.data);
      })
      .catch((err) => {
        console.log(err + "err");
      });
  }, [classification, id]);
  useEffect(() => {
    console.log(localStorage.getItem("Id"));
  }, []);
  // 分类获取传值
  function but(value, data) {
    console.log(value, data);
    const newObj = { ...classification };
    for (const key in newObj) {
      if (key === data) {
        newObj[key] = value;
      }
    }

    setClassification(newObj);
  }
  // 顶部按钮
  function btu() {
    return titles.map((item) => {
      return (
        <div className="filter" key={item.title.key}>
          <h3 className="pullLeft">{item.title.label}</h3>
          <Radio.Group
            onChange={(e) => {
              but(e.target.value, item.title.key);
            }}
            className="filRight"
            defaultValue="全部"
            buttonStyle="solid"
          >
            {item.type.map((item) => {
              return (
                <Radio.Button key={item} value={item}>
                  {item}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
      );
    });
  }
  // 日期
  const onPanelChange = (value, mode) => {
    // setTheDay(mode[0],mode[1])
    if (mode[0] === "") {
      console.log(3);
      setTheDay([
        moment().subtract(1, "M").format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD"),
      ]);
    } else {
      setTheDay(mode);
    }

    console.log(mode);
    // 将数据提交给后端
  };
  const disabledDate = (current) => {
    // console.log(current);
    return current && current > moment().endOf("day");
  };
  const upData = () => {
    // 将分类数据提交给后端后接收
    const newObj = { ...classification };
    newObj.past = theDay[0];
    newObj.theDay = theDay[1];
    setClassification(newObj);
  };
  function cut(data) {
    console.log(data);
    setId(data);
    setIsModalOpen(true);
    console.log(data);
  }
  const handleOk = () => {
    // 将id传给后端删除 并刷新页面
    console.log(id);
    delMyVideo(id)
      .then((res) => {
        console.log(res);
        setId("");
      })
      .catch((err) => {
        console.log(err + "删除");
      });
    setIsModalOpen(false);
  };
  // 关闭弹窗
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const tableChange = (page, pageSize) => {
    console.log(page, pageSize);
    const newObj = { ...classification };
    newObj.page = page;
    newObj.pageSize = pageSize;
    setClassification(newObj);
  };
  function list(data) {
    return data.map((item, index) => {
      return (
        <div className="viedo" key={index}>
          <div
            className="pic"
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.open(`#/watch/${item.id}`);
            }}
          >
            <img
             src={`https://sub.admin.xiaohuolongfujiankeji.com/${item.img}`}
              alt="投稿封面"
            />
            <div className="mediaMask">
              <YoutubeOutlined className="icon" />
            </div>
          </div>
          <div className="content">
            <h4>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(`#/watch/${item.id}`);
                }}
                title={item.title}
              >
                {item.title}
              </div>
            </h4>
            <div className="infos">
              <div className="pull">
                <span className="text ">{item.add_time}</span>
                <span className="text">{item.classify}</span>
                <span className="text ">{item.label}</span>
                <span className="text "> {item.review}</span>
              </div>
            </div>
            <div className="mediaAction">
              <div className="pullLeft">
                <span className="link"> 热度</span>
                <span className="link ">
                  <em style={{ color: "black" }}>{item.hot}</em>
                </span>
                <span className="text "> 《{item.video_id}》</span>
              </div>
              <div className="pullRight">
                <Button
                  type="text"
                  className="delete link"
                  onClick={() => {
                    cut(item.id);
                  }}
                >
                  删除
                </Button>
                <Modal
            
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <p>确定删除吗</p>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }
  return (
    <div className={styles.root}>
      <div className="top">
        {btu()}
        <div className="filter">
          <h3 className="pullLeft">时间：</h3>
          <RangePicker
            locale={locale}
            value={[
              moment(theDay[0], dateFormat),
              moment(theDay[1], dateFormat),
            ]}
            disabledDate={disabledDate}
            onChange={onPanelChange}
          />
          <Button className="herBut" onClick={upData} icon={<SearchOutlined />}>
            搜索
          </Button>
        </div>
      </div>
      <div className="article">
      {listData!=undefined ? listData.length > 0 ? list(listData) : <Empty />:   <div className="spin"><Spin size="large" /></div>
  }    
        

        {/* <Empty /> */}
        {/* {list(listData)} */}
        <div className="pag">
          <Pagination
            defaultCurrent={1}
            onChange={tableChange}
            // pageSize={10}
            total={count}
      hideOnSinglePage={true}
          />
        </div>
      </div>
    </div>
  );
}
export default Manage;
