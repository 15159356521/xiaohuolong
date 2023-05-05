import React, { useEffect, useState } from "react";
import { Table, Pagination, Card, DatePicker, Form, Button, Input } from "antd";
import { StoreDeviceStartcApi } from "../../../utils/api";
import { getstore_id } from "../../../utils/store_id";
const { Column } = Table;

const store_id = getstore_id();
export default function Earnings() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  let page = 1;
  let pageSize = 10;
  useEffect(() => {
    StoreDeviceStartcApi({ store_id, page, pageSize }).then((res) => {
      console.log(res.data.data.data);
      setData(res.data.data.data);
      setTotal(res.data.data.count);
    });
  }, [page, pageSize]);

  const onChange = (page, pageSize) => {
    StoreDeviceStartcApi({ store_id, page, pageSize }).then((res) => {
      setData(res.data.data.data);
    });
  };

  const [dateStringdata, setDateStringdata] = useState("");
  const onChangetime = (_, dateString) => {
    setDateStringdata(dateString);
  };

  const onFinish = (values) => {
    console.log(values);
    let code = values.code;
    StoreDeviceStartcApi({
      store_id,
      page,
      pageSize,
      time: dateStringdata,
      code,
    }).then((res) => {
      console.log(res.data.data.data);
      setData(res.data.data.data);
      setTotal(res.data.data.count);
    });
  };
  return (
    <div>
      <Card>
        <Form name="horizontal_login" layout="inline" onFinish={onFinish}>
          <Form.Item>
            <DatePicker onChange={onChangetime} picker="month" />
          </Form.Item>
          <Form.Item name="code" label="请输入设备码">
            <Input />
          </Form.Item>
          <Form.Item shouldUpdate>
            <Button type="primary" htmlType="submit">
              查询
            </Button>{" "}
          </Form.Item>
          {/* <Button type="primary" onClick={handleExportCurrentExcel}>
              导出数据表
            </Button> */}
        </Form>
      </Card>
      <Card>
        <Table pagination={false} dataSource={data}   scroll={{ x:1200 }}>
          <Column dataIndex="id" key="id" title="设备Id"></Column>
          <Column
            dataIndex="shop_name"
            key="shop_name"
            title="所属店家"
          ></Column>
          <Column
            dataIndex="device_code"
            key="device_code"
            title="设备码"
          ></Column>
          <Column dataIndex="minute" key="minute" title="开机时长"></Column>
          <Column dataIndex="money" key="money" title="设备收益"></Column>
          <Column dataIndex="earnings" key="earnings" title="我的收益"></Column>
          <Column
            dataIndex="created_at"
            key="created_at"
            title="开机时间"
          ></Column>
        </Table>
        <Pagination
          style={{ marginTop: "20px" }}
          showQuickJumper
          defaultCurrent={1}
          total={total}
          onChange={onChange}
        />
      </Card>
    </div>
  );
}
