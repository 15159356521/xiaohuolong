import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Form,
  Input,
  DatePicker,
  Card,
  Tabs,
  Badge,
  Tag,
  Image,
  message,
  Select,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  StorelistApi,
  StorelistshopbrachApi,
  StoreegroupselstoreApi,
} from "../../../utils/api";

const { Option } = Select;
export default function Storelist() {
  const [selarr, setSelarr] = useState([]);
  const [dateStringdata, setDateStringdata] = useState("");
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [data1, setData1] = useState();
  const [status, setStatus] = useState();
  const [length, setLength] = useState({
    key4: "",
    key5: "",
  });
  const columns = [
    {
      dataIndex: "shop_name",
      key: "shop_name",
      title: "店家名称",
    },
    {
      dataIndex: "real_name",
      key: "real_name",
      title: "店主姓名",
    },

    {
      title: "待提现收益",
      dataIndex: "money",
      key: "money",
    },
    {
      title: "签约文件",
      dataIndex: "sign_file_url",
      key: "sign_file_url",
      render: (_, recode) => (
        <Image width={60} height={60} src={recode.sign_file_url} />
        // <a href={recode.sign_file_url} >{recode.sign_file_url}</a>
      ),
    },
    {
      title: "审核时间",
      dataIndex: "audit_time",
      key: "audit_time",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",

      render: (_, recode) => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {recode.status}
        </Tag>
      ),
    },
    {
      title: "申请时间",
      dataIndex: "created_at",
      key: "created_at",
    },

    {
      title: "操作",
      render: (_, record) => (
        <Link to={`/detail/${record.id}`}>
          <Button
            type="primary"
            onClick={() => {
              console.log(record.id);
            }}
          >
            查看详情
          </Button>
        </Link>
      ),
    },
  ];

  const columnslist = [
    {
      dataIndex: "shop_name",
      key: "shop_name",
      title: "店家名称",
    },
    {
      dataIndex: "real_name",
      key: "real_name",
      title: "店主姓名",
    },

    {
      title: "待提现收益",
      dataIndex: "money",
      key: "money",
    },
    {
      title: "签约文件",
      dataIndex: "sign_file_url",
      key: "sign_file_url",
      render: (_, recode) => (
        <Image width={60} height={60} src={recode.sign_file_url} />
        // <a href={recode.sign_file_url} >{recode.sign_file_url}</a>
      ),
    },
    {
      title: "审核时间",
      dataIndex: "audit_time",
      key: "audit_time",
    },
    {
      title: "分组",
      dataIndex: "default",
      key: "default",
      render: (_, recode) => (
        <Select
          value={recode.default}
          style={{
            width: 120,
          }}
          // onChange={handleChange}
          onSelect={(_, v) => {
            console.log(v);
            StoreegroupselstoreApi({ id: recode.id, title: v.value }).then(
              (res) => {
                console.log(res);
                if (res.data.code === 1) {
                  message.success(res.data.msg);
                  StorelistApi().then((res) => {
                    setData(res.data.data);
                  });
                } else {
                  message.error(res.data.msg);
                }
              }
            );
          }}
        >
          {recode.title.map((item, index) => (
            <Option key={item} value={item}>
              <Tag color="#108ee9">{item}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",

      render: (_, recode) => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {recode.status}
        </Tag>
      ),
    },
    {
      title: "申请时间",
      dataIndex: "created_at",
      key: "created_at",
    },

    {
      title: "操作",
      render: (_, record) => (
        <Link to={`/detail/${record.id}`}>
          <Button
            type="primary"
            onClick={() => {
              console.log(record.id);
            }}
          >
            查看详情
          </Button>
        </Link>
      ),
    },
  ];

  const onChange = (_, dateString) => {
    console.log(dateString);
    setDateStringdata(dateString);
  };

  const onFinish = (values) => {
    let time = dateStringdata;
    let storename = values.storename;
    StorelistApi({ time, storename }).then((res) => {
      console.log(res);
      setData(res.data.data);
    });
  };

  useEffect(() => {
    StorelistApi().then((res) => {
      console.log(res.data.data[0].title);
      setSelarr(res.data.data[0].title);
      setData(res.data.data);
    });
  }, []);

  useEffect(() => {
    StorelistshopbrachApi({ status }).then((res) => {
      setData1(res.data.data.data);
      console.log("------------------------", res.data.data.count);
      let arr = res.data.data.count;
      setLength((preState) => ({
        ...preState,
        key4: arr["4"],
        key5: arr["5"],
      }));
    });
  }, [status]);

  const paginationProps = {
    hideOnSinglePage: false,
    // onChange: (page, pageSize) => {
    //   console.log(page, pageSize);
    // },
  };

  const handleClickTab = (e) => {
    // console.log(e);
    setStatus(e);
  };
  const handleChangesel = (value) => {
    StorelistApi({ title: value }).then((res) => {
      console.log(res.data.data);
      setData(res.data.data);
    });
  };
  return (
    <>
      <Card>
        <Form
          form={form}
          name="horizontal_login"
          layout="inline"
          onFinish={onFinish}
          style={{ marginBottom: "20px" }}
        >
          <Form.Item name="storename">
            <Input placeholder="请输入店名" />
          </Form.Item>
          <Form.Item>
            <DatePicker onChange={onChange} placeholder="申请时间" />
          </Form.Item>
          <Form.Item shouldUpdate>
            <Button type="primary" htmlType="submit">
              查询
            </Button>{" "}
          </Form.Item>
          <Form.Item label="搜索分组">
            {" "}
            <Select
              // defaultValue="未分组"
              style={{ width: 120 }}
              onChange={handleChangesel}
            >
              {selarr.map((item, index) => (
                <Option value={item} key={item}>
                  <Tag color="#108ee9">{item}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Card>
      <Tabs
      
        defaultActiveKey="1"
        onChange={handleClickTab}
        items={[
          {
            label: <Badge offset={[8, -6]}>所有店家列表</Badge>,
            key: "",
            children: (
              <Table
              scroll={{ x:1200 }}
                dataSource={data}
                pagination={paginationProps}
                columns={columnslist}
              ></Table>
            ),
          },
          {
            label: (
              <Badge count={length.key4} offset={[8, -6]}>
                已通过未投放
              </Badge>
            ),
            key: "4",
            children: (
              <Table
              scroll={{ x:1200 }}
                dataSource={data1}
                pagination={paginationProps}
                columns={columns}
              ></Table>
            ),
          },
          {
            label: (
              <Badge count={length.key5} offset={[8, -6]}>
                已通过已投放
              </Badge>
            ),
            key: "5",
            children: (
              <Table
              scroll={{ x:1200 }}
                dataSource={data1}
                pagination={paginationProps}
                columns={columns}
              ></Table>
            ),
          },
        ]}
      />
    </>
  );
}
