import React, { useState, useEffect } from "react";
import styles from "./copyright.module.scss";
import { ExclamationOutlined } from "@ant-design/icons";
import {
  Radio,
  Space,
  Input,
  Divider,
  Card,
  Empty,
  Spin,
  Pagination,
} from "antd";
import images from "../../assets/film.jpg";
import {
  getHot,
  getCopyright,
  postCopyright,
  postCopyrighttype,
} from "../../api/user";
import axios from "axios";

const { Search } = Input;
const { Meta } = Card;

function Copyright() {
  const [list, setList] = React.useState([]);
  const [shelves, setShelves] = useState([]);
  const [comingdown, setComingdown] = useState([]);
  const [rtdown, setRtdown] = useState([]);
  const [copyrightdata, setCopyrightdata] = useState([]);
  // 监听页数
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const onChange = (page, limit) => {
    axios
      .post("/sub_admin/copyright.Copyrightc/serach", {
        page,
        limit,
      })
      .then((res) => {
        console.log(res);
        setCopyrightdata(res.data.data.data);
      });
    console.log("Page: ", page, limit);
  };
  // 单选按钮数据
  const titles = [
    {
      title: {
        key: "year",
        label: "年份:",
      },
      type: [
        "全部",
        "2016-2022",
        "2011-2015",
        "2006-2010",
        "2001-2005",
        "1996-2000",
        "1990-1995",
        "其他",
      ],
    },
    {
      title: {
        key: "classify",
        label: "分类:",
      },
      type: ["全部", "电视剧", "电影", "动漫", "少儿", "纪录片", "综艺娱乐"],
    },
    {
      title: {
        key: "regiona",
        label: "地区:",
      },
      type: [
        "全部",
        "中国大陆",
        "中国香港",
        "中国台湾",
        "美国",
        "日本",
        "韩国",
        "印度",
        "泰国",
        "其他",
      ],
    },
    {
      title: {
        key: "level",
        label: "等级",
      },
      type: ["全部", "B", "A", "S"],
    },
    {
      title: {
        key: "score",
        label: "评分",
      },
      type: ["全部", "5", "6", "7", "8"],
    },
    {
      title: {
        key: "shelves",
        label: "上架",
      },
      type: ["全部", "待上架", "已上架"],
    },
    {
      title: {
        key: "make",
        label: "允许制作",
      },
      type: ["全部", "拆条", "二创", "活动"],
    },
    {
      title: {
        key: "hot",
        label: "热门片单",
      },
      type: ["全部", "热门"],
    },
  ];

  // 配置默认值 双向
  const [type, setType] = useState({
    year: "全部",
    classify: "全部",
    regiona: "全部",
    level: "全部",
    score: "全部",
    shelves: "全部",
    make: "全部",
    hot: "全部",
  });

  // 获取传值
  function titleshandlerchange(value, data) {
    // console.log(value, data);
    const newObj = { ...type };
    for (const key in newObj) {
      if (key === data) {
        newObj[key] = value;
      }
    }
    setType(newObj);
  }

  // 请求
  useEffect(() => {
    // let paginationdata = { ...pagination };
    console.log(type);
    for (let key in type) {
      if (type.hasOwnProperty(key) === true) {
        pagination[key] = type[key];
      }
    }
    // const types = { paginationdata, type };
    axios
      .post("/sub_admin/copyright.Copyrightc/serach", pagination)
      .then(function (response) {
        console.log(response);
        setCopyrightdata(response.data.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [type, pagination]);

  // 按钮渲染
  function Copyrighttitles() {
    return titles.map((item) => {
      return (
        <div className="filter" key={item.title.key}>
          <h3 className="pullLeft">{item.title.label}</h3>
          <Radio.Group
            onChange={(e) => {
              titleshandlerchange(e.target.value, item.title.key);
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

  // 搜索
  // const [serach,setSearch] = useState({})
  const onSearch = (value) => {
    const search = { ...pagination, value };
    console.log(search);
    axios
      .post("/sub_admin/copyright.Copyrightc/serach", search)
      .then((res) => {
        console.log(res+"搜索");
        setCopyrightdata(res.data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 热门片单.上架.下架请求后端数据
  useEffect(() => {
    console.log(5);
    getHot()
      .then(function (response) {
        setList(response.data[1]);
        setShelves(response.data[2]);
        setComingdown(response.data[3]);
        setRtdown(response.data[4]);
        console.log(list);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // 双像绑定的数据上架.下架
  function listData() {
    return list.map((item, index) => {
      return (
        <div className="list" key={index}>
          <div className="listLeft">
            <p className="listLeftTitle">{item.title}</p>
            <p className="listLeftTime">{item.add_time}</p>
          </div>
        </div>
      );
    });
  }
  function shelvesData() {
    return shelves.map((item, index) => {
      return (
        <div className="list" key={index}>
          <div className="listLeft">
            <p className="listLeftTitle">{item.title}</p>
            <p className="listLeftTime">{item.auth_add_time}</p>
          </div>
        </div>
      );
    });
  }
  function comingdownData() {
    return comingdown.map((item, index) => {
      return (
        <div className="list" key={index}>
          <div className="listLeft">
            <p className="listLeftTitle">{item.title}</p>
            <p className="listLeftTime">{item.auth_end_time}</p>
          </div>
        </div>
      );
    });
  }
  function rtdownData() {
    return rtdown.map((item, index) => {
      return (
        <div className="list" key={index}>
          <div className="listLeft">
            <p className="listLeftTitle">{item.title}</p>
            <p className="listLeftTime">{item.auth_end_time}</p>
          </div>
        </div>
      );
    });
  }

  // 发送请求获取参数
  useEffect(() => {
    axios
      .post("/sub_admin/copyright.Copyrightc/serach", {
        page: 1,
        limit: 10,
      })
      .then((res) => {
        console.log(res);
        // debugger;
        setCopyrightdata(res.data.data.data);
      });
    // getCopyright()
    //   .then(function (response) {
    //     setCopyrightdata(response.data);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }, []);

  function carddata() {
    return copyrightdata.map((item, index) => {
      return (
        <Card bordered={false} cover={<img alt="图片在路上" src={images} />}>
          <Meta
            title={item.title}
            description=<div>
              {item.classify}--{item.type}
              主演:{item.actor}
              <br />
              导演:{item.director}
              <p style={{ color: "red" }}>不允许超过90秒</p>
            </div>
          />
        </Card>
      );
    });
  }

  return (
    <div className={styles.root}>
      <div className="panel">
        <div className="alert">
          <div className="alertLeft">
            <ExclamationOutlined className="icon" />
            <strong className="textTitle">提示：</strong>
          </div>
          <div className="alertRight">
            对应等级的账号只能使用对应等级的版权片单，违规将扣除账号信用分。
            <span style={{ color: "red" }}>热门片单发优先级高</span>
          </div>
        </div>
        <div className="content">
          <div className="hot">
            <div className="title">
              <strong>热门片单</strong>
              <div className="listData" style={{ color: "red" }}>
                {listData()}
              </div>
              <div></div>
            </div>
          </div>

          <div className="new">
            <div className="title">
              <strong>最近上架</strong>
              <div className="listData">{shelvesData()}</div>
            </div>
          </div>

          <div className="last">
            <div className="title">
              <strong>即将下架</strong>
              <div className="listData">{comingdownData()}</div>
            </div>
          </div>

          <div className="low">
            <div className="title">
              <strong>最近下架</strong>
              <div className="listData">{rtdownData()}</div>
            </div>
          </div>
        </div>
      </div>
      <Divider />

      <div className="main">
        <div>{Copyrighttitles()}</div>
        <div className="mainsearch">
          <span
            style={{
              fontSize: "18px",
              marginTop: "5px",
              fontWeight: "600",
              // marginTop: "35px",
              color: "#999",
            }}
          >
            搜索:
          </span>
          <Space style={{ marginLeft: "10px" }}>
            <Search
              size="large"
              placeholder=" 片名、导演、主演  "
              onSearch={onSearch}
              enterButton
            />
          </Space>
        </div>
      </div>
      {/* 搜索 */}
      {/* <div className="mainsearch">
        <span
          style={{
            fontSize: "18px",
            marginTop: "5px",
            fontWeight: "600",
            // marginTop: "35px",
            color: "#999",
          }}
        >
          搜索:
        </span>
        <Space style={{ marginLeft: "10px" }}>
          <Search
            size="large"
            placeholder=" 片名、导演、主演  "
            onSearch={onSearch}
            enterButton
          />
        </Space>
      </div> */}
      <Divider />
      <div className="bottom">
        <div className="carddiv">
          {/* {comingdown.length > 0 ? (
            comingdown.length > 0 ? (
              carddata()
            ) : (
              <Empty />
            )
          ) : (
            <div className="spin">
              <Spin size="large" />
            </div>
          )} */}
          {carddata()}
        </div>
        <div>
          <Pagination
            showQuickJumper
            // defaultCurrent={1}
            total={500}
            onChange={onChange}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
}
export default Copyright;
