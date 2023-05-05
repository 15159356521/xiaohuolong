import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Form,
  Input,
  DatePicker,
  Card,
  Badge,
  Tabs,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import {
  SyncOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { StorelistApi, StorelistshopbrachApi } from "../../../utils/api";
const { Column } = Table;

export default function Storelist() {
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
      title: "申请时间",
      dataIndex: "created_at",
      key: "created_at",
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
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          {recode.status}
        </Tag>
      ),
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
  const columnsshe = [
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
      title: "申请时间",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_, recode) => (
        <Tag icon={<SyncOutlined spin />} color="processing">
          {recode.status}
        </Tag>
      ),
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
  const columnswtg = [
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
      title: "申请时间",
      dataIndex: "created_at",
      key: "created_at",
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
        <Tag icon={<CloseCircleOutlined />} color="error">
          {recode.status}
        </Tag>
      ),
    },
    {
      title: "失败原因",
      dataIndex: "remark",
      key: "remark",
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
  const [dateStringdata, setDateStringdata] = useState("");
  const onFinish = (values) => {
    let time = dateStringdata;
    let storename = values.storename;
    StorelistshopbrachApi({ time, storename, status }).then((res) => {
      console.log(res);
      setData(res.data.data.data);
    });
  };

  const onChange = (_, dateString) => {
    console.log(dateString);
    setDateStringdata(dateString);
  };
  const [status, setStatus] = useState("1");

  const handleClickTab = (e) => {
    // console.log(e);
    setStatus(e);
  };

  const [data, setData] = useState([]);
  const [length, setLength] = useState({
    key1: "",
    key2: "",
    key3: "",
    key4: "",
    key6: "",
    key5: "",
    key7: "",
    key8: "",
  });

  // const [length, setLength] = useState();
  useEffect(() => {
    StorelistshopbrachApi({ status }).then((res) => {
      // console.log(res.data.data);
      console.log(res.data.data.count);
      // console.log(res.data.data.count);
      let arr = res.data.data.count;

      setLength((preState) => ({
        ...preState,
        key1: arr["1"],
        key2: arr["2"],
        key3: arr["3"],
        key4: arr["4"],
        key5: arr["5"],
        key6: arr["6"],
        key7: arr["7"],
      }));
      setData(res.data.data.data);
    });
  }, [status]);

  const paginationProps = {
    hideOnSinglePage: true,
  };

  return (
    <>
      <Card>
        <Form
          name="horizontal_login"
          layout="inline"
          onFinish={onFinish}
          style={{ marginBottom: "20px" }}
        >
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
      <Card>
        <Tabs
          // defaultActiveKey="1"
          // onChange={onChangeKey}
          onTabClick={handleClickTab}
          items={[
            {
              label: (
                <Badge count={length.key1} offset={[8, -6]}>
                  待审核
                </Badge>
              ),
              key: "1",
              children: (
                <Table
                  dataSource={data}
                  pagination={paginationProps}
                  columns={columnsshe}
                  scroll={{ x:1200 }}

                ></Table>
              ),
            },

            {
              label: (
                <Badge count={length.key2} offset={[8, -6]}>
                  待签约
                </Badge>
              ),
              key: "2",
              children: (
                <Table
                  dataSource={data}
                  pagination={paginationProps}
                  columns={columns}
                  scroll={{ x:1200 }}
                ></Table>
              ),
            },

            {
              label: (
                <Badge count={length.key3} offset={[8, -6]}>
                  待培训
                </Badge>
              ),
              key: "3",
              children: (
                <Table
                  dataSource={data}
                  pagination={paginationProps}
                  columns={columns}
                  scroll={{ x:1200 }}
                ></Table>
              ),
            },
            {
              label: (
                <Badge count={length.key6} offset={[8, -6]}>
                  未通过
                </Badge>
              ),
              key: "6",
              children: (
                <Table
                  dataSource={data}
                  pagination={paginationProps}
                  columns={columnswtg}
                  scroll={{ x:1200 }}
                ></Table>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
