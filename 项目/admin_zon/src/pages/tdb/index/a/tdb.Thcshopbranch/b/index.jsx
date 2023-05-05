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

  Select,
} from "antd";
import styles from "./index.module.scss";
import {
  getAllList,
  getUp,
  PostUp,
  PostAdd,
  PostDel,
} from "@/api/thcshopbranch";
import Editor from "@/components/Editor";
import { useRef } from "react";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import routerContant from "@/utils/constant";

const { Column } = Table;
export default function ManageSub() {
  // const { state: {id} } = useLocation()
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState({ name: "", phone: "" });
  const [paginationPramas, setPaginationPramas] = useState({
    // page: 1, //当前页码
    // pageSize: 2, // 每页数据条数
    total: "", // 总条数
    onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const [formOption, setFormOption] = useState({
    pack_id: { list: [], value: "" },
 
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
    thcShopInfo_shop_name: "",
    thcShopInfo_real_name: "",
    thcShopInfo_phone: "",
    shop_branch_name: "",
    province: "",
    city: "",
    district: "",
    address: "",
    pack_id:"",
    remark:""
  });
  const getAllRoleGroupData = async () => {
    setLoading(true);
    const {
      data: { data },
      count,
    } = await getAllList();
    console.log(data);
    setTableData(data);
    setPaginationPramas((preState) => ({ ...preState, total: count }));
    setLoading(false);
  };
  useEffect(() => {
    (async function () {
      getAllRoleGroupData();
      console.log(formOption, "formOption");
      console.log(formData, "formData");
      const opt = { ...formOption };
      const reqdata = await getUp(13).then((res) => {
        return res.data.data.field;
      });
      for (let a in reqdata) {
        // console.log(reqdata[a]);
        // if (reqdata[a].options) {
        //   console.log(reqdata[a].field, "option");
        //   let key = reqdata[a].field;
        //   opt[key].list = reqdata[a].options;
        //   opt[key].value = reqdata[a].value;

        //   console.log(opt, "opt");

        //   // setSearchOpt( (preState) => ({ ...preState, group_id: reqdata[a].option }));
        // } else {
        //   console.log(65465);
        // }
        setFormOption(opt);
      }
    })();
  }, []);
  //  搜索管理员区
  const [form] = Form.useForm();
  const onFinish = async (value) => {
    console.log(value, "sdfsf");
    for (let key in value) {
      if (value[key] == undefined) {
        value[key] = "";
      }
    }

    setSearch(value);
    const up = { shop_branch_name: value.shop_branch_name, page: 1, limit: 10 };
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
    setSearch({ title: "", class: "" });

    if (handlePageChange(1, 10)) {
      message.success("重置成功");
    }
  };
  // 表格区
  // 修改、添加
  const [fileList, setFileList] = useState([]);
  const handleOk = async (file) => {
    // let files = formRef.current.getFieldValue();
    // console.log(formData);
    if (formData.id) {
    
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",
 
        formData
      );
      PostUp(formData.id, {
        ...formData,
       
      }).then((res) => {
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
    
      console.log(
        "🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds",
    
        formData
      );
      const { data } = await PostAdd({
       

      });
      if (data.code === 400) {
        message.warning("新增失败");
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
      title: `确定解绑该设备吗?`,
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
      title: "",
      content: "",
      img: "",
      id: "",
      url: "",
    });
  };
  // 编辑操作
  const handlerEidt = async (record) => {
    const obj = { ...formData };
    const opt = { ...formOption };
    const reqdata = await getUp(record.id).then((res) => {
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
        obj.id = record.id;
        //  console.log(obj);
      }
      setFormOption(opt);

      setFormData(obj);
      // setFileList(formData.img);
    }

    setIsOpenModal(true);
    setIsOpenModal(true);
  };

  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
  };
  //   上传图片

  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item href="#/manageSub">健康信息</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <Form layout="inline" onFinish={onFinish} form={form}>
            <Form.Item label="门店名称" name="shop_branch_name">
              <Input
                placeholder="请输入门店名称"
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
        <Card>
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
              title="分点id"
              dataIndex="id"
              key="id"
              fixed="left"
            />

            <Column
              align="center"
              title="服务商"
              dataIndex="business_info"
              key="status"
              render={(text, record) => (
                <div>
                  {console.log(record, "record")}
                  {record.business_info.real_name}
                </div>
              )}
            />

            <Column
              align="center"
              title="详细地址"
              dataIndex="address"
              render={(text, record) => (
                <div>
                  {console.log(record, "record")}
                  {record.province + record.city + record.address}
                </div>
              )}
            />
            <Column
              align="center"
              title="联系电话"
              dataIndex="phone"
              key="status"
              render={(text, record) => (
                <div>
                  {/* {console.log(record, "record")} */}
                  {record.thcShopInfo.phone}
                </div>
              )}
            />
            <Column
              align="real_name"
              title="联系人"
              dataIndex="phone"
              key="status"
              render={(text, record) => (
                <div>
                  {/* {console.log(record, "record")} */}
                  {record.thcShopInfo.real_name}
                </div>
              )}
            />

            <Column align="center" title="店名" dataIndex="shop_branch_name" />
            <Column
              align="center"
              title="申请时间"
              dataIndex="created_at"
   
   
            />

            <Column
              align="center"
              title="设备编号"
              dataIndex="device_info"
              key="status"
              render={(text, record) => (
                <div>
                  {/* {console.log(record, "record")} */}
                  {record.device_info.device_code}
                </div>
              )}
            />
            <Column
              align="center"
              title="套餐类型"
              dataIndex="pack_info"
              key="status"
              render={(text, record) => (
                <div>
                  {/* {console.log(record, "record")} */}
                  {record.pack_info.title}
                </div>
              )}
            />

            <Column
              align="center"
              title="操作"
              key="operation"
              fixed="right"
              render={(_, record) => (
                <Space size="middle">
                  {routerContant(
                    "/tdb/index/a/tdb.Thcshopbranch/b/beunbind"
                  ) ? (
                    <Button type="link" onClick={() => handlerDel(record)}>
                      解绑设备
                    </Button>
                  ) : null}
                  {routerContant("/tdb/index/a/tdb.Thcshopbranch/b/edit") ? (
                    <Button
                      type="link"
                      key="edit"
                      onClick={() => handlerEidt(record)}
                    >
                      编辑
                    </Button>
                  ) : null}
                </Space>
              )}
            />
          </Table>
        </Card>
        {isOpenModal ? (
          <Modal
            width={1200}
            title="修改数据"
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
              }}
              autoComplete="off"
            >
              <Form.Item
                label="店名"
                name="shop_branch_name"
                rules={[{ required: true, message: "请输入您的标题" }]}
              >
                <Input
                  placeholder="请输入您的标题"
          
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="联系人"
                name="thcShopInfo_real_name"
                rules={[{ required: true, message: "请输入您的标题" }]}
              >
                <Input
                  placeholder="请输入您的标题"
          
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="联系方式"
                name="thcShopInfo_phone"
                rules={[{ required: true, message: "请输入您的标题" }]}
              >
                <Input
                  placeholder="请输入您的标题"
          
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="分点名称"
                name="shop_branch_name"
                rules={[{ required: true, message: "请输入您的标题" }]}
              >
                <Input
                  placeholder="请输入您的标题"
          
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="省"
                name="province"
                rules={[{ required: true, message: "请输入您的标题" }]}
              >
                <Input
                  placeholder="请输入您的标题"
          
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="市"
                name="city"
                rules={[{ required: true, message: "请输入您的标题" }]}
              >
                <Input
                  placeholder="请输入您的标题"
          
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="区"
                name="district"
                rules={[{ required: true, message: "请输入区" }]}
              >
                <Input
                  placeholder="请输入区"
          
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="详细地址"
                name="address"
                rules={[{ required: true, message: "请输入您的标题" }]}
              >
                <Input
                  placeholder="请输入您的标题"
          
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="套餐"
                name="pack_id"
                rules={[{ required: true, message: "请选择您的分类" }]}
              >
                <Select
                  placeholder="请选择分类"
                  showArrow
                  value="formOption.pack_id.value"
                  onChange={(item) => {
                    setFormData((preState) => ({
                      ...preState,
                      pack_id: item,
                    }));
                  }}
                  allowClear
                >
                  {formOption.pack_id.list.map((item, index) => (
                    <Select.Option value={item.value} key={item.value}>
                      {console.log(item, "item")}
                      {item.label}
                    </Select.Option>
                    // console.log(item, "item")
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="第三方跳转链接" name="remark">
                <Input
                  placeholder="请输入备注"
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      remark: e.target.value,
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
