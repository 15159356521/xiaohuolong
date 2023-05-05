import React, { useState, useEffect } from "react";
import {
  Card,
  Breadcrumb,
  Button,
  Table,
  Modal,
  Form,
  message,
  Input,
  Space,
  Select
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { getAllList, PostUp,PostAdd } from "@/api/Sysmsg";
import routerContant from "@/utils/constant";
import { useRef } from "react";
;

const { Column } = Table;


export default function Index() {
  // const { state: {id} } = useLocation()
  const [loading, setLoading] = useState(false);
  const [upLogin, setUpLogin] = useState(false);
  const [tableData, setTableData] = useState([]);
 
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState({ device_code: "", status: "" });
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });

  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    setLoading(true);
    getAllList({
      page: page,
      limit: limit,
      name: search.name,
      phone: search.phone,
    }).then((res) => {
      // console.log(res.data.code);
      if (res.data.code == 200) {
        setLoading(false);
        setTableData(res.data.data);

        setPaginationPramas((preState) => ({
          ...preState,
          total: res.data.count,
        }));
      }
    });
    return true;
  };
  const formRef = useRef();
  const [formData, setFormData] = useState({
    id: "",
      title: null,
      content: null,
      type: null,
      phone: [],
  });
  useEffect(() => {
    (async function () {
      handlePageChange(paginationPramas.page, paginationPramas.limit);
    })();
  }, []);
  //  搜索管理员区
  // 表格区
  const handlerAdd = () => {
    setIsOpenModal(true);
    setFormData({
      id: "",
      titile: null,
      content: null,
     phone:[]
    })
  }
  // 修改、添加
  const [form] = Form.useForm();
  const onFinish = async(values) => {
    console.log(values);
    setSearch(values);
    const up = { ...values, page: 1, limit: 10 };
    // console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value);
    const { data } = await getAllList(up);
    // console.log(data);
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
  }
  const onReset = async () => {
    form.resetFields();
    setSearch({ device_code: "", status: "" });

    if (handlePageChange(1, 10)) {
      message.success("重置成功");
    }
  };

  const handleOk = async (file) => {
    try{

    setUpLogin(true);
    const keyFormFields = await formRef.current.validateFields();
    let data = null;
    if(formData.id===""){
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ keyFormFields",
        keyFormFields
      );
      
  
        data = await PostAdd({
          ...formData,
        }).then((res) => {
          setUpLogin(false);
          return res.data;
        });
    }else{
      data = await PostUp({
        ...formData,
      }).then((res) => {
        return res.data;
      });
    }


    if (data.code === 200) {
      handlePageChange(paginationPramas.page, paginationPramas.limit);

      setFormData({
        id: null,
        handler_content: null,
      });
      setIsOpenModal(false);
      message.success(data.msg);
    } else {
      setIsOpenModal(false);
      message.warning(data.msg);
    }

      
    }catch{setUpLogin(false);}

  };

  // 编辑操作
  const handlerEidt = async (record) => {
    console.log(record, "record");
    setFormData({ ...formData, id: record.id,handler_content:record.handler_content });
    setIsOpenModal(true);
  };
  // 弹窗取消逻辑
  const handleCancel = () => {
    setFormData({
      id: null,
      handler_content: null,
    });
    setUpLogin(false);
    setIsOpenModal(false);
  };


  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>系统消息</Breadcrumb.Item>
        </Breadcrumb>
        {routerContant("/tdb/index/a/sys.Sysmsg/b/index") ? (
        <Card>
          <Form layout="inline" onFinish={onFinish} form={form}>
            <Form.Item label="请输入标题" name="titile">
              <Input
                placeholder="请输入标题"
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
                {routerContant("/tdb/index/a/sys.Sysmsg/b/add") ? (
        <Button type="primary" onClick={() => handlerAdd()}>
            添加
          </Button>
        ) : null}
        <Card>
          <Table
            pagination={{  hideOnSinglePage: false,
              showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,page:paginationPramas.page,onChange:(page,pageSize)=>{
              handlePageChange(page,pageSize)
            }}}
            rowKey="id"
            dataSource={tableData}
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            {/* <Column align="center" title="消息id" dataIndex="id" /> */}
            <Column align="center" title="标题" dataIndex="titile" />
            <Column align="center" title="消息内容" dataIndex="content" />
            <Column align="center" title="创建时间" dataIndex="add_time" />
            {/* <Column
              align="center"
              title="消息类型"
              dataIndex="type"
              render={(_, record) => (
                <Tag color="#108ee9">
                  {record.type === 1 ? "正常系统消息" : record.type === 2 ?"故障反馈消息 ":
                  "意见反馈消息"}
                </Tag>
              )}
            />
   
           
            <Column
              align="center"
              title="操作"
              key="operation"
              fixed="right"
              render={(_, record) => (
                <>

                  <Button onClick={() => handlerEidt(record)}>修改 </Button>
                </>
              )}
            /> */}
          </Table>
        </Card>
        {isOpenModal ? (
          <Modal
            width={500}
            title="消息处理"
            open={isOpenModal}
            // onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={upLogin} onClick={handleOk}>
                确定
              </Button>,
            ]}
            // okText="确定"
            // cancelText="取消"
          >
            <Form
              ref={formRef}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 14 }}
              initialValues={{
                ...formData,
              }}
              autoComplete="off"
            >
              
                <>
                  <Form.Item
                    label="标题"
                    name="title"
                    rules={[  
                      {
                        required: true,
                        message: "请输入标题",
                      },
                    ]}
                  >
                    <Input placeholder="请输入标题" 
                     onChange={(e)=>{
                      setFormData({ ...formData, titile: e.target.value });
                     }} />
                  </Form.Item>
                  <Form.Item label="消息内容" name="content">
                    <Input.TextArea onChange={e=>{
                      setFormData((preState) => ({
                        ...preState,
                        content: e.target.value,
                      }));
                    }} />
                  </Form.Item>
                </>
                <Form.Item
            name="phone"
            label="指定发送对象"
            width="lg"
          >
            <Select
              mode="tags"
              style={{
                width: "100%",
              }}
              open={false}
              placeholder="请输入要发送消息的对象，请按回车隔开"
              // onChange={handleChange}
              onChange={(value) => {
                console.log(value, "value");
                setFormData((preState) => ({
                  ...preState,
                  phone: value,
                }));
               }}
                  
              tokenSeparators={[","]}
              
            ></Select>
          </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
