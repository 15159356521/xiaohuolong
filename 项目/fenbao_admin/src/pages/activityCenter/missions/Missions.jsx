import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Radio,
  Button,
  Progress,
  Pagination,
  Empty,
  message,
  Spin,
} from "antd";
import { ProCard, ProList } from "@ant-design/pro-components";
import styles from "./Missions.module.scss";
import moment from "moment";
import { getTask, getJob, getRob, getMyJob } from "../../../api/user";
import Countdown from "react-countdown";
// const key = 'updatable';

// const dataList = [
//   {
//     title: "综艺爆款火爆季",
//     desc: "本次活动是专为拆条创作者开展的长期活动。活动期间，不定期更换新片单。抢到任务的机构，其旗下所有子账号均可上传，并保证周期内上传总量必须满足对应创作条数。 点击子任务标题，可以阅读任务详情；请各位创作者谨慎评估后，决定是否抢任务！",
//     num: 8,
//     day: ["2022-09-21", "2022-09-30"],
//   },
//   {
//     title: "电影爆款火爆季",
//     desc: "本次活动是专为拆条创作者开展的长期活动。活动期间，不定期更换新片单。抢到任务的机构，其旗下所有子账号均可上传，并保证周期内上传总量必须满足对应创作条数。 点击子任务标题，可以阅读任务详情；请各位创作者谨慎评估后，决定是否抢任务！",
//     num: 8,
//     day: ["2022-09-21", "2022-09-30"],
//   },
//   {
//     title: "电视剧爆款火爆季",
//     desc: "本次活动是专为拆条创作者开展的长期活动。活动期间，不定期更换新片单。抢到任务的机构，其旗下所有子账号均可上传，并保证周期内上传总量必须满足对应创作条数。 点击子任务标题，可以阅读任务详情；请各位创作者谨慎评估后，决定是否抢任务！",
//     num: 8,
//     day: ["2022-09-21", "2022-09-30"],
//   },
//   {
//     title: "电影爆款火爆季",
//     desc: "本次活动是专为拆条创作者开展的长期活动。活动期间，不定期更换新片单。抢到任务的机构，其旗下所有子账号均可上传，并保证周期内上传总量必须满足对应创作条数。 点击子任务标题，可以阅读任务详情；请各位创作者谨慎评估后，决定是否抢任务！",
//     num: 8,
//     day: ["2022-09-21", "2022-09-30"],
//   },
//   {
//     title: "电视剧爆款火爆季",
//     desc: "本次活动是专为拆条创作者开展的长期活动。活动期间，不定期更换新片单。抢到任务的机构，其旗下所有子账号均可上传，并保证周期内上传总量必须满足对应创作条数。 点击子任务标题，可以阅读任务详情；请各位创作者谨慎评估后，决定是否抢任务！",
//     num: 8,
//     day: ["2022-09-21", "2022-09-30"],
//   },
// ];
// const dataList=[]
// axios.get('http://sub.admin.xiaohuolongkeji.com/sub_admin/task.TaskDrawerc/sel').then(res=>{
//   console.log(res.data.data)
// console.log(dataList);
// return dataList=res.data.data.data
// } )
// console.log(dataList);
const butList = [
  {
    title: {
      key: "type",
      label: "对象",
    },
    type: ["全部", "账号", "MCN"],
  },
  {
    title: {
      key: "Verticillata",
      label: "垂类",
    },
    type: ["全部", "拆条", "混剪", "解说"],
  },
  {
    title: {
      key: "speed",
      label: "进度",
    },
    type: ["全部", "已抢完", "未抢完"],
  },
  {
    title: {
      key: "times",
      label: "时间",
    },
    type: ["全部", "12小时", "24小时", "3天"],
  },
];

// const list = [
//   {
//     img: "https://data.xiaozhuyouban.com/missionscover/48768.jpg/600x900?str=1653840062",
//     title: "小猪优版特别任务《影视嘉年华》",
//     content:
//       " 影视剧创作持续火爆，本月将开启影视嘉年华不限创意，欢迎多多投递相关内容短视频作品。",
//     time: "2022-09-30",
//     type: "混剪",
//     money: 8000,
//     current: 11,
//     end: 17,
//     day: 7,
//     limit: 90,
//     impose: "限 lv.4,5,6 参与",
//   },
//   {
//     img: "https://data.xiaozhuyouban.com/missionscover/48768.jpg/600x900?str=1653840062",
//     title: "小猪优版特别任务《影视嘉年华》",
//     content:
//       " 影视剧创作持续火爆，本月将开启影视嘉年华不限创意，欢迎多多投递相关内容短视频作品。",
//     time: "2022-09-27",
//     type: "混剪",
//     money: 8000,
//     current: 17,
//     end: 17,
//     day: 7,
//     limit: 90,
//     impose: "限 lv.4,5,6 参与",
//   },
// ];
// for (let index = 0; index <20; index++) {
//   list[index]= list[0];

// }
// 将对象的对象名和对象值展开
// const flattenObject = (obj) =>
//   Object.keys(obj).reduce((acc, k) => {
//     // const pre = prefix.length ? `${prefix}.` : "";
//     // console.log(pre);
//     if (
//       typeof obj[k] === "object" &&
//       obj[k] !== null &&
//       Object.keys(obj[k]).length > 0
//     )
//       Object.assign(acc, flattenObject(obj[k], k));
//     else acc[k] = obj[k];
//     return acc;
//   }, {});

// 遍历任务抽屉
function medie(data) {
  return data.map((item, index) => {
    return (
      <Link to={`/pack/${item.id}`} className="managementContent" key={index}>
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
      </Link>
    );
  });
}

