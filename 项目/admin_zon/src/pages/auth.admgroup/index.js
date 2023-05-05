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
  addRole,
  getDel,
  getAllList,
  getAdd,
  getUp,
  PostUp,
} from "../../api/role";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { useRef } from "react";
import { mapTree } from "../../utils/index";
import routerContant from "../../utils/constant";

const { Column } = Table;
// 新闻列表
export default function RoleGroup() {
  // const { state: {id} } = useLocation()
  //   console.log(routerContant[location.pathname]);
  // const id = routerContant[location.pathname]

  const [loading, setLoading] = useState(false);
  const [upLogin, setUpLogin] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const formRef = useRef();
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1,
    limit: 10,
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
    // hideOnSinglePage: false,
    // showSizeChanger: true,
  });
  const [search, setSearch] = useState({name: ''});
  const [form] = Form.useForm();
  const [formOption, setFormOption] = useState({
    rule_list: [],
  });

  const handlePageChange = (page, limit) => {
    setPaginationPramas((preState) => ({ ...preState, page, limit}));
    getAllList({ page: page, limit: limit,name:search.name }).then((res) => {
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
    name: "",
    rules: "",
    status: "",
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
      // const { code, resData, count } = await getRoleBtn(id)
      // if(code === 401) {
      //     message.warning('用户未登录， 请登录后操作')
      //     return navigator('/login', { replace: false })
      // }
      // setRoleBtn(resData.btn_list)
    })();
  }, []);
  // 搜索
  const onFinish = async (value) => {
    console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value);
    setSearch(value);
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
    setUpLogin(true);
    if (formData.id) {
      const fileds = await formRef.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",
        fileds,
        formData
      );
      const {data} = await PostUp(formData.id, {
        ...fileds,
        status: formData.state,
        rules: formData.rules,
      });
      setUpLogin(false)
      if (data.code === 200) {
        getNewListData();
        setIsOpenModal(false);
        message.success(data.msg);
      } else {
        setIsOpenModal(false);
        message.warning(data.msg);
      }
    } else {
      const fileds = await formRef.current.validateFields(["name", "status"]);
      console.log(
        "🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds",
        fileds,
        formData
      );
      const { code, msg } = await addRole({
        ...fileds,
        rules: formData.rules,
        status: formData.status,
      });
      setUpLogin(false)
      if (code === 400) {
        message.warning(msg);
        return;
      } else {
        message.success(msg);
        getNewListData();
        setIsOpenModal(false);
      }
    }
  };

  // 删除
  const handlerOk = async (id) => {
    try {
      const res = await getDel(id);
      await getNewListData();
      message.success("删除成功");
    } catch (e) {
      message.warning("删除失败");
    }
  };

  const handlerDel = (record) => {
    Modal.confirm({
      title: `确定删除${record.name}吗?`,
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
      name: "",
      rules: "",
      status: "",
    });
    const { data } = await getAdd();
    console.log(data.data.field[1].props.data,6545);
    if (data.code === 200) {
      const new_list =data.data.field[1].props.data.map((org) => mapTree(org));
      setFormOption({
        rule_list: new_list,
      });
    } else {
      message.warning(data.msg);
    }
  };

  // 编辑操作
  const handlerEidt = async (record) => {
    try {
      const obj = { ...formData };
      const reqdata = await getUp(record.id).then((res) => {
        return res.data.data.field;
      });
      for (let a in reqdata) {
        console.log(reqdata[a]);
        if (reqdata[a].field === "rules") {
          const new_list = reqdata[a].props.data.map((org) => mapTree(org));
          let key = reqdata[a].field;
          obj[key] = reqdata[a].value;

          setFormOption({
            rule_list: new_list,
          });
        } else {
          obj.id = record.id;
          console.log(obj, "obj");
          let key = reqdata[a].field;
          obj[key] = reqdata[a].value;
        }
        // setFormOption(opt);

        setFormData(obj);
      }
    } catch (error) {
      message.warning(error);
    }

    setIsOpenModal(true);
  };

  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
  };

  const onSelect = (selectedKeys, info) => {
    setFormData((preState) => ({
      ...preState,
      rules: selectedKeys,
    }));
  };

  const onCheck = (checkedKeys, info) => {
    setFormData((preState) => ({
      ...preState,
      rules: checkedKeys,
    }));
  };

  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item >角色组</Breadcrumb.Item>
        </Breadcrumb>

        {routerContant("/auth.admgroup/index") ? (
          <Card>
            <Form layout="inline" onFinish={onFinish} form={form}>
              <Form.Item label="账号" name="name">
                <Input
                  placeholder="请输入搜索账号"
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
        {routerContant("/auth.admgroup/add") ? (
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
            dataIndex="id"
            key="id"
            fixed="left"
          /> */}
          <Column align="center" title="名称" dataIndex="name" key="name" />
          <Column
            align="center"
            title="添加时间"
            dataIndex="createtime"
            key="createtime"
          />
          <Column
            align="center"
            title="用户人数"
            dataIndex="people_num"
            key="people_num"
          />
          <Column
            align="center"
            title="状态"
            dataIndex="status"
            key="status"
            render={(_, record) => <Tag color="#108ee9">{record.status}</Tag>}
          />
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
                    {routerContant("/auth.admgroup/del") ? (
                      <Button type="link" onClick={() => handlerDel(record)}>
                        删除
                      </Button>
                    ) : null}
                    {routerContant("/auth.admgroup/edit") ? (
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

        {isOpenModal ? (
          <Modal
            width={1200}
            title="新增数据"
            open={isOpenModal}
            onOk={handleOk}
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
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                ...formData,
              }}
              autoComplete="off"
            >
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: "请输入您的姓名" }]}
              >
                <Input placeholder="请输入您的姓名" />
              </Form.Item>
              <Form.Item
                label="状态"
                name="status"
                
              >
                <Switch
                  checked={formData.status === "1"}
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      status: e ? "1" : "2",
                    }))
                  }
                />
              </Form.Item>
              <Form.Item label="菜单">
                <Tree
                  onCheck={onCheck}
                  onSelect={onSelect}
                  defaultExpandAll
                  checkable
                  checkedKeys={formData.rules}
                  selectedKeys={formData.rules}
                  treeData={formOption.rule_list}
                />
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
