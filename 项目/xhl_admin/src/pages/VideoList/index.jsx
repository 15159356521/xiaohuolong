import React, { useCallback, useState, useEffect } from "react";
import {
  Card,
  Breadcrumb,
  Button,
  Table,
  Space,
  Image,
  Modal,
  Form,
  message,
  DatePicker,
  Input,
  Tag,
  Select,
  Upload,
} from "antd";
import { getRoleBtn } from "../../api/role";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useRef } from "react";

import {
  getVideoListById,
  getVideoListData,
  updateTaskListById,
  addTaskList,
  addTaskItem,
  deleteTaskListById,
  getOptions,
  searchTaskList,
} from "../../api/videoList";
import routerContant from "../../utils/constant";
import { baseIMgURL } from "../../utils/request";
const { Column } = Table;

export default function SubAccountCheck() {
  // const { state: {id} } = useLocation()
  const location = useLocation();
  const id = routerContant[location.pathname.split("/").pop()].split("-").pop();
  const [roleBtn, setRoleBtn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const formRef = useRef();
  const navigate = useNavigate();
  const [paginationPramas, setPaginationPramas] = useState({
    current: 1, //当前页码
    pageSize: 2, // 每页数据条数
    total: "", // 总条数
    onChange: (current, size) => handlePageChange(current, size), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: true,
  });
  const [formOption, setFormOption] = useState({
    status: "",
    review_ary: [],
  });
  const handlePageChange = (current, pageSize) => {
    setPaginationPramas((preState) => ({ ...preState, current, pageSize }));
  };
  const [formData, setFormData] = useState({
    add_time: "",
    img: "",
    content: "",
    introduction: "",
    label: "",
    subcontractorInfo: {
      name: "",
      phone: "",
    },
    videofile: {
      height: "",
      hot: "",
      often: "",
      size: "",
      src: "",
      type: "",
      width: "",
    },
    title: "",
    start_time: "",
    type: "",
  });
  const getAllSubAccountData = async () => {
    setLoading(true);
    const { code, resData, count } = await getVideoListData();
    setTableData(resData);
    setPaginationPramas((preState) => ({ ...preState, total: count }));
    setLoading(false);
  };
  useEffect(() => {
    (async function () {
      getAllSubAccountData();
      const { code, resData, count, msg } = await getRoleBtn(id);
      console.log(
        "🚀 ~ file: index.jsx ~ line 71 ~ code, resData, count, msg",
        code,
        resData,
        count,
        msg
      );
      if (code === 200) {
        setRoleBtn(resData.btn_list);
      } else if (code === 401) {
        message.warning(msg);
        navigate("/login", { replace: false, state: { id: id } });
      }
    })();
  }, []);

  // 修改、添加
  const handleOk = async () => {
    if (formData.id) {
      const fileds = await formRef.current.validateFields();
      console.log(fileds.review);
      const { code, msg } = await updateTaskListById(formData.id, {
        review: fileds.review,
      });
      if (code === 200) {
        getAllSubAccountData();
        message.success(msg);
        setIsOpenModal(false);
      } else {
        message.warning(msg);
        setIsOpenModal(false);
      }
    }
  };

  // 编辑操作
  const handlerEidt = async (record) => {
    try {
      const { msg, resData, code } = await getVideoListById(record.id);
      console.log(
        "🚀 ~ file: index.jsx ~ line 180 ~ handlerCheck ~ resData",
        resData
      );
      if (code === 200) {
        let obj = { ...formOption };
        obj.review_ary = resData.review_ary;
        console.log(obj);
        setFormOption(obj);
        // map遍历review_ary的key

        setFormData(resData.info);
        setIsOpenModal(true);
      } else {
        message.warning(msg);
        return;
      }
    } catch (error) {
      message.warning(error);
    }
    setIsOpenModal(true);
  };

  const handlerDel = () => {};

  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
  };

  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item href="#/subAccountCheck">子账号审核</Breadcrumb.Item>
        </Breadcrumb>

        {roleBtn.find((item) => item.title === "添加") ? (
          <Button type="primary">添加</Button>
        ) : null}
        <Table
          scroll={{ x: 1400 }}
          pagination={paginationPramas}
          rowKey="id"
          dataSource={tableData}
          loading={loading}
          style={{ marginTop: "20px" }}
        >
          <Column
            align="center"
            title="id"
            dataIndex="id"
            key="id"
            fixed="left"
          />
          <Column
            align="center"
            title="子账号名称"
            dataIndex="name"
            key="name"
            render={(_, record) => <>{record.subcontractorInfo.name}</>}
          />
          <Column
            align="center"
            title="子账号账号"
            dataIndex="phone"
            key="phone"
            render={(_, record) => <>{record.subcontractorInfo.phone}</>}
          />
          <Column
            align="center"
            title="添加时间"
            dataIndex="add_time"
            key="add_time"
          />
          <Column
            align="center"
            title="视频标题"
            dataIndex="title"
            key="title"
          />
          <Column align="center" title="标签" dataIndex="label" key="label" />
          <Column
            align="center"
            title="封面"
            dataIndex="img"
            key="img"
            render={(_, record) => (
              <Image
                preview={{
                  imgVisible: false,
                }}
                src={baseIMgURL + record.img}
              />
            )}
          />
          <Column
            align="center"
            title="审核状态"
            dataIndex="status"
            key="status"
            render={(_, record) => (
              <>
                {record.videofile.review === -1 && (
                  <Tag color="#f50">未审核</Tag>
                )}
                {record.videofile.review === 1 && (
                  <Tag color="#2db7f5">AI审核通过</Tag>
                )}
                {record.videofile.review === 2 && (
                  <Tag color="#87d068">人工审核通过</Tag>
                )}
                {record.videofile.review === 3 && (
                  <Tag color="#108ee9">AI审核不过，人工介入</Tag>
                )}
                {record.videofile.review === 4 && (
                  <Tag color="#f00000">人工审核不通过</Tag>
                )}
              </>
            )}
          />
          <Column
            align="center"
            title="简介"
            dataIndex="introduction"
            key="introduction"
          />
          <Column align="center" title="类型" dataIndex="type" key="type" />
          <Column
            align="center"
            title="操作"
            key="operation"
            fixed="right"
            render={(_, record) => (
              <Space size="middle">
                {roleBtn.find((item) => item.title === "删除") ? (
                  <Button type="link" onClick={() => handlerDel(record)}>
                    删除
                  </Button>
                ) : null}
                {roleBtn.find((item) => item.title === "审核") ? (
                  <Button type="link" onClick={() => handlerEidt(record)}>
                    审核
                  </Button>
                ) : null}
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
            okText="确定"
            cancelText="取消"
          >
            <Form
              ref={formRef}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                ...formData,
                phone: formData.subcontractorInfo.phone,
                name: formData.subcontractorInfo.name,
                review: formOption.review_ary[formData.videofile.review],
              }}
              autoComplete="off"
            >
              <Form.Item
                label="id"
                name="id"
                rules={[{ required: true, message: "请输入您的id" }]}
              >
                <Input disabled placeholder="请输入您的id" />
              </Form.Item>
              <Form.Item
                label="子账号名称"
                name="name"
                rules={[{ required: true, message: "请输入您的子账号名称" }]}
              >
                <Input disabled placeholder="请输入您的子账号名称" />
              </Form.Item>
              <Form.Item
                label="添加时间"
                name="phone"
                rules={[{ required: true, message: "请输入您的添加时间" }]}
              >
                <Input disabled placeholder="请输入您的添加时间" />
              </Form.Item>
              <Form.Item
                label="视频标题"
                name="title"
                rules={[{ required: true, message: "请输入您的视频标题" }]}
              >
                <Input disabled placeholder="请输入您的视频标题" />
              </Form.Item>
              <Form.Item
                label="标签"
                name="label"
                rules={[{ required: true, message: "请输入您的视频标签" }]}
              >
                <Input disabled placeholder="请输入您的视频标签" />
              </Form.Item>
              <Form.Item
                label="简介"
                name="introduction"
                rules={[{ required: true, message: "请输入您的简介" }]}
              >
                <Input disabled placeholder="请输入您的简介" />
              </Form.Item>
              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: "请输入您的类型" }]}
              >
                <Input disabled placeholder="请输入您的类型" />
              </Form.Item>
              <Form.Item
                label="状态"
                name="review"
                // initialValue={formOption.review_ary[formData.videofile.review]}
                // initialValue={-1}
                rules={[{ required: true, message: "请选择您的状态" }]}
              >
                {formData.videofile.review === 3 ? (
                  <Select
                    placeholder="请选择您的状态"
                    onChange={(key) => {
                      // console.log(key);
                      let obj = {};
                      obj = { ...formOption };
                      obj.status = key;
                      // console.log(obj);
                      setFormOption(obj);
                    }}
                    allowClear
                  >
                    {" "}
                    <Select.Option value={-1} key={-1}>
                      未审核
                    </Select.Option>
                    <Select.Option value={2} key={2}>
                      人工审核通过
                    </Select.Option>
                    <Select.Option value={4} key={4}>
                      人工审核不通过
                    </Select.Option>
                  </Select>
                ) : (
                  // console.log(formOption.review_ary[formData.videofile.review]),
                  <Input
                    disabled
                    value={formOption.review_ary}
                    placeholder="请输入您的状态"
                  />
                )}
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
