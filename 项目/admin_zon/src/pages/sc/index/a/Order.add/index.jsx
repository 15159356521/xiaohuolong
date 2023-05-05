import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Switch,
  Card,
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
  Checkbox,
  Row,
  Col,
  Breadcrumb,
} from "antd";
import styles from "./index.module.scss";
import { CloudUploadOutlined, ReloadOutlined } from "@ant-design/icons";
import City from "@/components/City";
import { getShop, PostSend } from "@/api/Order";
export default function Index() {
  //   收货信息
  const Shop_id = useParams().id;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [formOptions, setFormOptions] = useState([]);
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  useEffect(  () => {
    getAll();
  }, []);
  const getAll = async () => {
    const {
      data: { data },
    } = await getShop(Shop_id);
    console.log(data, "data");
    setTableData(data.data);
    setDelivery(data.deliver);
  };
  // 快递信息
  const [keyForm] = Form.useForm();
  const [keyFormData, setKeyFormData] = useState({});
  const [keyLoading, setKeyLoading] = useState(false);
  const [delivery, setDelivery] = useState([]);
  //   收货数据修改
  const handleOk = async () => {
    const fileds = await form.validateFields();
    console.log("🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds", fileds);
    try {
      if (formData.id) {
        //     PostUp(formData.id, {
        //       ...formData,
        //       name: fileds.name,
        //     }).then((res) => {
        //       // console.log(res, "修改");
        //       setUpLogin(false);
        //       if (res.data.code === 200) {
        //         getAllRoleGroupData();
        //         setIsOpenModal(false);
        //         message.success(res.data.msg);
        //         setFormData({
        //         });
        //       } else {
        //         setIsOpenModal(false);
        //         message.warning(res.data.msg);
        //       }
        //     });
        //   } else {
        //     const fileds = await formRef.current.validateFields();
        //     console.log(
        //       "🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds",
        //       fileds,
        //       formData
        //     );
        //     const { data } = await PostAdd({
        //       ...fileds,
        //       url: formData.url,
        //       img: formData.img,
        //       group_id: formData.group_id,
        //     });
        //     setUpLogin(false);
        //     if (data.code === 400) {
        //       message.warning("新增失败");
        //       return;
        //     } else {
        //       message.success(data.msg);
        //       getAllRoleGroupData();
        //       setIsOpenModal(false);
        //     }
      }
    } catch {}
    setLoading(false);
  };
  const handleCancel = () => {
    setIsOpenModal(false);
    setLoading(false);
  };
  const receiving = [
    { title: "订单商品", dataIndex: "goods_name", align: "center" },

    { title: "商品数量", dataIndex: "total_num", align: "center" },
    { title: "商品单价", dataIndex: "pay_price", align: "center" },
    { title: "支付金额", dataIndex: "pay_price", align: "center" },

    { title: "备注", dataIndex: "mark", align: "center" },
    {
      title: "商品状态",
      dataIndex: "status",
      align: "center",
      render: (text, record) => (
        <>
          {text === 0 ? (
            <Tag color="green">待发货</Tag>
          ) : text === 1 ? (
            <Tag color="orange">待收货</Tag>
          ) : text === 2 ? (
            <Tag color="cyan">已收货</Tag>
          ) : text === 3 ? (
            <Tag color="purple">待评价</Tag>
          ) : text === 4 ? (
            <Tag color="geekblue">已完成</Tag>
          ) : text === 5 ? (
            <Tag color="red">退款中</Tag>
          ) : text === 6 ? (
            <Tag color="magenta">退款成功</Tag>
          ) : text === 7 ? (
            <Tag color="gold">换货中</Tag>
          ) : text === 8 ? (
            <Tag color="lime">换货成功</Tag>
          ) : text === 9 ? (
            <Tag color="#f50">退货中</Tag>
          ) : (
            <Tag color="#2db7f5">退货成功</Tag>
          )}
        </>
      ),
    },
  ];
  const handlerEidt = async (record) => {
    // const { data } = await getUp(record.id);
    // setFormData(data.data);
    setIsOpenModal(true);
  };
  //   快递信息
  const onFinish = async (values) => {
    values.id = tableData[0].order_id;
    values.order_goods_id = formOptions;
    const {
      data: { code },
    } = await PostSend(values);
    if (code === 200) {
      message.success("发货成功");
      keyForm.resetFields();
      getAll();
    }
  };
  const upFinish = async (values) => {
    console.log("Success:", values);
    // setKeyLoading(true);
  };
  const onReset = async () => {
    keyForm.resetFields();
  };
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>订单数据</Breadcrumb.Item>
        </Breadcrumb>
      </Card>
      <Card>
        <Table
          columns={receiving}
          scroll={{ x: 1200 }}
          pagination={{ hideOnSinglePage: true, showSizeChanger: true }}
          dataSource={tableData}
        ></Table>
      </Card>
      {/* {isOpenModal ? (
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
              loading={loading}
              onClick={handleOk}
            >
              确定
            </Button>,
          ]}
        >
          <Form
            form={form}
            preserve={false}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              ...formData,
            }}
            onFinish={upFinish}
            autoComplete="off"
          >
            <Form.Item
              label="收货人"
              name="receipt_people"
              rules={[{ required: true, message: "请输入收货人" }]}
            >
              <Input placeholder="请输入收货人" />
            </Form.Item>
            <Form.Item
              label="收货电话"
              name="receipt_phone"
              rules={[
                {
                  required: true,
                  message: "请输入收货人联系方式",
                  pattern: /^1[3456789]\d{9}$/,
                },
              ]}
            >
              <Input placeholder="请输入收货人联系方式" />
            </Form.Item>
            <City />
            <Form.Item
              label="收货人地址"
              name="address"
              rules={[{ required: true, message: "请输入收货人地址" }]}
            >
              <Input placeholder="请输入收货人地址" />
            </Form.Item>
            <Form.Item label="备注" name="remark">
              <Input placeholder="请输入备注" />
            </Form.Item>
          </Form>
        </Modal>
      ) : null} */}
      <Card>
        <Form
          form={keyForm}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            ...keyFormData,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="发货商品"
            name="goods_sku_id"
            // rules={[{ required: true, message: "请输入发货商品" }]}
          >
            <Checkbox.Group>
              <Row>
                {tableData.map((item) => {
                  return (
                    <Col flex={1}>
                      <Checkbox
                        value={item.goods_sku_id}
                        style={{
                          lineHeight: "32px",
                        }}
                        onChange={(e) => {
                          formOptions.push(item.order_goods_id);
                          setFormOptions(formOptions);
                        }}
                      >
                        {item.goods_name}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>

            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            label="快递公司"
            name="source"
            rules={[{ required: true, message: "请输入快递公司" }]}
          >
            <Select placeholder="请输入快递公司" showArrow allowClear>
              {delivery.map((item, index) => (
                <Select.Option value={item.name} key={item.name}>
                  {item.name}
                </Select.Option>
                // console.log(item, "item")
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="快递单号"
            name="source_id"
            rules={[{ required: true, message: "请输入快递单号" }]}
          >
            <Input placeholder="请输入快递单号" />
          </Form.Item>
          <Form.Item
            label="快递类型"
            name="delivery_type"
            defaultValue="陆运"
            rules={[{ required: true, message: "请输入快递类型" }]}
          >
            <Select placeholder="请选择快递类型">
              <Select.Option value="空运">空运</Select.Option>
              <Select.Option value="陆运">陆运</Select.Option>
              <Select.Option value="海运">海运</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CloudUploadOutlined />}
              >
                提交
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
    </div>
  );
}
