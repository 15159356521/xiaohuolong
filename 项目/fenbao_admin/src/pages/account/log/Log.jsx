import React from "react";

import styles from "./Log.module.scss";
import { ProCard } from "@ant-design/pro-components";
import { Table, Pagination } from "antd";
import { useEffect, useState } from "react";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";
import { getSafe } from "../../../api/user";
moment.locale("zh-cn");
const columns = [
  { title: "登入时间", dataIndex: "login_time", key: "login_time" },
  { title: "登入IP", dataIndex: "ip", key: "ip" },
  { title: "设备", dataIndex: "equipment", key: "equipment" },
  { title: "平台", dataIndex: "platform", key: "platform" },
  { title: "登入方式", dataIndex: "login_method", key: "login_method" },
];
const sensitive = [
  { title: "操作时间", dataIndex: "operation_time", key: "operation_time" },
  { title: "登入IP", dataIndex: "ip", key: "ip" },
  { title: "设备", dataIndex: "equipment", key: "equipment" },
  { title: "平台", dataIndex: "platform", key: "platform" },
  { title: "操作类型", dataIndex: "operation", key: "operation" },
];
export default function Log() {
  const [list, setList] = useState();
  const [count, setCount] = useState(0);
  const [myCount, setMyCount] = useState(0);
  // 分页
  const [upData, setUpData] = useState({
    page: 1,
    pageSize: 10,
  });
  const [myUpData, setMyUpData] = useState({
    page: 1,
    pageSize: 10,
  });
  useEffect(() => {
    getSafe(upData).then((res) => {
      console.log(res.data);
      for (let index = 0; index < res.data.length; index++) {
        res.data[index].platform= "电脑端"
        res.data[index].login_method= "密码登入"
        
      }
      setList(res.data);
    });
  }, [upData]);

  return (
    <div className={styles.root}>
      <ProCard
        tabs={{
          type: "card",
        }}
      >
        <ProCard.TabPane key="tab1" tab="登入记录">
          <Table
            dataSource={list}
            columns={columns}
            pagination={{
              total: count,
              pageSize: upData.pageSize,
              current: upData.page,
              onChange: (page, pageSize) => {
                setUpData({
                  ...upData,
                  page: page,
                  pageSize: pageSize,
                });
              },
            }}
          />
          ;
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="敏感操作">
          <Table
            columns={sensitive}
            pagination={{
              total: myCount,
              pageSize: upData.pageSize,
              current: upData.page,
              onChange: (page, pageSize) => {
                setMyUpData({
                  ...myUpData,
                  page: page,
                  pageSize: pageSize,
                });
              },
            }}
          />
          ;
        </ProCard.TabPane>
      </ProCard>
    </div>
  );
}
