import React, { useState, useEffect } from "react";
import {

  Card,
  Breadcrumb,
  Button,
  Table,
  Space,
  Modal,
  Form,
  message,
  Input,

  Image,
  Upload,
  Select,

} from "antd";
import styles from "./index.module.scss";
import { getAllList,  PostUp, PostAdd, PostDel,getUp } from "@/api/Banner";
import { useRef } from "react";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import routerContant from "@/utils/constant";
import { baseIMgURL } from "@/utils/request";
const { Column } = Table;
const { Option } = Select;
export default function Index() {
  // const { state: {id} } = useLocation()
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upLogin, setUpLogin] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState({ name: "", phone: "" });
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const [fileList, setFileList] = useState([]);
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({
      page: page,
      limit: limit,
      title: search.title,
    }).then((res) => {
      console.log(res.data.code);
      if (res.data.code == 200) {
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
id: null,
title: null,
img: null,
url: null,
url_type: 1,
  });
  const getAllRoleGroupData = async () => {
    setLoading(true);
    const { data, count } = await getAllList();
    console.log(data);
    setTableData(data.data);
    setPaginationPramas((preState) => ({ ...preState, total: count }));
    setLoading(false);
  };
  useEffect(() => {
    (async function () {
      getAllRoleGroupData();
     
    })();
  }, []);
  //  搜索管理员区
  const [form] = Form.useForm();
  const onFinish = async (value) => {
    setSearch(value);
    for (let key in value) {
      if (value[key] == undefined) {
        value[key] = "";
      }
    }
    const up = { ...value, page: 1, limit: 10 };
    // console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value);
    const { data } = await getAllList(up);
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
    setSearch({ name: "", phone: "" });

    if (handlePageChange(1, 10)) {
      message.success("重置成功");
    }
  };
  // 表格区
  // 修改、添加轮播
  const handleOk = async (file) => {
    try{

setUpLogin(true)
    let files = formRef.current.getFieldValue();
    console.log(files);
    if (status!==null) {
      const fileds = await formRef.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",
        fileds,
        formData
      );
      PostUp(formData.id, {
        ...formData,
        name: fileds.name,
      }).then((res) => {
        console.log(res, "修改");
        setUpLogin(false)
        if (res.data.code === 200) {
          getAllRoleGroupData();
          setIsOpenModal(false);
          message.success(res.data.msg);
        } else {
          setIsOpenModal(false);
          message.warning(res.data.msg);
        }
      });
    } else {
      const fileds = await formRef.current.validateFields([
        "name",
        "status",
        "phone",
      ]);
      console.log(
        "🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds",
        fileds,
        formData
      );
      const { data } = await PostAdd({
        ...formData
      });
      setUpLogin(false)
      if (data.code === 400) {
        message.warning("上传失败");
        return;
      } else {
        message.success(data.msg);
        getAllRoleGroupData();
        setFileList([]);
        setFormData({
          id: null,
          title: null,
          img: null,
          url: null,
          url_type: 1,
        });
        setIsOpenModal(false);
      }
    }

      
    }catch{setUpLogin(false);}
    
  };

  // 删除管理人员
  const handlerOk = async (id) => {
    PostDel(id).then((res) => {
      console.log(res, "删除");
      if (res.data.code === 200) {
        getAllRoleGroupData();
        message.success(res.data.msg);
      } else {
        message.warning(res.data.msg);
      }
    });
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
    setStatus(null);
    setIsOpenModal(true);
    setFileList([]);
    setFormData({
        id: null,
        title: null,
        img: null,
        url: null,
        url_type: 1,
    });
  };
  // 编辑操作
  const handlerEidt = async (record) => {
  console.log(record,'sdfsd');
  // const {data}=await getUp(record.id);
  // console.log(data,"bianji");
        setStatus(record.id);
        setFormData({
          id: record.id,
          title: record.title,
          img: record.img,
          url: record.url,
          url_type: record.url_type,
        });
        setFileList([
          {
            uid: -1,
            name: `${record.title}`,
            status: "done",
            url: `${baseIMgURL}${record.img}`,
          },
        ]);
        getAllRoleGroupData();
        setIsOpenModal(true);
  };

  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
    setUpLogin(false);
  };
  // 上传图片
  const onUpdataChange = ({ fileList: newFileList }) => {
    console.log(fileList, "sdfdfsfsd");
    setFileList(newFileList);
    if (newFileList[0]?.response?.code === 400) {
      message.warning(newFileList[0]?.response?.msg);
      setFormData((preState) => ({ ...preState, img: null }));
      setFileList([]);
      return;
    } else {
      setFormData((preState) => ({
        ...preState,
        img:
          newFileList.length === 0 ? null : newFileList[0]?.response?.data?.url,
          url:
          newFileList.length === 0 ? null :baseIMgURL+newFileList[0]?.response?.data?.url,

      }));
    }
  };
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item >轮播图列表</Breadcrumb.Item>
        </Breadcrumb>
        {routerContant("/tdb/index/a/tdb.Banner/b/index") ? (
        <Card>
          <Form layout="inline" onFinish={onFinish} form={form}>
            <Form.Item label="标题" name="title">
              <Input
                placeholder="请输入搜索标题"
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
        {routerContant("/tdb/index/a/tdb.Banner/b/add") ? (
          <Button type="primary" onClick={() => handlerAdd()}>
            添加
          </Button>
        ) : null}
          <Table
                 scroll={{ x: 800 }}
        pagination={{  hideOnSinglePage: false,
          showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,page:paginationPramas.page,onChange:(page,pageSize)=>{
          handlePageChange(page,pageSize)
        }}}
            
            rowKey="id"
            dataSource={tableData}
            loading={loading}
            style={{ marginTop: "20px"}}

          >
            {/* <Column
              align="center"
              title="轮播图id"
              dataIndex="id"
              key="user_id"
              fixed="left"
            /> */}
            <Column align="center" title="标题" dataIndex="title" key="name"   />
            <Column
              title="图片"
              dataIndex="avatar"
              align="center"
              key="avatar"
              render={(_, record) => (
                <Image
                  preview={{
                    imgVisible: false,
                  }}
                  src={`${baseIMgURL}${record.img}`}
                />
              )}
            />
            <Column align="center" title="跳转类型" dataIndex="url_type"
            
            render={(_, record) => (
              <span>{record.url_type===1?'app内部链接':'外部链接'}</span>
            )}
            />
            <Column
              align="center"
              title="创建时间"
              dataIndex="createtime"
            />
            <Column
              align="center"
              title="操作"
              key="operation"
              
              render={(_, record) => (
<>
{routerContant("/tdb/index/a/tdb.Banner/b/del") ? (
                        <Button type="link" onClick={() => handlerDel(record)}>
                          删除
                        </Button>
                      ) : null}
                      {routerContant("/tdb/index/a/tdb.Banner/b/edit") ? (
               
                        <Button
                          type="link"
                          key="edit"
                          onClick={() => handlerEidt(record)}
                        >
                          编辑
                        </Button>
                      ) : null}
                 
                    </>
            
              )}
            />
          </Table>
        </Card>
        {isOpenModal ? (
          <Modal
            width={1200}
            title={formData.id ? "编辑轮播图" : "添加轮播图"}
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
              // form={form}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                ...formData,
              }}
              autoComplete="off"
            >
                {/* {status===null? <Form.Item
                label="id"
                name="id"
                rules={[{ required: true, message: "请输入您的ID" }]}
              >
                <InputNumber placeholder="请输入您的id" onChange={(e)=>{
                    setFormData((preState) => ({ ...preState, id: e }));
                }} />
              </Form.Item>:null} */}
              <Form.Item
                label="图片"
                name="img"
                rules={[{ required: true, message: "请选择您的封面" }]}
              >
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList}
                  onRemove={(file) => {
                    console.log(file);
                    setFormData({
                      ...formData,
                      img: "",
                    });
                    setFileList([]);
                  }}
                  onChange={onUpdataChange}
                >
                  {fileList.length < 1 && "+上传图片"}
                </Upload>
              </Form.Item>

              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: "请输入您的标题" }]}
              >
                <Input placeholder="请输入您的标题" onChange={(e)=>{
                    setFormData((preState) => ({ ...preState, title: e.target.value }));
                }}/>
              </Form.Item>
              <Form.Item
                label="跳转地址"
                name="url"
                rules={[{ required: true, message: "请输入您要跳转的地址" }]}
              >
                 <Input placeholder="请输入您要跳转的地址" defaultValue={formData.url} onChange={(e)=>{
                    setFormData((preState) => ({ ...preState, url: e.target.value }));
                    formRef.current.setFieldsValue({url:e.target.value})
                }}/>
                <span style={{color:"red"}}>健康信息如subpkg/newsDetails/newsDetails?news_id=</span>
              </Form.Item>
              <Form.Item 
              >


              </Form.Item>
                <Form.Item
                label="跳转类型"
                name="url_type"
                rules={[{ required: true, message: "请选择您要跳转的类型" }]}
                defaultValue={formData.url_type}
                >
                    <Select onChange={value=>{
                        setFormData((preState) => ({ ...preState, url_type: value }));
                        formRef.current.setFieldsValue({url_type:value})

                    }}>
                        <Option value={1}>软件内部跳转</Option>
                        <Option value={2}>外部跳转</Option>
                    </Select>

                </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
