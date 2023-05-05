import React, { useEffect, useState } from "react";
import { Card, Table } from "antd";
import { StorerecordApi } from "../../../utils/api";
import { getstore_id } from "../../../utils/store_id";
const { Column } = Table;
export default function Recharge() {
  const store_id = getstore_id();
  const [data, setData] = useState([]);
  useEffect(() => {
    let id = localStorage.getItem("id");
    StorerecordApi({ id, store_id }).then((res) => {
      console.log(res.data);
      setData(res.data.data);
    });
  }, []);
  return (
    <div>
      <Card>
        <Table pagination={true} dataSource={data}   scroll={{ x:1200 }}>
          <Column dataIndex="id" key="id" title="ID"></Column>
          <Column dataIndex="username" key="username" title="会员"></Column>
          <Column dataIndex="minute" key="minute" title="充值分钟"></Column>
          <Column
            dataIndex="current_minute"
            key="current_minute"
            title="充值后剩余分钟"
          ></Column>
          <Column
            dataIndex="created_at"
            key="created_at"
            title="充值时间"
          ></Column>
          <Column dataIndex="declare" key="declare" title="说明"></Column>
        </Table>
      </Card>
    </div>
  );
}
