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
  Breadcrumb
} from "antd";
import styles from "./index.module.scss";
import { CloudUploadOutlined, ReloadOutlined } from "@ant-design/icons";
import City from "@/components/City";
import { getAfter,PostSend,PostRefund,PostChange } from "@/api/Order";
const receiving = [
  { title: "收货人", dataIndex: "real_name", align: "center" },
  { title: "收货地址", dataIndex: "user_address", align: "center" },
  { title: "收货电话", dataIndex: "user_phone", align: "center" },
];

const sourceColumns = [
  { title: "快递公司", dataIndex: "delivery_name", align: "center" },
  { title: "快递单号", dataIndex: "delivery_id", align: "center" },
  { title: "快递类型", dataIndex: "delivery_type", align: "center" },
];
export default function Index() {
  const Shop_id=useParams().id
  //   收货信息
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const[formOptions,setFormOptions]=useState([])
  const [status, setStatus] = useState(0);
  const [form] = Form.useForm();
  const [deliver, setDeliver] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [address, setAddress] = useState([]);
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  // 快递信息
  const [keyForm] = Form.useForm();
  const [keyFormData, setKeyFormData] = useState();
  const [keyLoading, setKeyLoading] = useState(false);

  const getAll=async()=>{
    const { data:{data} } = await getAfter(Shop_id);
    console.log(data.address, "data");
    setTableData(data.data);
    // address转换成数组
    let arr=[];
arr.push(data.address)
    setAddress(arr);
    let a=[]
    a.push(data.deliver)
    setDeliver(a)
  }
 
  useEffect(() => {
    getAll()
   
     }, []);
  // table列表
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    // getAllList({
    //   page: page,
    //   limit: limit,
    //  ...search,
    // }).then((res) => {
    //  console.log(res.data);
    //   if (res.data.code == 200) {
    //     setTableData(res.data.data);
    //     setPaginationPramas((preState) => ({
    //       ...preState,
    //       total: res.data.count,
    //     }));
    //   }
    // });
    // return true;
  };
  //   收货数据修改
  const handleOk = async () => {
    const fileds = await form.validateFields();
    console.log(
      "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",
      fileds,
    );
    try {
      const { data:{code} } = await PostChange({
        ...fileds,...formData
      });
     if(code===200){
       message.success("提交成功")
       getAll()
      setIsOpenModal(false);
     }
    
    } catch {}
    setLoading(false);
  };
  const handleCancel = () => {
    setIsOpenModal(false);
    setLoading(false);
  };

  const columns = [
    { title: "订单商品", dataIndex: "goods_name", align: "center" },
   
    { title: "商品数量", dataIndex: "total_num", align: "center" },
    { title: "支付金额", dataIndex: "total_price", align: "center" },
    {
      title: "商品状态",
      dataIndex: "status",
      align: "center",
      render: (text,record) => (
        <>
          {text === 0 ? (
            <Tag color="green">待发货</Tag>
          ) : text === 1?(
            <Tag color="orange">待收货</Tag>
          ):text===2?(
            <Tag color="cyan">已收货</Tag>
          ):text===3?(
            <Tag color="purple">待评价</Tag>
          ):text===4?(
            <Tag color="geekblue">已完成</Tag>
          ):text===5?(
            <Tag color="red">退款中</Tag>
          ):text===6?(
            <Tag color="magenta">退款成功</Tag>
          ):text===7?(
            <Tag color="gold">换货中</Tag>
          ):text===8?(
            <Tag color="lime">换货成功</Tag>
          ):text===9?(
            <Tag color="#f50">退货中</Tag>
          ): <Tag color="#2db7f5">退货成功</Tag>
           }
        </>
      ),
    },
    {
      title: "操作",
      align: "center",
      render: (record) => (
        <Space key="space">

            <>
              <Button
              type="primary"
   
              onClick={() => {
                handlerEidt(record,3);
              }}
            >
              退款
            </Button>
            <Button
              type="primary"
              onClick={() => {
               setFormData({id:record.goods_id,order_id:record.order_id})
                handlerEidt(record,1);
              }}
            >
              换货
            </Button>
            </>
         
        </Space>
      ),
    },
  ];
  
  const handlerEidt = async (record,num) => {
    // const { data } = await getUp(record.id);
    // setFormData(data.data);
    setStatus(num)
    let data=null
    if(num==3){
      Modal.confirm({
        title: "确定退款完成吗?",
        okText: "确认",
        cancelText: "取消",
        onOk: async () => {
          const { data:{code} } = await PostRefund({id:record.goods_id,order_id:record.order_id});
          if(code===200){
            message.success("退款成功")
            getAll()
          }
        },
      });
    }else if(num==1){
          setIsOpenModal(true);
    }


  };
  //   快递信息
  const onFinish = async (values) => {
    console.log("Success:", values);
    // setKeyLoading(true);
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
          <Breadcrumb.Item >售后</Breadcrumb.Item>
        </Breadcrumb>
        <Table
          columns={columns}
          scroll={{ x: 1200 }}
          dataSource={tableData}
          pagination={{
            hideOnSinglePage: true,
            showSizeChanger: true,
            total: paginationPramas.total,
            pageSize: paginationPramas.limit,
            current: paginationPramas.page,
            onChange: (page, pageSize) => {
              handlePageChange(page, pageSize);
            },
          }}
        ></Table>
      </Card>
      <Card>
        当前收货地址
        <Table
          columns={receiving}
          dataSource={address}
          scroll={{ x: 1200 }}
          pagination={{ hideOnSinglePage: true, showSizeChanger: true }}
        ></Table>
      </Card>
      {isOpenModal ? (
        <Modal
          width={800}
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
            onFinish={upFinish}
            autoComplete="off"
          >
            <Form.Item
              label="快递编号"
              name="order_num"
              
            >
              <Input placeholder="请输入快递编号" />
            </Form.Item>
            {/* <Form.Item label="备注" name="remark">
              <Input placeholder="请输入备注" />
            </Form.Item> */}
          </Form>
        </Modal>
      ) : null}
      <Card>
        {/* <Form
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
                          formOptions.push(item.order_goods_id)
                          setFormOptions(formOptions)
                        }}
         
                      >
                        {item.goods_name}
                      </Checkbox>
                    </Col>
                 
                ); 
              })
         
              }
                   </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            label="快递公司"
            name="source"
            rules={[{ required: true, message: "请输入快递公司" }]}
          >
            <Input placeholder="请输入快递公司" />
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
            <Select  placeholder="请选择快递类型" >
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
                发货
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
        </Form> */}
        快递发货列表
        <Table
          columns={sourceColumns}
          dataSource={deliver}
          scroll={{ x: 1200 }}
          pagination={{ hideOnSinglePage: true, showSizeChanger: true }}
        ></Table>
      </Card>
    </div>
  );
}
