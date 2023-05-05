import { Button, Form, DatePicker, Table, Pagination, Input, Card } from "antd";
import React, { useState, useEffect, Link } from "react";
import { StoreReportApi } from "../../../utils/api";

const { Column } = Table;
const Storereport = () => {
  const [dateStringdata, setDateStringdata] = useState("");
  // const page = 1;
  // const pageSize = 10;
  const [data, setData] = useState();
  const onChange = (_, dateString) => {
    console.log(dateString);
    setDateStringdata(dateString);
  };

  const onFinish = (values) => {
    let time = dateStringdata;
    let storename = values.storename;
    let page = 1;
    let pageSize = 10;
    StoreReportApi({ time, storename, page, pageSize }).then((res) => {
      console.log(res);
      setData(res.data.data.data);
    });
  };

  useEffect(() => {
    let page = 1;
    let pageSize = 10;
    StoreReportApi({ page, pageSize }).then((res) => {
      console.log(res.data.data.data);
      setData(res.data.data.data);
    });
  }, []);

  const handleChange = (page, pageSize) => {
    console.log(page, pageSize);
    StoreReportApi({ page, pageSize }).then((res) => {
      console.log(res.data.data.data);
      setData(res.data.data.data);
    });
  };

  return (
    <div>
      <div>
        <Card>
          <Form name="horizontal_login" layout="inline" onFinish={onFinish}>
            <Form.Item name="storename">
              <Input placeholder="请输入店名" />
            </Form.Item>
            <Form.Item name="time">
              <DatePicker onChange={onChange} placeholder="创建时间" />
            </Form.Item>
            <Form.Item shouldUpdate>
              <Button type="primary" htmlType="submit">
                查询
              </Button>{" "}
            </Form.Item>
          </Form>
        </Card>
      </div>

      <div style={{ marginTop: "10px" }}>
        <Card>
                 
          <Table pagination={false} dataSource={data}  scroll={{ x:1200 }} >
            <Column
              dataIndex="device_code"
              key="device_code"
              title="设备码"
            ></Column>
            <Column
              dataIndex="shop_name"
              key="shop_name"
              title="店家名称"
            ></Column>
            <Column dataIndex="address" key="address" title="店家地址"></Column>
            <Column
              dataIndex="total_start_num"
              key="total_start_num"
              title="开机次数"
            ></Column>

            <Column
              dataIndex="total_start_minute"
              key="total_start_minute"
              title="开机时长"
            ></Column>
            <Column
              dataIndex="business_earnings"
              key="business_earnings"
              title="设备收益"
            ></Column>
          </Table>
        </Card>
      </div>
    </div>
  );
};
export default Storereport;
