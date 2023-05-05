import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Input,
  Table,
  DatePicker,
  Drawer,
  List,
  Image,
  Avatar,
  Card,
} from "antd";
import { StoreCustomercApi } from "../../../utils/api";
import { getstore_id } from "../../../utils/store_id";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import moment from "moment";
const { Column } = Table;
export default function Member() {
  const store_id = getstore_id();
  const [data, setData] = useState();
  const [data1, setData1] = useState();
  const [count, setCount] = useState();
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
  limit:10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  useEffect(() => {
    StoreCustomercApi({ store_id,page:1,limit:10 }).then((res) => {
      console.log(res.data.data);
      console.log(res.data.data.count);
      setCount(res.data.data.count);
      setPaginationPramas((preState) => ({
        ...preState,
        total: res.data.data.count,
      }));
      setData(res.data.data.data);
    });
  }, []);

  const [dateStringdata, setDateStringdata] = useState("");
  const [form] = Form.useForm();
  const yearmoent = moment().format("YYYY年MM月");
  const onChange = (_, dateString) => {
    console.log(dateString);
    setDateStringdata(dateString + "-00");
  };

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
    let times = moment().format("YYYY-MM-DD");
    StoreCustomercApi({ times, store_id }).then((res) => {
      console.log(res.data);
      setData1(res.data.data.data);
    });
  };
  const onClose = () => {
    setOpen(false);
  };
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    StoreCustomercApi({ store_id,page,limit }).then((res) => {
      console.log(res.data.data);
      console.log(res.data.data.count);
      setCount(res.data.data.count);
      setPaginationPramas((preState) => ({
        ...preState,
        total: res.data.data.count,
      }));
      setData(res.data.data.data);
    });
  };
  const onFinish = (values) => {
    console.log(values, dateStringdata);
    let phone = values.phone;
    let times = dateStringdata;
    StoreCustomercApi({ phone, times, store_id }).then((res) => {
      console.log(res.data.data);
      setData(res.data.data.data);
    });
  };
  return (
    <div>
      <div  className={styles.root} style={{ marginBottom: "20px" }}>
        <Card>
          <Form name="horizontal_login" layout="inline" onFinish={onFinish}>
            <Form.Item name="phone">
              <Input placeholder="会员手机号" />
            </Form.Item>

            <Form.Item>
              <DatePicker
                onChange={onChange}
                placeholder="创建时间"
                picker="month"
              />
            </Form.Item>
            <Form.Item shouldUpdate>
              <Button type="primary" danger htmlType="submit">
                查找
              </Button>{" "}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={showDrawer}>
                点击查看本月新增会员
              </Button>

              <Drawer
                title=<h3>{yearmoent}新增会员列表</h3>
                placement="right"
                onClose={onClose}
                size={"large"}
                open={open}
              >
                <Table rowKey="key" dataSource={data1}>
                  <Column
                    dataIndex=<Image width={60} src="avater" />
                    key="phone"
                    title="头像"
                  ></Column>
                  <Column dataIndex="phone" key="phone" title="手机号"></Column>
                  <Column dataIndex="name" key="name" title="会员名称"></Column>
                  <Column
                    dataIndex="current_minute"
                    key="current_minute"
                    title="当前分钟数"
                  ></Column>
                  <Column
                    dataIndex="total_consume_money"
                    key="total_consume_money"
                    title="累计消费金额"
                  ></Column>
                  <Column
                    dataIndex="total_minute"
                    key="total_minute"
                    title="累计充值分钟数"
                  ></Column>
                  <Column
                    title="操作"
                    render={(_, rocord) => (
                      <Link to={`/Minup/${rocord.id}`}>
                        <Button
                          type="primary"
                          onClick={() => {
                            console.log(rocord.id);
                          }}
                        >
                          充值分钟
                        </Button>
                      </Link>
                    )}
                  ></Column>
                </Table>
              </Drawer>
            </Form.Item>
            <Form.Item>
              <span>会员数量{count}</span>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Card>
        <Table rowKey="key" dataSource={data}
          scroll={{ x:1200 }}
                  pagination={{  hideOnSinglePage: false,
                    showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,current:paginationPramas.page,onChange:(page,pageSize)=>{
                    handlePageChange(page,pageSize)
                  }}}>
          <Column
            dataIndex="avater"
            render={(_, rocord) => (
              <Image width={60} height={60} src={rocord.avatar}  alt="头像" />
            )}
            // dataIndex=<Image width={200} src="avater" />
            key="phone"
            title="头像"
          ></Column>
          <Column dataIndex="phone" key="phone" title="手机号"></Column>
          <Column dataIndex="name" key="name" title="会员名称"></Column>
          <Column
            dataIndex="current_minute"
            key="current_minute"
            title="当前分钟数"
          ></Column>
          {/* <Column
            dataIndex="total_consume_money"
            key="total_consume_money"
            title="累计消费金额"
          ></Column>
          <Column
            dataIndex="total_minute"
            key="total_minute"
            title="累计充值分钟数"
          ></Column> */}

          <Column
            title="操作"
            render={(_, rocord) => (
              // <Link to="/Minup">
              //   <Button type="primary" onClick={handleClick}>
              //     充值分钟
              //   </Button>
              // </Link>
              <Link to={`/Minup/${rocord.id}`}>
                <Button
                  type="primary"
                  onClick={() => {
                    console.log(rocord.id);
                  }}
                >
                  充值分钟
                </Button>
              </Link>
            )}
          ></Column>
        </Table>
      </Card>
    </div>
  );
}
