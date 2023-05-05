import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { StoregrouplistxqApi } from "../../../utils/api";
import { useParams } from "react-router-dom";
export default function Equipmentlistxiangqing() {
  let params = useParams();
  console.log(params.id);
  let include = params.id;
  const [data, setData] = useState();
  useEffect(() => {
    StoregrouplistxqApi({ include }).then((res) => {
      console.log(res);
      setData(res.data.data);
    });
  }, []);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "设备码",
      dataIndex: "device_code",
      key: "device_code",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];
  return (
    <div>
      <Table dataSource={data} columns={columns} />;
    </div>
  );
}
