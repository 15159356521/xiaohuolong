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
  Tree,
} from "antd";
import {
  PostAdd,
  getDel,
  getAllList,
  getAdd,
  getUp,
  PostUp,
} from "@/api/Thcearningsratio";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { useRef } from "react";
import routerContant from "@/utils/constant";

const { Column } = Table;

export default function Index() {
  // const { state: {id} } = useLocation()
  //   console.log(routerContant[location.pathname]);
  // const id = routerContant[location.pathname]
  const [upLogin, setUpLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [paginationPramas, setPaginationPramas] = useState({
    page: 1,
    limit: 10,
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
    // hideOnSinglePage: false,
    // showSizeChanger: true,
  });
  const [search, setSearch] = useState({ name: "" });
  const [form] = Form.useForm();
  const keyForm = useRef(null);

  const handlePageChange = (page, limit) => {
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({ page: page, limit: limit, ...search }).then((res) => {
      if (res.data.code == 200) {
        setTableData(res.data.data);
        setPaginationPramas((preState) => ({
          ...preState,
          total: res.data.count,
        }));
      }
      console.log(res.data.data);
    });
  };
  const [formData, setFormData] = useState({
    business_rate: 0,
    business_rate_three: 0,
    business_rate_two: 0,
    minute: 0,
    minute_three: 0,
    minute_two: 0,
    platform_rate: 0,
    platform_rate_three: 0,
    platform_rate_two: 0,
    price: 0,
    price_three: 0,
    price_two: 0,
    shop_rate: 0,
    shop_rate_three: 0,
    shop_rate_two: 0,
    title: "",
  });
  const getNewListData = async () => {
    setLoading(true);
    const { data } = await getAllList();
    setTableData(data.data);
    setPaginationPramas((preState) => ({ ...preState, total: data.count }));

    setLoading(false);
  };
  useEffect(() => {
    (async function () {
      getNewListData();
    })();
  }, []);
  // 搜索
  const onFinish = async (value) => {
    console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value);
    setSearch(value);
    const { data } = await getAllList({ ...value, ...paginationPramas });
    console.log(data);
    if (data.code === 200) {
      message.success("查询成功");
      setTableData(data.data);
      setPaginationPramas((preState) => ({
        ...preState,
        total: data.data.total,
      }));
    } else {
      message.warning(data.msg);
      return;
    }
  };
  const onReset = async () => {
    form.resetFields();
    setPaginationPramas((preState) => ({ ...preState, page: 1, limit: 10 }));
    setSearch({});
    const { data } = await getAllList();
    console.log(data);
    if (data.code === 200) {
      message.success("重置成功");
      setTableData(data.data);
      setPaginationPramas((preState) => ({
        ...preState,
        total: data.data.total,
      }));
      form.resetFields();
    } else {
      message.warning(data.msg);
      return;
    }
  };
  // 修改、添加
  const handleOk = async () => {
    try{

setUpLogin(true);
    if (formData.id) {
      // const fileds =  formRef.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",

        formData
      );
      const { data } = await PostUp(formData.id, {
        ...formData,
      });
      setUpLogin(false);
      if (data.code === 200) {
        getNewListData();
        setIsOpenModal(false);
        message.success(data.msg);
      } else {
        setIsOpenModal(false);
        message.warning(data.msg);
      }
    } else {
      // const fileds = await keyForm.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds",
        // fileds,
        formData
      );
      // 校验keyForm里的title

      console.log(keyForm);
      // keyForm.messageVariables("title")
      await keyForm.current.validateFields();

      const { data } = await PostAdd({
        ...formData,
      });
      setUpLogin(false);
      if (data.code === 400) {
        message.warning(data.msg);
        return;
      } else {
        message.success(data.msg);
        getNewListData();
        setIsOpenModal(false);
      }
    }


    }catch{
      setUpLogin(false);
    }
    
  };

  // 删除
  const handlerOk = async (id) => {
    try {
      await getDel(id);
      await getNewListData();
      message.success("删除成功");
    } catch (e) {
      message.warning("删除失败");
    }
  };

  const handlerDel = (record) => {
    Modal.confirm({
      title: `确定删除${record.title}吗?`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: () => handlerOk(record.id),
    });
  };

  // 点击添加按钮显示弹窗
  const handlerAdd = async () => {
    setIsOpenModal(true);
    setFormData({
      business_rate: 0,
      business_rate_three: 0,
      business_rate_two: 0,
      minute: 0,
      minute_three: 0,
      minute_two: 0,
      platform_rate: 0,
      platform_rate_three: 0,
      platform_rate_two: 0,
      price: 0,
      price_three: 0,
      price_two: 0,
      shop_rate: 0,
      shop_rate_three: 0,
      shop_rate_two: 0,
      title: "",
    });
    const { data } = await getAdd();
    console.log(data.data.field[1].props.data, 6545);
  };

  // 编辑操作
  const handlerEidt = async (record) => {
    try {
      const obj = { ...formData };
      const reqdata = await getUp(record.id).then((res) => {
        return res.data.data.field;
      });
      console.log(reqdata, 123);
      for (let a in reqdata) {
        // console.log(reqdata[a]);

        obj.id = record.id;

        let key = reqdata[a].field;
        obj[key] = reqdata[a].value;
      }
      console.log(obj, "obj");
      setFormData(obj);
    } catch (error) {
      message.warning(error);
    }

    setIsOpenModal(true);
  }; // 弹窗取消逻辑
  const handleCancel = () => {
    setUpLogin(false);
    setIsOpenModal(false);
    setFormData({
      business_rate: "",
      business_rate_three: "",
      business_rate_two: "",
      minute: "",
      minute_three: "",
      minute_two: "",
      platform_rate: "",
      platform_rate_three: "",
      platform_rate_two: "",
      price: "",
      price_three: "",
      price_two: "",
      shop_rate: "",
      shop_rate_three: "",
      shop_rate_two: "",
      title: "",
    });
  };

  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>套餐列表</Breadcrumb.Item>
        </Breadcrumb>

        {routerContant("/tdb/index/a/tdb.Thcearningsratio/b/index") ? (
          <Card>
            <Form layout="inline" onFinish={onFinish} form={form}>
              <Form.Item label="账号" name="title">
                <Input
                  placeholder="请输入搜索套餐名称"
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
        {routerContant("/tdb/index/a/tdb.Thcearningsratio/b/add") ? (
          <Button type="primary" onClick={() => handlerAdd()}>
            添加
          </Button>
        ) : null}
        <Table
          scroll={{ x: 1400 }}
          // pagination={paginationPramas}
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
          {/* <Column
            align="center"
            title="套餐id"
            dataIndex="id"
            key="id"
            fixed="left"
          /> */}
          <Column
            align="center"
            title="套餐名称"
            dataIndex="title"
           
          />

          <Column align="center" title="价格1" dataIndex="price" />
          <Column align="center" title="时间1" dataIndex="minute" />
          <Column align="center" title="平台收益1" dataIndex="platform_rate" />
          <Column
            align="center"
            title="服务商收益1"
            dataIndex="business_rate"
          />
          <Column align="center" title="店家收益1" dataIndex="shop_rate" />
          <Column align="center" title="价格2" dataIndex="price_two" />
          <Column align="center" title="时间2" dataIndex="minute_two" />
          <Column
            align="center"
            title="平台收益2"
            dataIndex="platform_rate_two"
          />
          <Column
            align="center"
            title="服务商收益2"
            dataIndex="business_rate_two"
          />
          <Column align="center" title="店家收益2" dataIndex="shop_rate_two" />
          <Column align="center" title="价格3" dataIndex="price_three" />
          <Column align="center" title="时间3" dataIndex="minute_three" />
          <Column
            align="center"
            title="平台收益3"
            dataIndex="platform_rate_three"
          />
          <Column
            align="center"
            title="服务商收益3"
            dataIndex="business_rate_three"
          />
          <Column
            align="center"
            title="店家收益3"
            dataIndex="shop_rate_three"
          />
          <Column align="center" title="创建时间" dataIndex="created_at" />
          <Column align="center" title="修改时间" dataIndex="updated_at" />
          <Column
            align="center"
            title="操作"
            key="operation"
    
            render={(_, record) => (
              <Space size="middle">
                {record.id === 1 ? (
                  <Tag color="#108ee9">系统保留</Tag>
                ) : (
                  <>
                    {routerContant(
                      "/tdb/index/a/tdb.Thcearningsratio/b/edit"
                    ) ? (
                      <Button type="link" onClick={() => handlerEidt(record)}>
                        编辑
                      </Button>
                    ) : null}
                    {routerContant(
                      "/tdb/index/a/tdb.Thcearningsratio/b/del"
                    ) ? (
                      <Button type="link" onClick={() => handlerDel(record)}>
                        删除
                      </Button>
                    ) : null}
                  </>
                )}
              </Space>
            )}
          />
        </Table>

        {isOpenModal ? (
          <Modal
            width={1200}
            title={formData.id ? "编辑" : "添加"}
            open={isOpenModal}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="确定"
            cancelText="取消"
            footer={[
              <Button onClick={handleCancel}>取消</Button>,
              <Button
                type="primary"
                disabled={formData.title == "" ? true : false}
                onClick={handleOk}
                loading={upLogin}
              >
                确定
              </Button>,
            ]}
          >
            <Form
              layout="inline"
              size="Large"
              // form={keyForm}
              ref={keyForm}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 25 }}
              autoComplete="off"
              
              initialValues={{ ...formData }}
            >
              <Form.Item>
                <Form
                  labelCol={{ span: 10 }}
                  wrapperCol={{
                    flex: 1,
                  }}
                  labelAlign="left"
                  autoComplete="off"
                  initialValues={{
                    title: formData.title,
                    price: formData.price,
                    minute: formData.minute,
                    platform_rate: formData.platform_rate,
                    business_rate: formData.business_rate,
                    shop_rate: formData.shop_rate,
                  }}
                >
                  <Form.Item
                    label="套餐名称"
                    name="title"
                   
                    rules={[{ required: true, message: "请输入套餐名称" }]}
                  >
                    <Input
                      placeholder="请输入套餐名称"
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="价格1"
                    name="price"
                    rules={[
                      {
                        required: true,
                        message: "请输入价格1",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入价格1"
                      onChange={(e) => {
                        setFormData({ ...formData, price: e.target.value });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="时间1"
                    name="minute"
                    rules={[
                      {
                        required: true,
                        message: "请输入时间1",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入时间1"
                      onChange={(e) => {
                        setFormData({ ...formData, minute: e.target.value });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="平台收益1"
                    name="platform_rate"
                    rules={[
                      {
                        required: true,
                        message: "请输入平台收益1",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入平台收益1"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          platform_rate: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="服务商收益1"
                    name="business_rate"
                    rules={[
                      {
                        required: true,
                        message: "请输入服务商收益1",
                        // 校验大于等于0的数包括小数
                        pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                     


                        
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入服务商收益1"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          business_rate: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="店家收益1"
                    name="shop_rate"
                    rules={[
                      {
                        required: true,
                        message: "请输入店家收益1",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入店家收益1"
                      onChange={(e) => {
                        setFormData({ ...formData, shop_rate: e.target.value });
                      }}
                    />
                  </Form.Item>
                </Form>
              </Form.Item>
              <Form.Item>
                <Form
                    labelCol={{ span: 10 }}
                    wrapperCol={{
                      flex: 1,
                    }}
                    labelAlign="left"
                  initialValues={{
                    price_two: formData.price_two,
                    minute_two: formData.minute_two,
                    platform_rate_two: formData.platform_rate_two,
                    business_rate_two: formData.business_rate_two,
                    shop_rate_two: formData.shop_rate_two,
                  }}
                >
                   <Form.Item
                  
                  >
                
                  </Form.Item>
                  <Form.Item
                  
                  >
                
                  </Form.Item>
                  <Form.Item
                    label="价格2"
                    name="price_two"
                    rules={[
                      {
                        required: true,
                        message: "请输入价格2",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入价格2"
                      onChange={(e) => {
                        setFormData({ ...formData, price_two: e.target.value });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="时间2"
                    name="minute_two"
                    rules={[
                      {
                        required: true,
                        message: "请输入时间2",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入时间2"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          minute_two: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="平台收益2"
                    name="platform_rate_two"
                    rules={[
                      {
                        required: true,
                        message: "请输入平台收益2",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入平台收益2"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          platform_rate_two: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="服务商收益2"
                    name="business_rate_two"
                    rules={[
                      {
                        required: true,
                        message: "请输入服务商收益2",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入服务商收益2"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          business_rate_two: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="店家收益2"
                    name="shop_rate_two"
                    rules={[
                      {
                        required: true,
                        message: "请输入店家收益2",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入店家收益2"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          shop_rate_two: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </Form>
              </Form.Item>
              <Form.Item>
                <Form
                    labelCol={{ span: 10 }}
                    wrapperCol={{
                      flex: 1,
                    }}
                    labelAlign="left"
                  initialValues={{
                    price_three: formData.price_three,
                    minute_three: formData.minute_three,
                    platform_rate_three: formData.platform_rate_three,
                    business_rate_three: formData.business_rate_three,
                    shop_rate_three: formData.shop_rate_three,
                  }}
                >
                        <Form.Item
                  
                  >
                
                  </Form.Item>
                  <Form.Item
                  
                  >
                
                  </Form.Item>
                  <Form.Item
                    label="价格3"
                    name="price_three"
                    rules={[
                      {
                        required: true,
                        message: "请输入价格3",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入价格3"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          price_three: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="时间3"
                    name="minute_three"
                    rules={[
                      {
                        required: true,
                        message: "请输入时间3",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入时间3"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          minute_three: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="平台收益3"
                    name="platform_rate_three"
                    rules={[
                      {
                        required: true,
                        message: "请输入平台收益3",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入平台收益3"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          platform_rate_three: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="服务商收益3"
                    name="business_rate_three"
                    rules={[
                      {
                        required: true,
                        message: "请输入服务商收益3",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入服务商收益3"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          business_rate_three: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="店家收益3"
                    name="shop_rate_three"
                    rules={[
                      {
                        required: true,
                        message: "请输入店家收益3",
                    pattern: new RegExp(/^[0-9]+([.]{1}[0-9]+){0,1}$/, "g"), 
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入店家收益3"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          shop_rate_three: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </Form>
              </Form.Item>
              {/* <Form.Item
                label="套餐名称"
                name="title"
                rules={[{ required: true, message: "请输入套餐名称" }]}
              >
                <Input placeholder="请输入套餐名称"
                onChange={(e)=>{
                  setFormData({...formData,title:e.target.value})
                }} />
              </Form.Item>

              <Form.Item
                label="价格1"
                name="price"
                rules={[{ required: true, message: "请输入价格1" }]}
              >
                <Input placeholder="请输入价格1"
                onChange={(e)=>{
                  setFormData({...formData,price:e.target.value})
                }} />
              </Form.Item>
              <Form.Item
                label="时间1"
                name="minute"
                rules={[{ required: true, message: "请输入时间1" }]}
              >
                <Input placeholder="请输入时间1" 
                    onChange={(e)=>{
                      setFormData({...formData,minute:e.target.value})
                    }}/>
              </Form.Item>
              <Form.Item
                label="平台收益1"
                name="platform_rate"
                rules={[{ required: true, message: "请输入平台收益1" }]}
              >
                <Input placeholder="请输入平台收益1" 
                    onChange={(e)=>{
                      setFormData({...formData,platform_rate:e.target.value})
                    }}/>
              </Form.Item>
              <Form.Item
                label="服务商收益1"
                name="business_rate"
                rules={[{ required: true, message: "请输入服务商收益1" }]}
              >
                <Input placeholder="请输入服务商收益1" 
                    onChange={(e)=>{
                      setFormData({...formData,business_rate:e.target.value})
                    }}/>
              </Form.Item>
              <Form.Item
                label="店家收益1"
                name="shop_rate"
                rules={[{ required: true, message: "请输入店家收益1" }]}
              >
                <Input placeholder="请输入店家收益1"
                    onChange={(e)=>{
                      setFormData({...formData,shop_rate:e.target.value})
                    }} />
              </Form.Item>
              <Form.Item
                label="价格2"
                name="price_two"
                rules={[{ required: true, message: "请输入价格2" }]}
              >
                <Input placeholder="请输入价格2" 
                 onChange={(e)=>{
                  setFormData({...formData,price_two:e.target.value})
                }}/>
              </Form.Item>
              <Form.Item
                label="时间2"
                name="minute_two"
                rules={[{ required: true, message: "请输入时间2" }]}
              >
                <Input placeholder="请输入时间2" 
                    onChange={(e)=>{
                      setFormData({...formData,minute_two:e.target.value})
                    }}/>
              </Form.Item>
              <Form.Item
                label="平台收益2"
                name="platform_rate_two"
                rules={[{ required: true, message: "请输入平台收益2" }]}
              >
                <Input placeholder="请输入平台收益2"
                    onChange={(e)=>{
                      setFormData({...formData,platform_rate_two:e.target.value})
                    }} />
              </Form.Item>
              <Form.Item
                label="服务商收益2"
                name="business_rate_two"
                rules={[{ required: true, message: "请输入服务商收益2" }]}
              >
                <Input placeholder="请输入服务商收益2"
                        onChange={(e)=>{
                          setFormData({...formData,business_rate_two:e.target.value})
                        }} />
              </Form.Item>
              <Form.Item
                label="店家收益2"
                name="shop_rate_two"
                rules={[{ required: true, message: "请输入店家收益2" }]}
              >
                <Input placeholder="请输入店家收益2" 
                        onChange={(e)=>{
                          setFormData({...formData,shop_rate_two:e.target.value})
                        }}/>
              </Form.Item>

              <Form.Item
                label="价格3"
                name="price_three"
                rules={[{ required: true, message: "请输入价格3" }]}
              >
                <Input placeholder="请输入价格3" onChange={(e)=>{
                          setFormData({...formData,price_three:e.target.value})
                        }}/>
              </Form.Item>
                <Form.Item  
                label="时间3"
                name="minute_three"
                rules={[{ required: true, message: "请输入时间3" }]}
                >
                <Input placeholder="请输入时间3" onChange={(e)=>{
                          setFormData({...formData,minute_three:e.target.value})
                        }}/></Form.Item>
                <Form.Item
                label="平台收益3"
                name="platform_rate_three"
                rules={[{ required: true, message: "请输入平台收益3" }]}
                >
                <Input placeholder="请输入平台收益3" onChange={(e)=>{
                          setFormData({...formData,platform_rate_three:e.target.value})
                        }}/></Form.Item>
                <Form.Item
                label="服务商收益3"
                name="business_rate_three"
                rules={[{ required: true, message: "请输入服务商收益3" }]}
                >
                <Input placeholder="请输入服务商收益3"onChange={(e)=>{
                          setFormData({...formData,business_rate_three:e.target.value})
                        }}/></Form.Item>
                <Form.Item
                label="店家收益3"
                name="shop_rate_three"
                rules={[{ required: true, message: "请输入店家收益3" }]}
                >
                <Input placeholder="请输入店家收益3"onChange={(e)=>{
                          setFormData({...formData,shop_rate_three:e.target.value})
                        }}/></Form.Item> */}
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