function Management() {
  const [dataList, setDataList] = useState([]);
  const [lists, setLists] = useState([]);
  const [count, setCount] = useState(0);
  const [myList, setMyList] = useState([]);
  const [myConut, setMyConut] = useState(0);
  // const navigate = useNavigate();
  const [classification, setClassification] = useState({
    type: "全部",
    speed: "全部",
    times: "全部",
    Verticillata: "全部",
    page: 1,
    pageSize: 10,
  });
  const [upData, setUpData] = useState({
  type: "全部",
  speed: "全部",
  times: "全部",
  Verticillata: "全部",
  page: 1,
  pageSize: 10,
});
  useEffect(() => {
    getTask()
      .then(function (response) {
//  console.log("", response.data);
        setDataList(response.data);
      })
      .catch(function (error) {
        console.log(11111111111, error);
      });
  }, []);
  useEffect(() => {
    // console.log(classification);

    getJob(classification)
      .then(function (response) {
        // console.log("qqqqqqq", response.code);
        if (response.code === 401) {
          message.error("登录过期，请重新登录");
          setLists([]);
          // console.log(response.data);
          setCount(0);
          return;
        } else {
          setLists(response.data.data);
          // console.log(response.data);
          setCount(response.data.count);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    (async () => {
      const res = await getMyJob(upData);
      // console.log("我的", res.data.data);
      setMyList(res.data.data);
      setMyConut(res.data.count);
    })();
  }, [classification,upData]);

  function task(data) {
    return data.map((item, index) => {
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
                    moment(item.end_time
                      ).diff(moment(), "seconds") * 1000
                  }
                  renderer={({ days, hours, minutes, seconds, completed }) => {
                    if (completed) {
                      // Render a completed state

                      return <span>已截止</span>;
                    } else {
                      // Render a countdown
                      return (
                        <span>
                          {days}天{hours}时{minutes}分{seconds}秒
                        </span>
                      );
                    }
                  }}
                />
                {/* <Countdown
                  data={Date.now()+moment(item.end_time)}
                  // format="D 天 H 时 m 分 s 秒"
                /> */}

                {/* <span>{item.end_time} </span> */}
                {/* <span>{item.time}</span> */}
              </div>
              <div className="footRight">
                <span>{item.class}</span>
                <span style={{ color: "red" }}>{item.bonus}</span>
                <span>
                  {item.person}/{item.participate}名额
                </span>
                <span>投稿时接受{item.days}天内视频</span>
                <span>允许投稿{item.limits}条</span>
                <span>限Lv{item.impose}参加</span>
              </div>
            </div>
          </div>
          <div className="mediaRight">
            <div className="addVideo">
              {/* {console.log(Date.now() >= moment(item.end_time))} */}
              {item.participate - item.person > 0 &&
              Date.now() <= moment("2022-10-20") ? (
                <Button
                  type="primary"
                  onClick={() => {
                    (async () => {
                      console.log(item.id);
                      const { code } = await getRob(item.id);

                      if (code === 1) {
                        message.success({ content: "抢任务成功", key: "task" });
                        getJob(classification)
                          .then(function (response) {
                            console.log("qqqqqqq", response.data);
                            setLists(response.data.data);
                            console.log(response.data);
                            setCount(response.data.count);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } else if (code === -1) {
                        message.warning({
                          content: "已抢过该任务",
                          maxCount: 1,
                          key: "task",
                        });
                      } else {
                        message.error({ content: "抢任务失败", key: "task" });
                      }
                    })();
                  }}
                >
                  抢任务
                </Button>
              ) : (
                <Button type="primary" disabled>
                  已抢完
                </Button>
              )}
            </div>
            <div className="progress">
              <Progress
                showInfo={false}
                percent={((item.person / item.participate) * 100).toFixed(0)}
              />
            </div>
          </div>
        </div>
      );
    });
  }
  // 获取向后端提交的数据

  function btus(callback) {

    return butList.map((item) => {
      return (
        <div className="filter" key={item.title.key}>
          <h3 className="filLeft">{item.title.label}</h3>
          <Radio.Group
            onChange={(e) => {
              // but(e.target.value, item.title.key,callback);
            console.log(callback);
              const newObj = { ...classification };
              for (const key in newObj) {
                if (key === item.title.key) {
                  newObj[key] = e.target.value;

                }
              }
              // console.log(newObj);
              callback(newObj);
              
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
  // 分页
  const tableChange = (page, pageSize) => {
    console.log(page, pageSize);
    const newObj = { ...classification };
    newObj.page = page;
    newObj.pageSize = pageSize;
    setClassification(newObj);
  };
  return (
    <div className={styles.main}>
      <div className="herder">
        <div className="task"> {medie(dataList)}</div>
        {/* <div className="task">{medie(listData)}</div> */}
      </div>
      <ProCard
        tabs={{
          type: "card",
        }}
      >
        <ProCard.TabPane key="tab1" tab="全部任务">
          <div className="crowding">{btus(setClassification)}</div>
          <div className="mediaList">
            {lists.length > 0 ? (
              lists.length > 0 ? (
                task(lists)
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
                total={count}
                hideOnSinglePage={true}
              />
            </div>
          </div>
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="我抢到的">
          <div className="crowding">{btus(setUpData)}</div>
          <div className="mediaList">
            {myList!== undefined ? (
              myList.length > 0 ? (
                task(myList)
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
                onChange={(page, pageSize) => {
                  console.log(page, pageSize);
                  const newObj = { ...classification };
                  newObj.page = page;
                  newObj.pageSize = pageSize;
                  setUpData(newObj)
                }}
                // pageSize={10}
                total={myConut}
                hideOnSinglePage={true}
              />
            </div>
          </div>
        </ProCard.TabPane>
      </ProCard>
    </div>
  );
}

export default Management;
