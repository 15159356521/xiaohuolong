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
  DatePicker,
  Input,
  Tag,
  Select,
  Upload,
  InputNumber,
  Tree,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import {
  getAllList,
  getUp,
  PostUp,
  PostAdd,
  PostDel,
  getAdd
} from "../../api/auth.admroup";
import { useRef } from "react";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import routerContant from "../../utils/constant";
const { Column } = Table;
export default function ManageSub() {
  // const { state: {id} } = useLocation()
  const [loading, setLoading] = useState(false);
  const [upLogin, setUpLogin] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState({name: '',phone:''});
  const [paginationPramas, setPaginationPramas] = useState({
  page: 1, //当前页码
limit: 10, // 每页数据条数
    total: "", // 总条数
    onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const [formOption, setFormOption] = useState({
    group_id: { list: [], value: "" },
    status: { list: [], value: "" },
  });
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
 getAllList({ page: page, limit: limit,name:search.name,phone:search.phone }).then((res) => {
  console.log(res.data.code );
      if (res.data.code == 200) {
        setTableData(res.data.data);
        setPaginationPramas((preState) => ({
          ...preState,
          total: res.data.count,
        }));
      
      }

    });
    return true
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
    (async function () {
      getAllRoleGroupData();
      console.log(formOption, "formOption");
      console.log(formData, "formData");
      const opt = { ...formOption };
      const reqdata =await getAdd().then((res) => {
        return res.data.data.field;
      });
      for (let a in reqdata) {
        console.log(reqdata[a]);
        if (reqdata[a].options) {
          console.log(reqdata[a].field, "option");
          let key = reqdata[a].field;
          opt[key].list = reqdata[a].options;
          opt[key].value = reqdata[a].value;
  
          console.log(opt, "opt");
  
          // setSearchOpt( (preState) => ({ ...preState, group_id: reqdata[a].option }));
        }else{
          console.log(65465);
        }
        setFormOption(opt);
      }

    })();
  }, []);
  //  搜索管理员区
  const [form] = Form.useForm();
  const onFinish = async (value) => {
    setSearch(value);
    
    console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value);
    const { data } = await getAllList(value);
    console.log(data);
    if (data.code === 200) {
      message.success("查询成功");
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
  const onReset = async () => {
    form.resetFields();
    setSearch({name: '',phone:''});
    
   if(handlePageChange(1,10)){
    message.success("重置成功");
   }

  };
  // 表格区
  // 修改、添加管理人员
  const handleOk = async (file) => {
    setUpLogin(true)
    let files = formRef.current.getFieldValue();
    console.log(files);
    if (formData.id) {
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
        setUpLogin(false)
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
      setUpLogin(false)
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
      title: `确定删除${record.name}吗?`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: () => handlerOk(record.user_id),
    });
  };

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
    const opt = { ...formOption };
    const reqdata = await getUp(record.user_id).then((res) => {
      return res.data.data.field;
    });
    for (let a in reqdata) {
      console.log(reqdata[a]);
      if (reqdata[a].options) {
        console.log(reqdata[a].field, "option");
        let key = reqdata[a].field;
        opt[key].list = reqdata[a].options;
        opt[key].value = reqdata[a].value;
        obj[key] = reqdata[a].value;
        console.log(opt, "opt");

        // setSearchOpt( (preState) => ({ ...preState, group_id: reqdata[a].option }));
      } else {
        let key = reqdata[a].field;
        obj[key] = reqdata[a].value;
        obj.id = record.user_id;
        //  console.log(obj);
      }
      setFormOption(opt);

      setFormData(obj);
    }

    setIsOpenModal(true);
    setIsOpenModal(true);
  };

  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
  };

  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item >管理人员</Breadcrumb.Item>
        </Breadcrumb>
        {routerContant("/auth.admuser/index") ? (
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
            {/* <Form.Item label="状态" name="status">
                            <Select
                                placeholder="请选择"
                                name="level"
                                allowClear
                                >
                                {
                                    Object.keys(searchOpt.task_status).map(item => {
                                        return <Select.Option value={item} key={item}>{searchOpt.task_status[item]}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item> */}
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
        {routerContant("/auth.admuser/add") ? (
          <Button type="primary" onClick={() => handlerAdd()}>
            添加
          </Button>
        ) : null}
          <Table
            scroll={{ x: 1400 }}
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
              title="id"
              dataIndex="user_id"
              key="user_id"
              fixed="left"
            /> */}
            <Column align="center" title="账号" dataIndex="phone" key="name" />
            <Column align="center" title="名称" dataIndex="name" key="name" />
            <Column
              align="center"
              title="用户组"
              dataIndex="group_name"
              key="group_name"
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
            <Column
              align="center"
              title="操作"
              key="operation"

              render={(_, record) => (
                <Space size="middle">
                  {record.user_id === 1 ? (
                    <Tag color="#108ee9">系统保留</Tag>
                  ) : (
                    <>
                      {/* {
                                        roleBtn.find(item => item.title === '删除') 
                                            ? <Button type='link' onClick={() => handlerDel(record)}>删除</Button> : null
                                    }
                                    {
                                        roleBtn.find(item => item.title === '编辑') 
                                            ? <Button type='link' onClick={() => handlerEidt(record)} >编辑</Button> : null
                                    } */}
                                          {routerContant("/auth.admuser/del") ? (
                      <Button type="link" onClick={() => handlerDel(record)}>
                        删除
                      </Button>
                    ) : null}
                          {routerContant("/auth.admuser/edit") ? (
                      <Button type="link" onClick={() => handlerEidt(record)}>
                        编辑
                      </Button>
                    ) : null}
                    </>
                  )}
                </Space>
              )}
            />
          </Table>
        </Card>
        {isOpenModal ? (
          <Modal
            width={1200}
            title="新增数据"
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
              <Form.Item
                label="角色组"
                name="group_id"
                rules={[{ required: true, message: "请选择您的角色组" }]}
              >
                <Select
                  placeholder="请选择角色组"
                  showArrow
                  value="formOption.group_id.value"
                  onChange={(item) => {
                    setFormData((preState) => ({
                      ...preState,
                      group_id: item,
                    }));
                  }}
                  allowClear
                >
                  {formOption.group_id.list.map((item, index) => (
                    <Select.Option value={item.value} key={item.value}>
                      {console.log(item, "item")}
                      {item.label}
                    </Select.Option>
                    // console.log(item, "item")
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="账号"
                name="phone"
                rules={[{ required: true, message: "请输入您的账号" }]}
              >
                <Input placeholder="请输入您的账号" />
              </Form.Item>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: "请输入您的名称" }]}
              >
                <Input placeholder="请输入您的名称" />
              </Form.Item>
              <Form.Item label="密码">
                <Input
                  placeholder="不修改密码留空添加账号时需"
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      pwd: e.target.value,
                    }))
                  }
                />
              </Form.Item>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: "请输入您的状态" }]}
              >
                <Switch
                  checked={formData.status === 1}
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
