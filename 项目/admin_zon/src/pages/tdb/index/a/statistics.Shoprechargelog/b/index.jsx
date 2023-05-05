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
  Tag,
  InputNumber,

} from "antd";
import styles from "./index.module.scss";
import { getAllList, PostAdd, PostUp } from "@/api/Shoprechargelog";

import { useRef } from "react";
import routerContant from "@/utils/constant";

const { Column } = Table;

export default function Index() {
  // const { state: {id} } = useLocation()
  const [upLogin, setUpLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState({ name: "", phone: "" });
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({
      page: page,
      limit: limit,
      name: search.name,
      phone: search.phone,
    }).then((res) => {
      // console.log(res.data.code);
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
    minute: null,
    phone: null,
  });
  const getAllRoleGroupData = async () => {
    setLoading(true);
    const { data } = await getAllList();
    console.log(data.reqdata);
    setTableData(data.data);

    // 将对象转换成数组


    setPaginationPramas((preState) => ({ ...preState, total: data.count }));
    setLoading(false);
    return true;
  };
  useEffect(() => {
    (async function () {
      handlePageChange(paginationPramas.page, paginationPramas.limit);
    })();
  }, []);
  //  搜索管理员区
  const [form] = Form.useForm();
  const onFinish = async (value) => {
    // console.log(value, "sdfsf");
    for (let key in value) {
      if (value[key] == undefined) {
        value[key] = "";
      }
    }

    setSearch(value);
    const up = { ...value, page: 1, limit: 10 };
    console.log("dfsdfsdf", up);
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

    if (getAllRoleGroupData()) {
      message.success({ content: "重置成功", key: "updatable" });
    }
  };
  // 表格区
  // 修改、添加
  const handleOk = async (file) => {
    try{

setUpLogin(true)
      PostAdd( {
        ...formData,
     
      }).then((res) => {
        // console.log(res, "修改");
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

      
    }catch{setUpLogin(false);}


  };

  // 点击添加按钮显示弹窗
  const handlerAdd = async () => {
    setIsOpenModal(true);
  };
  // 编辑操作
  const handlerEidt = async (record) => {
    setIsOpenModal(true);
  };
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
          <Breadcrumb.Item>店家分钟充值</Breadcrumb.Item>
        </Breadcrumb>
        {routerContant("/tdb/index/a/statistics.Shoprechargelog/b/addminute") ? (
        <Button type="primary" onClick={() => handlerAdd()}>
          添加
        </Button>
        ) : null}
        {routerContant("/tdb/index/a/statistics.Shoprechargelog/b/index") ? (
        <Card>
          <Table
            scroll={{ x: 1000 }}
            pagination={{  hideOnSinglePage: false,
              showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,page:paginationPramas.page,onChange:(page,pageSize)=>{
              handlePageChange(page,pageSize)
            }}}
            rowKey="id"
            dataSource={tableData}
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            <Column
              align="center"
              title="用户id"
              dataIndex="user_id"
              
            />
            <Column align="center" title="店家手机号" dataIndex="shop_phone" />
            <Column
              align="center"
              title="服务商名称"
              dataIndex="business_name"
            />
            <Column
              align="center"
              title="类型"
              dataIndex="role"
              key="status"
              render={(_, record) => (
                <Tag color="#108ee9">
                  {record.role === 0
                    ? "店家"
                    : record.role === 2
                    ? "会员"
                    : "服务商"}
                </Tag>
              )}
            />
            <Column
              align="center"
              title="操作类型"
              dataIndex="io"
              key="status"
              render={(_, record) => (
                <Tag color="#108ee9">
                  {record.io === 0 ? "增加分钟" : "分钟支出"}
                </Tag>
              )}
            />
            <Column align="center" title="分钟数" dataIndex="minute" />

            <Column align="center" title="说明" dataIndex="declare" />
            <Column
              align="center"
              title="操作人"
              dataIndex="operator_username"
            />
            <Column align="center" title="时间" dataIndex="created_at" />
            <Column
              align="center"
              title="操作后分钟数"
              dataIndex="remain_minute"
            />
          </Table>
        </Card>
        ) : null}
        {isOpenModal ? (
          <Modal
            width={500}
            title="分钟充值"
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
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 14 }}
              initialValues={{
                ...formData,
              }}
              autoComplete="off"
            >
              <Form.Item
                label="充值分钟"
                name="minute"
                rules={[
                  {
                    required: true,
                    message: "请输入分钟数",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: 200 }}
                  placeholder="请输入添加的分钟数"
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      minute: value,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                name="phone"
                label="店家手机号"
                rules={[
                  {
                    required: true,
                    message: "请选择你要充值的电话号码",
                     pattern: /^1[3456789]\d{9}$/,
                  },
                ]}
              >
                <Input
                  style={{
                    width: 200,
                  }}
                  placeholder="请输入要充值的电话号码"

                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    });
                  }}
                />
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
