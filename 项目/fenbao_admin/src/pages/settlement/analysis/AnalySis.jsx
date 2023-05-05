import React, { useState, useEffect } from "react";
import RcResizeObserver from "rc-resize-observer";
import { ProCard } from "@ant-design/pro-components";
import { Statistic, DatePicker, Button, Table } from "antd";
import moment from "moment";

import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";

import { Line } from "@ant-design/charts";
import styles from "./AnalySis.module.scss";

// 列表
const { Column } = Table;
const dataSource = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
];

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    width: 550,
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address",
  },
];

// 日期
const { Divider } = ProCard;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

export default function Analysis() {
  // 日期函数
  const [dataStringList, setdataStringList] = useState([]);
  function handChange(date, dataString) {
    // console.log(11111, dataString);
    setdataStringList(dataString);
  }
  const [btn, setBtn] = useState([]);

  const btn1 = (i, j) => {
    // console.log(i);
    for (let j = 0; j < btn.length; j++) {
      btn[j] = "";
    }
    btn[i] = "primary";
    setBtn([...btn]);

    setdataStringList([
      moment().subtract(j, "d").format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD"),
    ]);
  };

  // 起始结束时间
  const [starttime, setStarttime] = useState(
    moment().subtract(7, "days").format("YYYY-MM-DD")
  );
  const [endtime, setEndtime] = useState(moment().format("YYYY-MM-DD"));

  //拿取后端的数据
  // useEffect(() => {
  //   console.log(dataStringList);
  // });
  function handClick() {
    console.log(dataStringList);
  }

  // 趋势图的时间
  // const [trenddate, setTrenddate] = useState();
  // useEffect(() => {
  //   console.log("时间数据", trenddate);
  // }, []);

  // 趋势图的数据

  const data = [
    { date: starttime, value: 5600 },
    { date: endtime, value: 4000 },
  ];

  const config = {
    data,
    xField: "date",
    yField: "value",
    point: {
      size: 5,
      shape: "diamond",
    },
  };
  // 时间差
  const handlerComputed = () => {
    let time = starttime;
    let weekArr = [];
    for (let i = 0; i < 8; i++) {
      let tempTime = moment(time).weekday(i);
      let tr = moment(tempTime).format("YYYY-MM-DD");
      weekArr.push(tr);
    }
    console.log(weekArr);
  };
  // 热度值
  const handlerValue = () => {
    console.log("热度值");
  };

  // 总收益
  const handlerEarnings = () => {
    console.log("总收益");
  };

  const [responsive, setResponsive] = useState(false);

  return (
    <div className={styles.main}>
      <div className="top">
        <RcResizeObserver
          key="resize-observer"
          onResize={(offset) => {
            setResponsive(offset.width < 596);
          }}
        >
          <ProCard.Group
            title="最近更新"
            direction={responsive ? "column" : "row"}
          >
            <ProCard>
              <Statistic value={79.0} precision={2} />
              <p>累计总收益</p>
            </ProCard>
            <Divider type={responsive ? "horizontal" : "vertical"} />
            <ProCard>
              <Statistic value={112893.0} precision={2} />
              <p>当日收益</p>
            </ProCard>
            <Divider type={responsive ? "horizontal" : "vertical"} />
            <ProCard>
              <Statistic value={112893.0} precision={2} />
              <p>总日热度值</p>
            </ProCard>
            <Divider type={responsive ? "horizontal" : "vertical"} />
            <ProCard>
              <Statistic value={112893.0} precision={2} />
              <p>活动奖金</p>
            </ProCard>
          </ProCard.Group>
        </RcResizeObserver>
      </div>
      <div className="list">
        <div className="label">
          <span style={{ color: "#8e9aa9" }}>类别:</span>{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="default" size="10" onClick={handlerValue}>
            热度值
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="default" onClick={handlerEarnings}>
            总收益
          </Button>
          <Button onClick={handlerComputed}> 计算</Button>
        </div>
        <div className="label2">
          <span style={{ color: "#8e9aa9" }}>时间:</span>
          &nbsp;&nbsp;&nbsp;
          <Button type={btn[0]} onClick={() => btn1(0, 7)}>
            7日
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button type={btn[1]} onClick={() => btn1(1, 14)}>
            2周
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button type={btn[2]} onClick={() => btn1(2, 30)}>
            1个月
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <RangePicker
            onChange={handChange}
            locale={locale}
            defaultValue={[
              moment(starttime, dateFormat),
              moment(endtime, dateFormat),
            ]}
            disabled={[false, false]}
          />
          <Button onClick={handClick}>查找</Button>
        </div>
      </div>
      <div
        style={{
          marginLeft: "70px",
          marginTop: "40px",
          fontSize: "12px",
        }}
      >
        趋势图
      </div>
      <div className="potot">
        <Line {...config} />
      </div>
      <div>
        {" "}
        <div>
          <ProCard.Group
            style={{ height: "500px" }}
            title="详细数据"
            direction={responsive ? "column" : "row"}
          >
            <Table
              pagination={{ hideOnSinglePage: true }}
              dataSource={dataSource}
              columns={columns}
              // pagination={true}
            >
              <Column key="date" title="日期"></Column>
              <Column key="date" title="当日热度值"></Column>
              <Column key="date" title="当日收益"></Column>
            </Table>
          </ProCard.Group>
        </div>
      </div>
    </div>
  );
}
