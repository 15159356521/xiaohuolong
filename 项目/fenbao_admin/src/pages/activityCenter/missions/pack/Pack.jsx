import React, { useState, useEffect } from "react";
import styles from "./pack.module.scss";
import { useNavigate } from "react-router-dom";
import { Radio, Button, Progress, Pagination, Spin, Empty } from "antd";
import { useParams } from "react-router-dom";
import { ProCard, ProList } from "@ant-design/pro-components";
import { getJob, getTask } from "../../../../api/user";
import moment from "moment";
import Countdown from "react-countdown";

const ListData = [
  {
    title: "综艺爆款火爆季",
    content:
      "本次活动是专为拆条创作者开展的长期活动。活动期间，不定期更换新片单。抢到任务的机构，其旗下所有子账号均可上传，并保证周期内上传总量必须满足对应创作条数。 点击子任务标题，可以阅读任务详情；请各位创作者谨慎评估后，决定是否抢任务！",
    count: 8,
    day: ["2022-09-21", "2022-09-30"],
  },
];
const butList = [
  {
    title: {
      key: "speed",
      label: "进度",
    },
    type: ["全部", "已抢完", "未抢完"],
  },
];
const list = [
  {
    img: "https://data.xiaozhuyouban.com/missionscover/48768.jpg/600x900?str=1653840062",
    title: "小猪优版特别任务《影视嘉年华》",
    content:
      " 影视剧创作持续火爆，本月将开启影视嘉年华不限创意，欢迎多多投递相关内容短视频作品。",
    time: "2022-09-30",
    type: "混剪",
    money: 8000,
    current: 11,
    end: 17,
    day: 7,
    limit: 90,
    impose: "限 lv.4,5,6 参与",
  },
  {
    img: "https://data.xiaozhuyouban.com/missionscover/48768.jpg/600x900?str=1653840062",
    title: "小猪优版特别任务《影视嘉年华》",
    content:
      " 影视剧创作持续火爆，本月将开启影视嘉年华不限创意，欢迎多多投递相关内容短视频作品。",
    time: "2022-09-27",
    type: "混剪",
    money: 8000,
    current: 17,
    end: 17,
    day: 7,
    limit: 90,
    impose: "限 lv.4,5,6 参与",
  },
];
for (let index = 0; index < 20; index++) {
  list[index] = list[0];
}

export default function Pack() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dataList, setDataList] = useState([]);
  //   const [lists, setLists] = useState([]);
  const [count, setCount] = useState(0);
  const [classification, setClassification] = useState({
    speed: "全部",
    type: "全部",
    times: "全部",
    Verticillata: "全部",
    id: id,
    page: 1,
    pageSize: 10,
  });
  useEffect(() => {
    (async () => {
      const { data } = await getJob(classification);
      // console.log(data);
      setDataList(data.data);
      setCount(data.count);
    })();
  }, []);
  useEffect(() => {
    // console.log(classification);
    console.log(id);
    (async () => {
      const { data } = await getJob(classification);
      // console.log(data);
      setDataList(data.data);
      setCount(data.count);
    })();
  }, [classification]);
  function but(value, data) {
    const newObj = { ...classification };
    for (const key in newObj) {
      if (key === data) {
        newObj[key] = value;
      }
    }

    setClassification(newObj);
  }
  //   任务列表
  function task(data) {
    return data.map((item, index) => {
      // console.log(data);
      return (
        <div className="media" key={index}>
          <div className="mediaImg">
            <img
              src={`https://sub.admin.xiaohuolongfujiankeji.com/${item.img}`}
              alt="活动"
            />
          </div>
          <div className="mediaContent">
            <div className="mediaHeading">
              <div
                className="mediaTitle"
                onClick={() => {
                  window.open(`#/view/${item.id}`);
                }}
              >
                <span>{item.title}</span>
              </div>
            </div>
            <div className="mediaDesc">{item.content}</div>
            <div className="mediaFooter">
              <div className="footLift">
                {/* 设置倒计时 */}
                <Countdown
                  date={
                    Date.now() +
                    moment(item.end_time).diff(moment(), "seconds") * 1000
                  }
                  renderer={({ hours, minutes, seconds, completed }) => {
                    if (completed) {
                      // Render a completed state

                      return <span>已截止</span>;
                    } else {
                      // Render a countdown
                      return (
                        <span>
                          {hours}时{minutes}分{seconds}秒
                        </span>
                      );
                    }
                  }}
                />
              </div>
              <div className="footRight">
                <span>{item.class}</span>
                <span style={{ color: "red" }}>{item.bonus}</span>
                <span>{item.participate}/20名额</span>
                <span>投稿时接受{item.days}天内视频</span>
                <span>允许投稿{item.limits}条</span>
                <span>限Lv{item.impose}参加</span>
              </div>
            </div>
          </div>
          <div className="mediaRight">
            <div className="addVideo">
              {/* {console.log(Date.now() >= moment(item.end_time))} */}
              {20 - item.participate > 0 &&
              Date.now() <= moment(item.end_time) ? (
                <Button type="primary">抢任务</Button>
              ) : (
                <Button type="primary" disabled>
                  已抢完
                </Button>
              )}
            </div>
            <div className="progress">
              <Progress
                showInfo={false}
                percent={((item.participate / 20) * 100).toFixed(0)}
              />
            </div>
          </div>
        </div>
      );
    });
  }
  //   按钮列别
  function btus() {
    return butList.map((item) => {
      return (
        <div className="filter" key={item.title.key}>
          <h3 className="filLeft">{item.title.label}</h3>
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
  //   任务抽屉列表
  function medie(data) {
    return data.map((item, index) => {
      return (
        <div to={`pack/${index}`} className="managementContent" key={index}>
          <div className="managementContentTitle">任务抽屉：{item.title}</div>
          <div className="managementContentDesc">{item.content}</div>
          <div className="footer">
            <div>
              {" "}
              含<span style={{ color: "red" }}>{item.count}</span> 任务
            </div>
            <div className="managementContentDay">
              {moment(item.start_time).format("MM月DD日")}~
              {moment(item.end_time).format("MM月DD日")}
            </div>
          </div>
        </div>
      );
    });
  }
  //   分页
  const tableChange = (page, pageSize) => {
    console.log(page, pageSize);
    const newObj = { ...classification };
    newObj.page = page;
    newObj.pageSize = pageSize;
    setClassification(newObj);
  };
  return (
    <div className={styles.root}>
      <div className="herder">
        <div className="task"> {medie(ListData)}</div>
      </div>
      <ProCard
        tabs={{
          type: "card",
        }}
      >
        <ProCard.TabPane key="tab1" tab="全部任务">
          <div className="crowding">{btus()}</div>
          <div className="mediaList">
            {dataList.length > 0 ? (
              dataList.length > 0 ? (
                task(dataList)
              ) : (
                <Empty />
              )
            ) : (
              <div className="spin">
                <Spin size="large" />
              </div>
            )}
            <div className="pag">
              <Pagination
                defaultCurrent={1}
                onChange={tableChange}
                // pageSize={10}
                // showSizeChanger
                showQuickJumper
                total={count}
                hideOnSinglePage={true}
              />
            </div>
          </div>
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="我抢到的">
          <div>
            <ProList />
          </div>
        </ProCard.TabPane>
      </ProCard>
    </div>
  );
}
