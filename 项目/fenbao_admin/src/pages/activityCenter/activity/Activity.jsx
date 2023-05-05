import React, { useState, useEffect } from "react";
import { ProCard } from "@ant-design/pro-components";
import { Button, Pagination,Empty,Spin,Radio } from "antd";
import styles from "./Activity.module.scss";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";

import { getTaskList,getMyTaskList } from "../../../api/user";
moment.locale("zh-cn");

// const dataLIst = [
//   {
//     title: "小火龙继续飞",
//     content:
//       "明嘉靖三十七年，宦官权倾朝野。方术国师为谄媚监首厂公，提出以“活虎心”炼丹，用以“壮阳重生”。故东厂在猛虎出没地——西南边陲小镇设立“司礼猎场”，猎捕猛虎用以炼化。但没有想到，此举使得奇异病毒进入老虎体内，让老虎发狂，并形成",
//     img: "https://data.xiaozhuyouban.com/activitycover/48055.jpg/320x216?str=1663653479",
//     time: "2022-09-10 至 2022-10-10",
//     bonus: "100",
//     limit: "限Lv.4混剪,Lv.5混剪",
//     participate: "102",
//   },
// ];

// for (let i = 0; i < 50; i++) {
//   dataLIst.push(dataLIst[0]);
// }
const butList = [
  {
    title: {
      key: "classification",
      label: "分类",
    },
    type: ["全部", "新热版创", "专题活动"],
  },
  {
    title: {
      key: "status",
      label: "类型",
    },
    type: ["全部", "视频", "合辑"],
  },

];

function Management() {
  const [list, setList] = useState();
  const [upData, setUpData] = useState({
    classification: "",
    status: "",
    page: 1,
    pageSize: 10,
  });
  const [count, setCount] = useState(0);
  const[myList,setMyList]=useState();
  const[myConut,setMyConut]=useState(0);
  useEffect(() => {
    // console.log(upData);
    getTaskList(upData).then((res) => {
      // console.log(res.data);
      setList(res.data.data);
      setCount(res.data.count);
    });
    getMyTaskList(upData).then((res) => {
      console.log(res.data.data,"我的");
      setMyList(res.data.data);
setMyConut(res.data.count)
      // setCount(res.data.data.count);
    });
    // console.log(list);
  }, [upData]);
  function but(value, data) {
    const newObj = { ...upData };
    for (const key in newObj) {
      if (key === data) {
        if (value === "全部") {
          newObj[key] = "";
        } else {
            newObj[key] = value;
        }
      
      }
    }

    setUpData(newObj);
  }
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

  const tableChange = (page, pageSize) => {
    // console.log(page, pageSize);
    const newObj = { ...upData };
    newObj.page = page;
    newObj.pageSize = pageSize;
    setUpData(newObj);
    // setList([...list]);
    // console.log(list.length);
  };
  function listData(data) {
    return data.map((item, index) => {
      return (
        <div key={index} className="list">
          <div className="listLife">
            {" "}
            <img src={`https://sub.admin.xiaohuolongfujiankeji.com/${item.img}`}></img>
          </div>
          <div className="listRight">
            {" "}
            <div className="herder" style={{ cursor: "pointer"}} onClick={()=>{
                window.open(`#/views/${item.id}`)
            }}>{item.title}</div>
            <div className="content">{item.content}</div>
            <div className="foot">
              <div className="time">
                有效期： {moment(item.start_time).format("YYYY年MM月DD日")}~
                {moment(item.end_time).format("YYYY年MM月DD日")}
              </div>
              <div className="footRight">
                <span>
                  活动奖金 <span className="bonus">{item.money}元</span>
                </span>

                <span> {item.limit}</span>
                <span> {item.impose}</span>
                <span>{item.person}参加</span>
              </div>
   
            </div>
          </div>
          <div className="addVideo">
              {/* {console.log(Date.now() >= moment(item.end_time))} */}
              {
              Date.now() >= moment(item.publish_time) ? (
                <Button  onClick={()=>{
                  window.open(`#/notice/act/${item.id}`)
              
                }}>
                获奖公告
               </Button>
              ) : ( <div></div>)}
            </div>
        </div>
      );
    });
  }

  return (
    <div className={styles.root}>
      <ProCard
        tabs={{
          type: "card",
        }}
      >
        <ProCard.TabPane key="tab1" tab="活动">

             <div className="crowding">{btus()}</div>
          <div>
 
      {list!==undefined ? list.length > 0 ? listData(list) : <Empty />:   <div className="spin"><Spin size="large" /></div>
  }    
  
       
            <div className="pag">
              <Pagination
                locale={locale}
                defaultCurrent={1}
                onChange={tableChange}
                hideOnSinglePage={true}
                total={count}
              />
            </div>
          </div>
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="我参与的">

  <div className="crowding">{btus()}</div>
  {myList!==undefined ? myList.length > 0 ? listData(myList) : <Empty />:   <div className="spin"><Spin size="large" /></div>
  }    
          <div className="pag">
            <Pagination
              locale={locale}
              defaultCurrent={1}
              onChange={tableChange}
              total={myConut}
              hideOnSinglePage={true}
            />
          </div>
        </ProCard.TabPane>
      </ProCard>
    </div>
  );
}

export default Management;
