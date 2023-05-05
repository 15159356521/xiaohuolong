import React, { useState, useEffect } from "react";
import { Button, DatePicker, Space, Input, Table, Pagination } from "antd";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";
import styles from "./Analysus.module.scss";
import { getVideoList } from "../../api/user";
const { RangePicker } = DatePicker;
moment.locale("zh-cn");
const columns = [
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "发布时间",
    dataIndex: "add_time",
  },
  {
    title: "热度值",
    dataIndex: "hot",
  },
  {
    title: "视频尺寸",
    dataIndex: "size",
  },
  {
    title: "视频时长",
    dataIndex: "often",
  },
];
const dateFormat = "YYYY/MM/DD";
// 模拟数据
// const arr = [];

// for (let i = 0; i < 5; i++) {
//   arr.push({
//     key: i,
//     title: " 金牌律师：美女到来，有人口不择言惹人烦结局太搞笑了",
//     time: "2020-12-12 12:12:12",
//     hot: 25,
//     size: "1920*1080",
//     duration: "12:12:12",
//   });
// }
// 获取一年前的日期

export default function Analysis() {
  const [data, setData] = useState([]);

  const [but, setBut] = useState(["", "", ""]);
  const disabledDate = (current) => {
    // console.log(current);
    return current && current > moment().endOf("day");
  };
  const [theDay, setTheDay] = useState([
    moment().subtract(1, "M").format("YYYY-MM-DD"),
    moment().format("YYYY-MM-DD"),
  ]);
  // const { onSearch, onTypeChange, defaultType = 'articles', onFilterChange } = props;
  const [searchText, setSearchText] = useState();
  const [classification, setClassification] = useState({
    page: 1,
    pageSize: 10,
    id:localStorage.getItem("Id"),
    past: moment().subtract(1, "M").format("YYYY-MM-DD"),
    theDay: moment().format("YYYY-MM-DD"),
    value:''
  });
  // 搜索视频
  useEffect(() => {
    // 后端获取数据

    (async function () {
      try {
        const res = await getVideoList(classification);
        // console.log(res);
        
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    })();
    // console.log(classification);
  }, [classification]);
  // 关键字搜索
  const onSearch = (value) => {
    // console.log(value);
    const newClassification = { ...classification, value };
    setClassification(newClassification);
    

  };
  // 时间切换搜索
  const but1 = (i, j) => {
    // console.log(i);
    for (let j = 0; j < but.length; j++) {
      but[j] = "";
    }
    but[i] = "primary";
    setBut([...but]);
    const newObj = { ...classification };
    newObj.past = moment().subtract(j, "d").format("YYYY-MM-DD");
    setTheDay([moment().subtract(j, "d").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]);
    setClassification(
      newObj
    );
    // console.log(past);
    //   // setTheDay(past)
    // console.log(theDay);
  };
  const onPanelChange = (value, mode) => {
    if (mode[0] === "") {
      console.log(3);
      setTheDay(
        [moment().subtract(1, "M").format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD")]
      );
    }else{
      setTheDay(mode);
    }

}
  const upData = () => {
    const newObj = { ...classification };
    newObj.past = theDay[0];
    newObj.theDay = theDay[1];
    setClassification(
      newObj
    );
    // 将数据提交给后端
   
    // console.log(past, theDay);
  };

  return (
    <div className={styles.root}>
      <div className="herder">
        <div className="herLeft">
          <div className="leftLab">时间：</div>
          <div className="leftCon">
            <Button type={but[0]} onClick={() => but1(0, 7)}>
              7日
            </Button>
            <Button type={but[1]} onClick={() => but1(1, 14)}>
              14日
            </Button>
            <Button type={but[2]} onClick={() => but1(2, 30)}>
              30日
            </Button>
          </div>
        </div>
        <div className="herMid">
          <Space direction="vertical" size={12}>
            <RangePicker
              locale={locale}
              disabledDate={disabledDate}
              onChange={onPanelChange}
              value={[
                moment(theDay[0], dateFormat),
                moment(theDay[1], dateFormat),
              ]}
            />
            <Button className="herBut" onClick={upData}>
              搜索
            </Button>
          </Space>
        </div>
        <div className="herRig">
          <Input.Search
            placeholder="请输入"
            enterButton="搜索"
            size="large"
            allowClear
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            // onKeyUp={(e) => {
            //   if (e === 13) {
            //     // onSearch(searchText);
            //     console.log(44);
            //   }
            // }}
            onSearch={onSearch}
            style={{ maxWidth: 522, width: "100%" }}
          />
        </div>
      </div>
      <div className="tabBody">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            hideOnSinglePage: true,
          }}
        />
      </div>
    </div>
  );
}
