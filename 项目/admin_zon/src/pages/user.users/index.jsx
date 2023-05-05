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
} from "antd";
import styles from "./index.module.scss";
import { getAllList, getUp, PostUp, PostAdd, PostDel } from "../../api/user";
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
  const [loading, setLoading] = useState(false);
  const [upLogin, setUpLogin] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState({ name: "", phone: "" });
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
  limit: 10, // 每页数据条数
    total: "", // 总条数
    onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const [fileList, setFileList] = useState([]);
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({
      page: page,
      limit: limit,
      name: search.name,
      phone: search.phone,
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
    group_id: "",
    name: "",
    phone: "",
    pwd: "",
    status: "",
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
    console.log("useEffect");
    (async function () {
      getAllRoleGroupData();

    })();
  }, []);
  //  搜索管理员区
  const [form] = Form.useForm();
  const onFinish = async (value) => {
    console.log(value, "sdfsf");
    setSearch(value);
    for (let key in value) {
      if (value[key] == undefined) {
        value[key] = "";
      }
    }
    const up = { name: value.name, phone: value.phone, page: 1, limit: 10 };
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
    const { data } = await getAllList({ page: 1, limit: 10, });
    console.log(data);
    if (data.code !== 400) {
      message.success({ content: "重置成功", key: "reset" });
      setTableData(data.data);
      setPaginationPramas((preState) => ({ ...preState,page:1,limit:10, total: data.count }));
    }
  };
  // 表格区
  // 修改、添加管理人员
  const handleOk = async (file) => {
    setUpLogin(true);
    let files = formRef.current.getFieldValue();
    console.log(files);
    if (formData.id) {
      const fileds = await formRef.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",
        fileds.status,fileds.name,
      );
      PostUp(formData.id, {
        status: formData.status,
        name: fileds.name,
      }).then((res) => {
        setUpLogin(false);
        console.log(res, "修改");
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
        ...fileds,
        pwd: formData.pwd,
        status: formData.status,
        group_id: formData.group_id,
      });
      setUpLogin(false);
      if (data.code === 400) {
        message.warning("密码不能为空");
        return;
      } else {
        message.success(data.msg);
        getAllRoleGroupData();
        setIsOpenModal(false);
      }
    }
  };

  // 删除管理人员
  // const handlerOk = async (id) => {
  //   PostDel(id).then((res) => {
  //     console.log(res, "删除");
  //     if (res.data.code === 200) {
  //       getAllRoleGroupData();
  //       message.success(res.data.msg);
  //     } else {
  //       message.warning(res.data.msg);
  //     }
  //   });
  // };

  // const handlerDel = (record) => {
  //   Modal.confirm({
  //     title: `确定删除${record.name}吗?`,
  //     icon: <ExclamationCircleOutlined />,
  //     okText: "确认",
  //     cancelText: "取消",
  //     onOk: () => handlerOk(record.user_id),
  //   });
  // };

  // 点击添加按钮显示弹窗
  const handlerAdd = async () => {
    setIsOpenModal(true);
    setFormData({
      group_id: "",
      name: "",
      phone: "",
      pwd: "",
      status: "",
    });
  };
  // 编辑操作
  const handlerEidt = async (record) => {
    const obj = { ...formData };
    const reqdata = await getUp(record.user_id).then((res) => {
      return res.data.data.field;
    });
    for (let a in reqdata) {
      console.log(reqdata[a]);
        let key = reqdata[a].field;
        obj[key] = reqdata[a].value;
        obj.id = record.user_id;
        //  console.log(obj);
      setFormData(obj);
    }

    setIsOpenModal(true);
    setIsOpenModal(true);
  };

  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
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
      }));
    }
  };
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item >会员总列表</Breadcrumb.Item>
        </Breadcrumb>
        {routerContant("/user/index") ? (
        <Card>
          <Form layout="inline" onFinish={onFinish} form={form}>
            <Form.Item label="账号" name="phone">
              <Input
                placeholder="请输入搜索账号"
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
            <Form.Item label="名称" name="name">
              <Input
                placeholder="请输入搜索名称"
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
          <Button type="primary" onClick={() => handlerAdd()}>
            添加
          </Button>
          <Table
            scroll={{ x:600 }}
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
              title="id"
              dataIndex="user_id"
              key="user_id"
              fixed="left"
            /> */}
            <Column align="center" title="账号" dataIndex="phone" key="name"   />
            <Column align="center" title="名称" dataIndex="name" key="name" />
            <Column
              align="center"
              title="头像"
              dataIndex="avatar"
              key="avatar"
              render={(_, record) => (
                <Image
                  preview={{
                    imgVisible: false,
                  }}
                  src={`${record.avatar}`}
                />
              )}
            />
            <Column
              align="center"
              title="登录时间"
              dataIndex="logintime"
              key="logintime"
            />
            <Column
              align="center"
              title="状态"
              dataIndex="status"
              key="status"
              render={(_, record) => (
                <Tag color="#108ee9">
                  {record.status === 1 ? "正常" : "异常"}
                </Tag>
              )}
            />
             {routerContant("/user.users/edit") ? (
            <Column
              align="center"
              title="操作"
              key="operation"
             
              render={(_, record) => (
            
              <>
                 <Button
                          type="link"
                          key="edit"
                          onClick={() => handlerEidt(record)}
                        >
                          编辑
                        </Button>
                 
                    </>
           
              )}
            />
            ) : null}
          </Table>
        </Card>
        {isOpenModal ? (
          <Modal
            width={1200}
            title={formData.id ? "编辑" : "添加"}
            open={isOpenModal}
          
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={upLogin} onClick={handleOk}>
                确定
              </Button>,
            ]}
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
              {/* <Form.Item
                label="头像"
                name="avatar"
                rules={[{ required: true, message: "请选择您的封面" }]}
              >
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList}
                  onRemove={(file) => {
                    console.log(file);
                    formRef.current.setFieldsValue({
                      img: "",
                    });
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
              </Form.Item> */}

              <Form.Item
                label="账号"
                name="phone"
                rules={[{ required: true, message: "请输入您的账号" }]}
              >
                <Input placeholder="请输入您的账号" disabled />
              </Form.Item>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: "请输入您的名称" }]}
              >
                <Input placeholder="请输入您的名称" />
              </Form.Item>
              {/* <Form.Item label="密码">
                <Input
                  placeholder="不修改密码留空添加账号时需"
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      pwd: e.target.value,
                    }))
                  }
                />
              </Form.Item> */}
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: "请输入您的状态" }]}
              >
                <Switch
                  checked={formData.status == 1}
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      status: e ? 1 : 2,
                    }))
                  }
                />
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
