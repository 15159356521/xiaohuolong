import React, { useEffect, useState } from "react";
import styles from "./status.module.scss";
import { getAccountstatus } from "../../../api/user";
import { Table } from "antd";

const columns = [
  {
    title: "账号信息",
    dataIndex: "AccountInformation",
    key: "AccountInformation",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "说明",
    dataIndex: "illustrate",
    key: "illustrate",
  },
  {
    title: "记录",
    key: "logs",
    dataIndex: "logs",

    render: (_, { logs }) => {
      return <a key={logs}>{logs}</a>;
    },
  },
];

const data = [
  {
    key: "1",
    AccountInformation: "审核状态",
    status: "",
    illustrate: "账号转为正式运营阶段可获取更多权益",
  },
  {
    key: "2",
    AccountInformation: "运营状态	",
    status: "",
    illustrate: "严重不符合平台运营规范的行为账号将会被禁用",
  },
  {
    key: "3",
    AccountInformation: "MCN功能",
    status: "",
    illustrate: "账号分为MCN账号和个人账号",
  },
  {
    key: "4",
    AccountInformation: "信用分",
    status: "",
    illustrate: "违规行为会触发扣分和相应惩罚",
    logs: "查看",
  },
  {
    key: "5",
    AccountInformation: "违禁次数",
    status: "",
    illustrate: "不符合平台运营规范的行为会造成违规处罚",
    logs: "查看",
  },
];

export default function Status() {
  const [result, setResult] = useState();
  console.log(result);

  useEffect(() => {
    getAccountstatus().then((res) => {
      console.log(res.data);
      for (const key in res.data) {
        console.log(key);
        switch (key) {
          case "status":
            data[0]["status"] = res.data[key];
            break;
          case "operation_state":
            data[1]["status"] = res.data[key];
            break;
          case "type":
            data[2]["status"] = res.data[key];
            break;
          case "credit":
            data[3]["status"] = res.data[key];
            break;
          case "illegal_behavior":
            data[4]["status"] = res.data[key];
            break;
          default:
            break;
        }
      }
      console.log(data);
      setResult(data);
    });
  }, []);

  return (
    <div className={styles.root}>
      <Table columns={columns} dataSource={result} pagination={false}></Table>
    </div>
  );
}
