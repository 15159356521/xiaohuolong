import React, { useState, useEffect } from "react";
import {
  Card,
  Breadcrumb,
  Button,
  Table,
  Modal,
  Form,
  message,
  Tag,
  Input,
  Image,
  Space,
  Radio

} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { baseIMgURL } from "@/utils/request";
import moment from "moment";
import styles from "./index.module.scss";
import { getAllList, PostUp } from "@/api/Feedback";

import { useRef } from "react";
import routerContant from "@/utils/constant";
const { Column } = Table;


export default function Index() {
  // const { state: {id} } = useLocation()
  const [upLogin, setUpLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState({ });
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
      ...search
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
    id: null,
    errimg: null,
    remark: null,
    apply_status: null,
    ticket: null,
  });
  useEffect(() => {
    (async function () {
      handlePageChange(paginationPramas.page, paginationPramas.limit);
    })();
  }, []);
  //  搜索管理员区
  // 表格区
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
    setSearch({});

    getAllList({
      page: 1,
      limit: 10,
    }).then((res) => {
      // console.log(res.data.code);
      if (res.data.code == 200) {
        setTableData(res.data.data);

        setPaginationPramas((preState) => ({
          ...preState,
          total: res.data.count,
        }));
        message.success("重置成功");
      }
    });
  };
  const handleOk = async (file) => {
    try{

    setUpLogin(true);
    const keyFormFields = await formRef.current.validateFields();
    console.log(
      "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ keyFormFields",
      keyFormFields
    );
    let data = null;

      data = await PostUp(formData.id,{
        ...formData,
      }).then((res) => {
        return res.data;
      });
setUpLogin(false);
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
          <Breadcrumb.Item>反馈意见</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
                 {routerContant("/tdb/index/a/tdb.Feedback/b/index") ? (
        <Card>
          <Form layout="inline" onFinish={onFinish} form={form}>
            <Form.Item label="故障类型" name="title">
              <Input
                placeholder="请输入故障类型"
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
            <Form.Item label="分类" name="status">
            <Radio.Group
              options={[
                { label: "全部", value: "" },
                { label: "已处理", value: 2 },
                { label: "未处理", value: 1 },
              ]}
              defaultValue=""
              onChange={(e) => {
                console.log(e.target.value);
                setSearch({ ...search, status: e.target.value });
              getAllList({
                  page: 1,
                  limit: 10,
                  title: search.title,
                  status: e.target.value,
                }).then((res) => {
                  // console.log(res.data.code);
                  if (res.data.code == 200) {
                    setTableData(res.data.data);

                    setPaginationPramas((preState) => ({
                      ...preState,
                      total: res.data.count,
                    }));
                  }
                }
                );
      
              }
              }
              optionType="button"
              buttonStyle="solid"
            />
            </Form.Item>
        
          </Form>
        </Card>
      ) : null}
          <Table
           scroll={{ x: 1000 }}
             pagination={{  hideOnSinglePage: false,
              showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,current:paginationPramas.page,onChange:(page,pageSize)=>{
              handlePageChange(page,pageSize)
            }}}
            rowKey="id"
            dataSource={tableData}
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            <Column align="center" title="用户id" dataIndex="user_id"  />
            <Column align="center" title="问题类型" dataIndex="title" />
            <Column align="center" title="具体情况" dataIndex="content" />
            <Column
              title="反馈图片"
              align="center" 
              dataIndex="avatar"
              render={(_, record) => (
                record.imgs.map(item=>{
                  return(
                  <>

                <Image
                  preview={{
                    imgVisible: false,
                  }}
                  src={`${item}`}
                />
</>)
                })

              )}
            />
                     <Column
              align="center"
              title="反馈时间"
              dataIndex="add_time"
              render={(_, record) => (
                <>{record.add_time!==null?moment(record.add_time).format("YYYY-MM-DD HH:mm:ss"):null}</>
              )}
            />
            <Column
              align="center"
              title="反馈处理"
              dataIndex="status"
              render={(_, record) => (
                <>
                  {record.status === 1 ?<Tag color="red">未处理</Tag>  :
                  <Tag color="#87d068">已处理</Tag>}
                </>
              )}
            />
   
            <Column
              align="center"
              title="回复消息"
              dataIndex="handler_content"
            />
                <Column
              align="center"
              title="回复人员"
              dataIndex="handler_admin_id"
            />
               {routerContant("/tdb/index/a/tdb.Feedback/b/edit") ? (
            <Column
              align="center"
              title="操作"
              key="operation"
              fixed="right"
              render={(_, record) => (
                <>

                  <Button onClick={() => handlerEidt(record)}>回复 </Button>
                </>
              )}
            />
          ) : null}
          </Table>
        </Card>
        {isOpenModal ? (
          <Modal
            width={500}
            title="反馈问题回复"
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
              
                <>
                  <Form.Item label="回复消息" name="handler_content">
                    <Input.TextArea onChange={e=>{
                      setFormData((preState) => ({
                        ...preState,
                        handler_content: e.target.value,
                      }));
                    }} />
                  </Form.Item>
                </>
           
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
