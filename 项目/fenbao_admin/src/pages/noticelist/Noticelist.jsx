import React, { useState, useEffect } from "react";
import styles from './Noticelist.module.scss'
import { Radio,  Pagination } from "antd";
import {getNoticeAll} from "../../api/user"
import locale from "antd/es/date-picker/locale/zh_CN"
import moment from "moment";
const titles = [

  {
    title: {
      key: "state",
      label: "状态：",
    },
    type: ["全部", "通知", "内容", "公示","资讯"],
  },
];
let li=[{id:0, title:"公示 | 小猪课堂专属“优质创作MCN”第六批荣誉称号获奖名",times:"2022-09-05 14:59"}]
for (let index = 0; index < 16; index++) {
  li[index] = li[0];
} 
// console.log(li);
function Noticelist() {
  const [classification, setClassification] = useState({
    Notice: "全部",
    page: 1,
    pageSize: 16,
  });
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    console.log(classification);
    (async () => {
      const res = await getNoticeAll(classification);
      console.log(res.data);
      setDataList(res.data.data);
      setTotal(res.data.count);
    })();
  }
 ,[classification]);
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
  function btu() {
    return titles.map((item) => {
      return (
        <div className="filter" key={item.title.key}>
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
  function listData(){
    return dataList.map((item,index)=>{
      return(
        <div className="listData" key={index}>
          <div onClick={()=>{
                      window.open(`#/notice/${item.id}/not`)
              }} className="text">{item.class} | {item.title}</div>
          <div className="times">        {moment(item.times).format("YYYY年MM月DD日 HH时mm分ss秒")}</div>
        </div>
      )
    })
  }
  const tableChange = (page, pageSize) => {

    const newObj = { ...classification };
    newObj.page = page;
    newObj.pageSize = pageSize;
    setClassification(newObj);
  };
  return (
    <div className={styles.root}>
      <div className="herder">{btu()} </div>
      <div className="list">
      {listData()}
      </div>
      <div className="foot">
      <Pagination
              locale={locale}
              defaultCurrent={1}
             pageSize={classification.pageSize}
              onChange={tableChange}
              total={total}
             hideOnSinglePage={true}
            />
      </div>
    </div>
  )
}
export default Noticelist