import React, { useState, useEffect } from "react";
import {
  Switch,
  Card,
  Breadcrumb,
  Button,
  Table,
  Space,
  Modal,
  Form,
  message,
  Input,
  Tag,
  Image,
  Upload,
  Select,
} from "antd";
import styles from "./index.module.scss";
import { getAllList, getUp, PostUp, PostSend } from "@/api/Order";
import moment from "moment";
import { useRef } from "react";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import routerContant from "@/utils/constant";
import { baseIMgURL } from "@/utils/request";

const { Column } = Table;
export default function Index() {
  // const { state: {id} } = useLocation()
  const [upLogin, setUpLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState();
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const [send] = Form.useForm();
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({
      page: page,
      limit: limit,
      status: 0,
      ...search,
    }).then((res) => {
      console.log(res.data);
      if (res.data.code == 200) {
        setTableData(res.data.data.data);
        setPaginationPramas((preState) => ({
          ...preState,
          total: res.data.data.count,
        }));
      }
    });
    return true;
  };
  const [formRef] = Form.useForm();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    img: "",
    id: "",
    url: "",
    ptype: "",
    source: "",
  });

  const getAllRoleGroupData = async () => {
    setLoading(true);
    const { data:{data} } = await getAllList({ status: 0 });
    console.log(data,"use");
    setTableData(data.data);
    setPaginationPramas((preState) => ({ ...preState, total: data.count }));
    setLoading(false);
  };
  useEffect(() => {
    (async function () {
      getAllRoleGroupData();
    })();
  }, []);
  //  搜索管理员区
  const [form] = Form.useForm();
  const [sales] = Form.useForm();
  const onFinish = async (value) => {
    console.log(value, "sdfsf");
    for (let key in value) {
      if (value[key] == undefined) {
        value[key] = "";
      }
    }

    setSearch(value);
    const up = { ...value, page: 1, limit: 10, status: 0 };
    // console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value);
    const { data } = await getAllList(up);
    // console.log(data);
    if (data.code === 200) {
      message.success("查询成功");
      console.log(data.data.data,"wwwwww");
      setTableData(data.data.data);
      setPaginationPramas((preState) => ({
        ...preState,
        total: data.data.count,
      }));
    } else {
      message.warning(data.msg);
      return;
    }
  };
  const onReset = async () => {
    form.resetFields();
    setPaginationPramas((preState) => ({ ...preState, page: 1, limit: 10 }));
    const { data } = await getAllList({ status: 0 });
    console.log(data);
    if (data.code === 200) {
      message.success("重置成功");
      
      setTableData(data.data.data);
      setPaginationPramas((preState) => ({
        ...preState,
        total: data.data.count,
      }));
    } else {
      message.warning(data.msg);
      return;
    }
  };
  // 表格区
  // 修改、添加
  const [fileList, setFileList] = useState([]);
  const handleOk = async () => {
    // let files = formRef.current.getFieldValue();
    // console.log(formData);
    // setUpLogin(true);
    try {
      const fileds = await formRef.validateFields();
      console.log("🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds", fileds);
      fileds.id = formData.id;
      const {
        data: { code },
      } = await PostUp({
        ...fileds,
      });
      if (code == 200) {
        message.success("修改成功");
        setIsOpenModal(false);
        getAllRoleGroupData();
      } else {
        message.warning("修改失败");
      }

      // .then((res) => {
      //   // console.log(res, "修改");
      //   setUpLogin(false);
      //   if (res.data.code === 200) {
      //     getAllRoleGroupData();
      //     setIsOpenModal(false);
      //     message.success(res.data.msg);
      //     setFormData({
      //       title: "",
      //       content: "",
      //       img: "",
      //       id: "",
      //       url: "",
      //       source: "",
      //     });
      //   } else {
      //     setIsOpenModal(false);
      //     message.warning(res.data.msg);
      //   }
      // });
    } catch (err) {
      console.log(err);
    }

    setUpLogin(false);
  };
  const shipmentOk = async () => {
    try {
      const fileds = await send.validateFields();
      console.log("🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds", fileds);
      // const { data } = await PostAdd({
      //   ...fileds,
      //   url: formData.url,
      //   img: formData.img,
      //   group_id: formData.group_id,
      // });
      // setUpLogin(false);
      // if (data.code === 400) {
      //   message.warning("新增失败");
      //   return;
      // } else {
      //   message.success(data.msg);
      //   getAllRoleGroupData();
      //   setIsOpenModal(false);
      // }
    } catch {
      setUpLogin(false);
    }
  };
  const salesOk = async () => {
    try {
      setUpLogin(true);
      const fileds = await sales.validateFields();
      console.log(fileds, "售后");
    } catch {
      setUpLogin(false);
    }
  };
  // 编辑操作
  const handlerEidt = async (record) => {
    const {
      data: { data },
    } = await getUp(record.id);
    console.log(data, "编辑");
    setFormData(data[0]);
    formRef.setFieldsValue({ ...data[0] });
    setIsOpenModal(true);
  };
  // 显示图片
  // 取消预览
  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
    setUpLogin(false);
  };
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>待发货订单</Breadcrumb.Item>
        </Breadcrumb>
        {routerContant("/mall/index/a/order.Orderc/b/selgoods") ? (
          <Card>
            <Form layout="inline" onFinish={onFinish} form={form}>
              <Form.Item label="收货人电话" name="user_phone">
                <Input
                  placeholder="请输入下单的联系人电话"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    搜索
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={onReset}
                    icon={<ReloadOutlined />}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        ) : null}


        <Card>
          <Table
            scroll={{ x: 750 }}
            pagination={{
              hideOnSinglePage: false,
              showSizeChanger: true,
              total: paginationPramas.total,
              pageSize: paginationPramas.limit,
              current: paginationPramas.page,
              onChange: (page, pageSize) => {
                handlePageChange(page, pageSize);
              },
            }}
            rowKey="id"
            dataSource={tableData}
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            <Column align="center" title="订单号" dataIndex="order_id" />

            <Column align="center" title="收货人" dataIndex="real_name" />
            {/* <Column
              align="center"
              title="订单状态"
              dataIndex="status"
              key="status"
              render={(_, record) => (
                <>
                  {record.status === 1 ?<Tag color="#108ee9">正常</Tag>  :
                  <Tag color="red">异常</Tag>}
                </>
              )}
            />
                              <Column
              align="center"
              title="售后状态"
              dataIndex="status"
              key="status"
              render={(_, record) => (
                <>
                  {record.status === 1 ?<Tag color="#108ee9">正常</Tag>  :
                  <Tag color="red">异常</Tag>}
                </>
              )}
            /> */}

            <Column align="center" title="收货电话" dataIndex="user_phone" />
            <Column align="center" title="收货地址" dataIndex="user_address" />
            <Column
              align="center"
              title="下单时间"
              dataIndex="pay_time"
              render={(text, record) => (
                <>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</>
              )}
            />
            {/* <Column
              align="center"
              title="备注"
              dataIndex="mark"
            /> */}
            <Column
              align="center"
              title="操作"
              key="operation"
           
             
              render={(_, record) => (
                <Form layout="horizontal" wrapperCol={14} labelCol={2}>
                  <Form.Item>
                    {routerContant("/mall/index/a/order.Orderc/b/delivergoods") ? (
                      <Button
                        type="link"
                        onClick={() => window.open(`#/order.add/${record.order_id}`)}
                      >
                        发货
                      </Button>
                    ) : null}
                    {routerContant("/mall/index/a/order.Orderc/b/update") ? (
                      <Button
                        type="link"
                        key="edit"
                        onClick={() => handlerEidt(record)}
                      >
                        修改
                      </Button>
                    ) : null}
                    {routerContant("/tdb/index/a/tdb.Health/b/edit") ? (
                      <Button
                        type="link"
                        key="edit"
                        onClick={() =>
                          window.open(`#/order.sales/${record.order_id}`)
                        }
                      >
                        售后
                      </Button>
                    ) : null}
                  </Form.Item>
                </Form>
              )}
            />
          </Table>
        </Card>
        {isOpenModal ? (
          <Modal
            width={1200}
            title={"修改"}
            open={isOpenModal}
            destroyOnClose
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                取消
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={upLogin}
                onClick={handleOk}
              >
                确定
              </Button>,
            ]}
          >
            <Form
              form={formRef}
              preserve={false}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                ...formData,
              }}
              autoComplete="off"
            >
              <Form.Item
                label="收货人"
                name="real_name"
                rules={[{ required: true, message: "请输入收货人" }]}
              >
                <Input placeholder="请输入收货人" />
              </Form.Item>
              <Form.Item
                label="收货电话"
                name="user_phone"
                rules={[
                  {
                    required: true,
                    message: "请输入收货人联系方式",
                    pattern: /^1[3456789]\d{9}$/,
                    message: "请输入正确的手机号码",
                  },
                ]}
              >
                <Input placeholder="请输入收货人联系方式" />
              </Form.Item>
              <Form.Item
                label="收货人地址"
                name="user_address"
                rules={[{ required: true, message: "请输入收货人地址" }]}
              >
                <Input placeholder="请输入收货人地址" />
              </Form.Item>
              {/* <Form.Item
                label="备注"
                name="mark"                
              >
                <Input
                  placeholder="请输入备注"
                />
              </Form.Item> */}
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
