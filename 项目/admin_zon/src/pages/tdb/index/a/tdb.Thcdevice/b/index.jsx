import React, { useState, useEffect } from "react";
import {
  Upload,
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
  InputNumber,
  Select,
} from "antd";
import { getAllList, getUp, PostUp, postAdd,PostBind,PostVideo } from "@/api/Thcdevice";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { useRef } from "react";
import routerContant from "@/utils/constant";

import moment from "moment";

const { Column } = Table;
const { Option } = Select;
export default function Index() {

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const[formOption, setFormOption] = useState([])
  const [paginationPramas, setPaginationPramas] = useState({
    page:1,
    limit:10,
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
    // hideOnSinglePage: false,
    // showSizeChanger: true,
  });
  const [search, setSearch] = useState({ name: "" });
  const [form] = Form.useForm();
  const keyForm = useRef(null);
  // 添加与编辑

  const handlePageChange = (page, limit) => {
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({ page: page, limit: limit, ...search }).then((res) => {
      console.log(res.data);
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
  const [formData, setFormData] = useState([]);
  const getNewListData = async () => {
    setLoading(true);
    const { data } = await getAllList();
    getUp().then((res) => {
      console.log(res.data);
     setFormOption(res.data.data.shop_id)
      })
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
    const up = { ...value, page: 1, limit: 10 };
    const { data } = await getAllList(up);

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
    const keyFormFields = await keyForm.current.validateFields();
    if (formData.id) {
      // const fileds =  formRef.current.validateFields();
      const { data } = await PostUp(formData.id, {
        ...formData,
      });

      if (data.code === 200) {
        console.log(data);
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
      const { data} = await postAdd({
        ...formData,
      });

      if (data.code === 400) {
        message.warning(data.msg);
        return;
      } else {
        message.success(data.msg);
        getNewListData();
        setIsOpenModal(false);
      }
    }
  };

  // 删除
  const handlerOk = async (id) => {
    // try {
    //   await getDel(id);
    //   await getNewListData();
    //   message.success("删除成功");
    // } catch (e) {
    //   message.warning("删除失败");
    // }
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
      id:"",
      device_code: "",
      fullDeviceNum: "",
      start_mode: 1,
    });
    // const { data } = await getAdd();
    // console.log(data.data.field[1].props.data, 6545);
  };

  // 编辑操作
  const handlerEidt = async (record) => {
    console.log(record);
    setFormData({ ...formData, id: record.id,start_mode:record.start_mode,is_lock:record.is_lock });

     
    setIsOpenModal(true);
  }; // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
    setFormData({
      id:"",
      device_code: "",
      fullDeviceNum: "",
      start_mode: "",
    });
  };
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>特定波设备列表</Breadcrumb.Item>
        </Breadcrumb>

        {routerContant("/tdb/index/a/tdb.Thcdevice/b/index") ? (
          <Card>
            <Form layout="inline" onFinish={onFinish} form={form}>
              <Form.Item label="设备编号" name="device_code">
                <Input
                  placeholder="请输入设备编号"
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
              <Form.Item label="店家" 
              name="shop_id"      
              style={{width:"200px"}}
              >
            <Select
                  placeholder="请选择分类"
                  showArrow
                  width={200}
           defaultValue={"全部"}
                  onChange={ async(item) => {
                    console.log(item);
                    setSearch({ ...search
                    ,shop_id:item
                    });
                    const up = {  shop_id:item, page: 1, limit: 10 };
                    const { data } = await getAllList(up );
                    console.log(data);
                    if (data.code === 200) {
                      message.success("查询成功");
                      form.setFieldsValue({ device_code: "" });
                      setTableData(data.data);
                      setPaginationPramas((preState) => ({
                        ...preState,
                        total: data.data.total,
                      }));
                    } else {
                      message.warning(data.msg);
                      return;
                    }
                  }}
                  allowClear
                >
                  {formOption.map((item, index) => (
                    <Select.Option value={item.value} key={item.key}>
               
                      <span>{item.title}<span style={{color:"red"}}>({item.num})</span></span>
                    </Select.Option>
              
                  ))}
                </Select>
            </Form.Item>
            </Form>
          </Card>
        ) : null}
       {/* {routerContant("/tdb/index/a/tdb.Thcdevice/b/add") ? (
        <Button type="primary" onClick={() => handlerAdd()}>
          添加
        </Button>
        ):null} */}

        <Table
          scroll={{ x: 800 }}
          pagination={{  hideOnSinglePage: false,
            showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,page:paginationPramas.page,onChange:(page,pageSize)=>{
            handlePageChange(page,pageSize)
          }}}
          rowKey="id"
          dataSource={tableData}
          loading={loading}
          style={{ marginTop: "20px" }}
        >
          {/* <Column
            align="center"
            title="设备id"
            dataIndex="id"
            key="id"
            fixed="left"
          /> */}

          <Column align="center" title="设备编码" dataIndex="device_code" 
         />
              <Column align="center" title="迪文码" dataIndex="fullDeviceNum" 
         />
          <Column align="center" title="出厂时间" dataIndex="created_at" />
          <Column
            align="center"
            title="绑定店家"
            dataIndex="shop_branch_name"
            render={(text, record) => (
              <>
                {record.shopInfo ? (
                  <Tag color="#108ee9">{record.shopInfo.shop_name}</Tag>
                ) : (
                  <Tag color="red">未绑定店家</Tag>
                )}
              </>
            )}
          />
                   <Column
            align="center"
            title="设备状态"
            dataIndex="is_lock"
            render={(text, record) => (
              <>
                {record.is_lock==1 ? (
                   <Tag color="red">锁定</Tag>
                ) : (
                  <Tag color="#108ee9">正常</Tag>
                )}
              </>
            )}
          />
                             <Column
            align="center"
            title="支付模式"
            dataIndex="start_mode"
            render={(text, record) => (
              <>
                {record.start_mode==2 ? (
                   <Tag color="#108ee9">支付或时长</Tag>
                ) : (
                  <Tag color="#87d068">免费</Tag>
                )}
              </>
            )}
          />
                                      <Column
            align="center"
            title="支付模式"
            dataIndex="status`"
            render={(text, record) => (
              <>
                {record.status==0 ? (
                   <Tag color="#108ee9">未激活</Tag>
                ) : (
                  <Tag color="#87d068">使用中</Tag>
                )}
              </>
            )}
          />
          <Column align="center" title="申请时间" dataIndex="created_at" />
          {/* <Column
              title="APP二维码"
              dataIndex="pay_qrcode"
              render={(_, record) => (
                <>
                {record.pay_qrcode ? (
                     <Image
                  preview={{
                    imgVisible: false,
                  }}
                  src={`${record.pay_qrcode}`}
                />):<Tag color="red">未绑定设备</Tag>}
                </>
           
              )}
            /> */}
          {routerContant("/tdb/index/a/tdb.Thcdevice/b/edit") ? (
          <Column
            align="center"
            title="操作"
            key="operation"
      
            render={(_, record) => (
              <Space size="middle">  
              <>
                      <Button type="link" onClick={() => handlerEidt(record)}>
                        修改
                      </Button>
               
                    <Button type="link"  onClick={() =>{
                      Modal.confirm({
                        title: "确定绑定吗?",
                        icon: <ExclamationCircleOutlined />,
                        okText: "确认",
                        cancelText: "取消",
                        onOk:async ()=>{
                          // console.log( (await PostBind(record.id).then()).data.code);
                          const {data}=await PostBind(record.id);
                          // console.log(data);
                          data.code===200?message.success("绑定成功"):message.error("绑定失败");
                          getNewListData();
                          // (await PostBind(record.id).then()).data.code===200?message.success("绑定成功"):message.error("绑定失败")
                        },
                      });
                    }}>
                        绑定
                      </Button>
                    
                         <Button type="link"   onClick={() =>{
                      Modal.confirm({
                        title: "确定绑定吗?",
                        icon: <ExclamationCircleOutlined />,
                        okText: "确认",
                        cancelText: "取消",
                        onOk:async ()=>{
                          // console.log( (await PostBind(record.id).then()).data.code);
                          const {data}=await PostVideo(record.id);
                          // console.log(data);
                          data.code===200?message.success("绑定成功"):message.error("绑定失败");
                          getNewListData();
                          // (await PostBind(record.id).then()).data.code===200?message.success("绑定成功"):message.error("绑定失败")
                        },
                      });
                    }}>
                        绑定视频
                      </Button>
    
              
                  </>
             
              </Space>
            )}
          />
          ) : null}
        </Table>

        {isOpenModal ? (
          <Modal
            width={800}
            title={formData.id ? "编辑" : "添加"}
            open={isOpenModal}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="确定"
            cancelText="取消"
          >
            <Form
              // form={keyForm}
              ref={keyForm}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 20 }}
              autoComplete="off"
              // initialValues={{ ...formData }}
            >
              {formData.id=="" ? 
              <>
              <Form.Item
                label="设备编码"
                name="device_code"
                required={false}
                rules={[{ required: true, message: "请输入设备编码" }]}
              >
                <InputNumber
                  style={{ width: 250 }}
                  placeholder="请输入设备编码"
                  onChange={(e) => {
                    console.log(e);
                    setFormData({
                      ...formData,
                      device_code: e,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="设备唯一标识"
                name="fullDeviceNum"
                required={false}
                rules={[{ required: true, message: "请输入设备唯一标识" }]}
              >
                <Input
                  placeholder="请输入设备编码"
                  style={{ width: 250 }}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      fullDeviceNum: e.target.value,
                    });
                  }}
                />
              </Form.Item>
              </>
              :null}
             
              <Form.Item
                label="设备设备模式"
                name="start_mode"
      
             
              >
                <Select
                  placeholder="请选择"
                  allowClear
                  defaultValue={formData.start_mode}
                  style={{ width: 250 }}
                  onChange={(value) => {
                    setFormData({ ...formData, start_mode: value });
                  }}
                >
                  <Option value={1}>免费模式</Option>
                  <Option value={2}>时长或支付</Option>
                </Select>
              </Form.Item>
              {formData.id==""?null: <Form.Item
                label="设备情况"
                name="is_lock"
              
              >
                      <Select
                  placeholder="请选择"
                  allowClear
                  defaultValue={formData.is_lock}
                  style={{ width: 250 }}
                  onChange={(value) => {
                    setFormData({ ...formData, is_lock: value });
                  }}
                >
                  <Option value={0}>正常</Option>
                  <Option value={1}>锁定</Option>
                </Select>
                </Form.Item>
              }
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
