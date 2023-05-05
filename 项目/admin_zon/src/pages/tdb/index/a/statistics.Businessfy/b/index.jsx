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
} from "antd";
import styles from "./index.module.scss";
import { getAllList, getShop, PostUp } from "@/api/Businessfy";
import { useRef } from "react";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import routerContant from "@/utils/constant";
import {exportExcel } from "@/utils/exportExcel";

const { Column } = Table;
export default function Index() {
  // const { state: {id} } = useLocation()
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [ids, setIds] = useState("");
  const [title, setTitle] = useState("");
  const [list, setList] = useState([]);
  const [allTableData, setAllTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState({ });
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
  });
  const [listPramas, setListPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total:"", // 总条数
  });
  const handleListChange = (page, limit) => {
 
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    console.log(paginationPramas,'dsfgd');
    getShop(ids,{
      page: page,
      limit: limit,
    }).then((res) => {
      // console.log(res.data.code);
      if (res.data.code == 200) {
        setList(res.data.data);
        setListPramas((preState) => ({
          ...preState,
          total: res.data.total,
        }));
      }
    });
  };
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({
      page: page,
      limit: limit,
      ...search
    }).then((res) => {
      console.log(res.data);
      if (res.data.code == 200) {
        setTableData(res.data.data);
        let arr = [];
        arr.push(res.data.reqdata);
        console.log(arr, "e ");
        setAllTableData(arr);
        setPaginationPramas((preState) => ({
          ...preState,
          total: res.data.count,
        }));
      }
    });

  };
  const formRef = useRef();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    img: "",
    id: "",
    url: "",
  });
  const getAllRoleGroupData = async () => {
    setLoading(true);
    setPaginationPramas((preState) => ({ ...preState, page: 1, limit: 10 }));
    const { data } = await getAllList();
    console.log(data.data);
    setTableData(data.data);

    // 将对象转换成数组
    let arr = [];
    arr.push(data.reqdata);
    setAllTableData(arr);
    //   setAllTableData(data.reqdata)

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
    const { data } = await getAllList(up);
    console.log(data);
    if (data.code === 200) {
      message.success("查询成功");
      setTableData(data.data);
      let arr = [];
      arr.push(data.reqdata);
      setAllTableData(arr);
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
  const [fileList, setFileList] = useState([]);
  const handleOk = async (file) => {
    // let files = formRef.current.getFieldVal  ue();
    // console.log(formData);
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
        // console.log(res, "修改");
        if (res.data.code === 200) {
          getAllRoleGroupData();
          setIsOpenModal(false);
          message.success(res.data.msg);
        } else {
          setIsOpenModal(false);
          message.warning(res.data.msg);
        }
      });
    }
  };

  // 点击添加按钮显示弹窗
  const handlerAdd = async () => {
    setIsOpenModal(true);
    setFormData({
      title: "",
      content: "",
      img: "",
      id: "",
      url: "",
    });
  };
  // 编辑操作
  const handlerEidt = async (record) => {
    setIsOpenModal(true);
    let up = { limit: 10, page: 1 };
    setIds(record.id);
    setTitle(record.real_name);
    getShop(record.id, { ...up }).then((res) => {
      console.log(res.data.data, "修改");
      setList(res.data.data);
    });
  };

  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
  };
  // 导出excel表

  const doneExcel = () => {
    let up={limit:1000000000000000,page:1}
    let exc_data = [
      ['服务商ID', '姓名' ,'设备编码',"订单编码","服务商收益","创建时间"],

    ];
    message.loading({ content: "正在导出...", key: 1 });
    getShop(ids,{ ...up}).then((res) => {
      console.log(res.data.data, "修改");
      res.data.data.map((item) => {
        exc_data.push([
          item.business_id,
          item.businessInfo.real_name,
          item.deviceInfo.device_code,
          item.order_id,
          // item.created_at,
          item.business_earnings,
          item.created_at,
        ]);
      });
      exportExcel(`${title}`,exc_data);
      message.success({ content: "导出成功", key: 1 });
    });

  };
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>服务商收益记录</Breadcrumb.Item>
        </Breadcrumb>
        {routerContant("/tdb/index/a/statistics.Businessfy/b/index") ? (
        <Card>
          <Form layout="inline" onFinish={onFinish} form={form}>
            {/* <Form.Item label="服务商" name="real_name">
              <Input
                placeholder="请输入搜索的名字"
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item> */}
            <Form.Item label="手机号" name="phone">
              <Input
                placeholder="请输入搜索的手机号"
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
          <Table
            scroll={{ x: 1000 }}
            pagination={{ hideOnSinglePage: true }}
            rowKey="id"
            dataSource={allTableData}
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            <Column
              align="center"
              title="总店家数"
              dataIndex="count"
         
            />
            <Column
              align="center"
              title="累计收益"
              dataIndex="total_earnings"
            />

            <Column
              align="center"
              title="累计体现收益"
              dataIndex="total_withdraw_earnings"
            />
            <Column
              align="center"
              title="累计待提现收益"
              dataIndex="stay_withdraw_earnings"
            />
          </Table>
        </Card>

        <Card>
  
          <Table
            scroll={{ x: 1400 }}
            // pagination={paginationPramas}
            pagination={{  hideOnSinglePage: false,
              showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,current:paginationPramas.page,onChange:(page,pageSize)=>{
              handlePageChange(page,pageSize)
            }}}
            rowKey="id"
            dataSource={tableData}
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            {/* <Column
              align="center"
              title="服务商id"
              dataIndex="id"
              fixed="left"
            /> */}
            <Column align="center" title="服务商" dataIndex="real_name"  />
            <Column align="center" title="联系电话" dataIndex="phone" />
            <Column align="center" title="身份证号" dataIndex="idnum" />
            <Column
              align="center"
              title="累计收益"
              dataIndex="total_earnings"
            />
            <Column
              align="center"
              title="累计提现"
              dataIndex="total_withdraw_earnings"
            />
            <Column
              align="center"
              title="累计待提现"
              dataIndex="stay_withdraw_earnings"
            />
            <Column align="center" title="创建时间" dataIndex="created_at" />
            {routerContant("/tdb/index/a/statistics.Businessfy/b/log") ? (
            <Column
              align="center"
              title="操作"
              key="operation"            
              render={(_, record) => (
                <Space size="middle">
                
                    <Button
                      type="link"
                      key="edit"
                      onClick={() => handlerEidt(record)}
                    >
                      详情
                    </Button>
           
                </Space>
              )}
            />
            ) : null}
          </Table>
        </Card>
        {isOpenModal ? (
          <Modal
            width={1200}
            title="收益查看"
            open={isOpenModal}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="确定"
            footer={null}
            cancelText="取消"
          >
                  <Button onClick={doneExcel}>导出</Button>
            <Table
              scroll={{ x: 800 }}
              pagination={{total:listPramas.total,pageSize:listPramas.limit,page:listPramas.page,onChange:(page,pageSize)=>{
                handleListChange(page,pageSize)
              }}}
              rowKey="id"
              dataSource={list}
              loading={loading}
              style={{ marginTop: "20px" }}

            >
              <Column
                align="center"
                title="服务商id"
                dataIndex="business_id"
             
                fixed="left"
                render={(text, record) => (
                <>
                {record.business_id}
                </>
                  )}
              />
              <Column
                align="center"
                title="姓名"
                dataIndex="real_name"
                render={(text, record) => <>{record.businessInfo.real_name}</>}
              />
              <Column
                align="center"
                title="设备编码"
                dataIndex="device_code"
                render={(text, record) => <>{record.deviceInfo.device_code}</>}
              />
              <Column align="center" title="订单编号" dataIndex="order_id" />
         
              {/* <Column align="center" title="出厂时间" dataIndex="created_at" /> */}
              <Column align="center" title="服务商收益" dataIndex="business_earnings" />
              <Column align="center" title="创建时间" dataIndex="updated_at" />

            </Table>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
