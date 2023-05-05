import React, { useState, useEffect } from "react";
import {
  Upload,
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
  TimePicker,
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import { getAllList, getUp, PostUp } from "@/api/Startinglog";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { useRef } from "react";
import routerContant from "@/utils/constant";
import PreviewImage from "@/components/PreviewImage";
import moment from "moment";

const { Column } = Table;
const { Option } = Select;
export default function Index() {
  // const { state: {id} } = useLocation()
  //   console.log(routerContant[location.pathname]);
  // const id = routerContant[location.pathname]

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [paginationPramas, setPaginationPramas] = useState({
   page:1,
   limit:10,
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
    // hideOnSinglePage: false,
    // showSizeChanger: true,
  });
  const [search, setSearch] = useState({ name: "" });
  const [form] = Form.useForm();
  const keyForm = useRef(null);
  // 添加与编辑
  const [fileList, setFileList] = useState({
    sign_file_url: [],
    thcShopInfo_id_card_photo: [],
    thcShopInfo_bus_license_phone: [],
    shop_images: [],
    operator_card_photo: [],
    bus_license_phone: [],
  });
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handlePageChange = (page, limit) => {
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({ page: page, limit: limit, ...search}).then((res) => {
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
  const [formData, setFormData] = useState([]);
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
    })();
  }, []);
  // 搜索
  const onFinish = async (value) => {
    console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value);
    setSearch(value);
    setPaginationPramas((preState) => ({ ...preState, page: 1, limit: 10 }));
    const up = { ...value, page: 1, limit: 10 };
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
    setPaginationPramas((preState) => ({ ...preState, page: 1, limit: 10 }));
    setSearch({ });
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
    const keyFormFields = await keyForm.current.validateFields();
    if (formData.id) {
      // const fileds =  formRef.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",

        formData
      );
      const { data } = await PostUp(formData.id, {
        ...formData,
      });

      if (data.code === 200) {
        getNewListData();
        setIsOpenModal(false);
        message.success(data.msg);
      } else {
        setIsOpenModal(false);
        message.warning(data.msg);
      }
    }
    // else {
    //   // const fileds = await keyForm.current.validateFields();
    //   console.log(
    //     "🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds",
    //     // fileds,
    //     formData
    //   );
    //   const { code, msg } = await PostAdd({
    //     ...formData
    //   });
    //   if (code === 400) {
    //     message.warning(msg);
    //     return;
    //   } else {
    //     message.success(msg);
    //     getNewListData();
    //     setIsOpenModal(false);
    //   }
    // }
  };

  // 删除
  const handlerOk = async (id) => {
    // try {
    //   await getDel(id);
    //   await getNewListData();
    //   message.success("删除成功");
    // } catch (e) {
    //   message.warning("删除失败");
    // }
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
    setIsOpenModal(true);
    setFormData({
      thcShopInfo_shop_name: "",
      thcShopInfo_real_name: "",
      thcShopInfo_id_card_photo: "",
      thcShopInfo_bus_license_phone: "",
      shop_branch_name: "",
      province: "",
      city: "",
      district: "",
      address: "",
      start_time: "",
      end_time: "",
      employee_num: "",
      opening_date: "",
      base_flow_rate: "",
      business_format: "",
      bus_license_phone: "",
      shop_images: "",
      operator_card_photo: "",
      sign_file_url: "",
    });
    // const { data } = await getAdd();
    // console.log(data.data.field[1].props.data, 6545);
  };

  // 编辑操作
  const handlerEidt = async (record) => {
    try {
      const obj = { ...formData };
      const reqdata = await getUp(record.id).then((res) => {
        return res.data.data.field;
      });
      console.log(reqdata, 123);
      for (let a in reqdata) {
        // console.log(reqdata[a]);

        obj.id = record.id;

        let key = reqdata[a].field;
        obj[key] = reqdata[a].value;
        if (reqdata[a].type === "upload") {
          // console.log(reqdata[a].value, 123);
          reqdata[a].value.map((item, index) => {
            console.log(item, "item");
            fileList[key].push({
              uid: item,
              name: "xxx.png",
              status: "done",
              url: `${item}`,
            });
          });
          console.log(reqdata[a].value[0], "reqdata[a].value");
          // fileList[key]={
          //                        uid: -1,
          //             name: "xxx.png",
          //             status: "done",
          //             url: ` ${reqdata[a].value[0]}`,

          //       }

          // fileList[key]=reqdata[a].value[0]
          // fileList[key] =  {
          //     uid: -1,
          //     name: "xxx.png",
          //     status: "done",
          //     url: `${baseIMgURL}${reqdata[a].value}`,
          //   }
        }
      }
      console.log(obj, "obj");
      setFormData(obj);
      setFileList(fileList);
    } catch (error) {
      message.warning(error);
    }

    setIsOpenModal(true);
  }; // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
    setFormData({
      thcShopInfo_shop_name: "",
      thcShopInfo_real_name: "",
      thcShopInfo_id_card_photo: "",
      thcShopInfo_bus_license_phone: "",
      shop_branch_name: "",
      province: "",
      city: "",
      district: "",
      address: "",
      start_time: "",
      end_time: "",
      employee_num: "",
      opening_date: "",
      base_flow_rate: "",
      business_format: "",
      bus_license_phone: "",
      shop_images: "",
      operator_card_photo: "",
      sign_file_url: "",
    });
    setFileList({
      thcShopInfo_id_card_photo: [],
      thcShopInfo_bus_license_phone: [],
      shop_images: [],
      operator_card_photo: [],
      bus_license_phone: [],
      sign_file_url: [],
    });
  };
  // 预览图片
  const handlePreview = async (file) => {
    console.log(file);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  // 上传图片
  const handleChange = ({ fileList: newFileList }, name) => {
    console.log(newFileList, name);
    setFileList({ ...fileList, [name]: newFileList });
    if (newFileList[0]?.response?.code === 200) {
      setFormData((preState) => ({
        ...preState,
        [name]: newFileList[0].response.data.url,
      }));
    }

    // setFormData((preState) => ({ ...preState, [name]: file.fileList }));
    console.log(formData);
  };
  const handlePicCancel = () => {
    setPreviewOpen(false);
  };
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item >异常记录</Breadcrumb.Item>
        </Breadcrumb>

        {routerContant("/tdb/index/a/tdb.Startinglog/b/index") ? (
          <Card>
            <Form layout="inline" onFinish={onFinish} form={form}>
              <Form.Item label="设备编码" name="device_code">
                <Input
                  placeholder="请输入设备编码"
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
        {/* {routerContant("/auth.admgroup/add") ? (
          <Button type="primary" onClick={() => handlerAdd()}>
            添加
          </Button>
        ) : null} */}
        {routerContant("/tdb/index/a/tdb.Startinglog/b/index") ? (  
        <Table
          scroll={{ x: 1200 }}
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
           <Column
            align="center"
            title="设备编码"
            dataIndex="device_code"
            fixed="left"
            render={(text, record) => {
              return <>{record.deviceInfo.device_code}</>;
            }}
          />

          <Column align="center" title="会员id" dataIndex="user_id" />
          <Column
            align="center"
            title="使用时间"
            dataIndex="minute"
            render={(text, record) => {
              return <span>{record.minute}分</span>;
            }}
          />
          <Column
            align="center"
            title="服务商"  
                        dataIndex="real_name"
            render={(text, record) => {
              return (
                <span>
                  {record.businessInfo.real_name}
                </span>
              );
            }}
          />
           <Column
            align="center"
            title="服务店家"
            dataIndex="shopInfo`"
            render={(text, record) => {
              return (
                <span>
                  {record.shopInfo.shop_name}
                </span>
              );
            }}
          />
          <Column align="center" title="店家收益" dataIndex="shop_earnings" />
          <Column align="center" title="启动时间" dataIndex="created_at" />
          <Column align="center" title="订单id" dataIndex="order_id" />
          <Column
            align="center"
            title="开机模式"
            dataIndex="mode`"
            render={(text, record) => {
              return (
                <span>
                  {record.mode === 1
                    ? "免费"
                    : record.mode === 2
                    ? "定时"
                    : "微信支付"}
                </span>
              );
            }}
          />
     <Column
            align="center"
            title="开机模式"
            dataIndex="is_refund`"
            render={(text, record) => {
              return (
                <span>
                  {record.is_refund === 0
                    ? "未支付"
                    : record.is_refund === 1
                    ? "已支付"
                    :  record.is_refund === 2
                    ? "待退款"
                  :record.is_refund === 3
                    ? "已退款"
                    : "退款失败"}
                </span>
              );
            }}
          />
    
          {/* <Column
            align="center"
            title="操作"
            key="operation"
            fixed="right"
            render={(_, record) => (
              <Space size="middle">
                <>
                  <Button type="link" onClick={() => handlerEidt(record)}>
                    修改
                  </Button>
                </>
              </Space>
            )}
          /> */}
        </Table>
        ) : null}

        {isOpenModal ? (
          <Modal
            width={1200}
            title={formData.id ? "编辑" : "添加"}
            open={isOpenModal}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="确定"
            cancelText="取消"
          >
            <Form
              // form={keyForm}
              ref={keyForm}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 20 }}
              autoComplete="off"
              initialValues={{ ...formData }}
            >
              <Form.Item
                label="公司名称"
                name="thcShopInfo_shop_name"
                rules={[{ required: true, message: "请输入公司名称" }]}
              >
                <Input placeholder="请输入公司名称" disabled />
              </Form.Item>
              <Form.Item
                label="联系人"
                name="thcShopInfo_real_name"
                rules={[{ required: true, message: "请输入联系人" }]}
              >
                <Input placeholder="请输入联系人" disabled />
              </Form.Item>
              <Form.Item
                label="联系方式"
                name="thcShopInfo_phone"
                rules={[{ required: true, message: "请输入联系方式" }]}
              >
                <Input placeholder="请输入联系方式" disabled />
              </Form.Item>
              <Form.Item
                label="身份证"
                name="thcShopInfo_id_card_photo"
                rules={[{ required: true, message: "请上传证件照" }]}
              >
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList.thcShopInfo_id_card_photo}
                  onPreview={handlePreview}
                  disabled
                  onRemove={(file) => {
                    console.log(file);

                    setFormData({
                      ...formData,
                      thcShopInfo_id_card_photo: "",
                    });
                    // setFileList(...fileList,);
                  }}
                  onChange={(info) =>
                    handleChange(info, "thcShopInfo_id_card_photo")
                  }
                >
                  {fileList.thcShopInfo_id_card_photo.length >= 2
                    ? null
                    : "+ 请上传身份证正反面"}
                </Upload>
              </Form.Item>
              <Form.Item
                label="企业营业执照"
                name="thcShopInfo_bus_license_phone"
                rules={[{ required: true, message: "请上传证件照" }]}
              >
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  disabled
                  fileList={fileList.thcShopInfo_bus_license_phone}
                  onPreview={handlePreview}
                  onRemove={(file) => {
                    console.log(file);

                    setFormData({
                      ...formData,
                      thcShopInfo_bus_license_phone: "",
                    });
                    // setFileList(...fileList,);
                  }}
                  onChange={(info) =>
                    handleChange(info, "thcShopInfo_bus_license_phone")
                  }
                >
                  {fileList.thcShopInfo_bus_license_phone.length >= 1
                    ? null
                    : "+ 请上传身份证正反面"}
                </Upload>
              </Form.Item>
              <Form.Item
                label="分店名称"
                name="shop_branch_name"
                rules={[{ required: true, message: "请输入分店名称" }]}
              >
                <Input placeholder="请输入分店名称" disabled />
              </Form.Item>
              <Form.Item
                label="省"
                name="province"
                rules={[{ required: true, message: "请输入分店名称" }]}
              >
                <Input placeholder="请输入所在区入没有可不填" disabled />
              </Form.Item>
              <Form.Item
                label="市"
                name="city"
                rules={[{ required: true, message: "请输入分店名称" }]}
              >
                <Input placeholder="请输入所在区入没有可不填" disabled />
              </Form.Item>
              <Form.Item label="区" name="district">
                <Input placeholder="请输入所在区入没有可不填" disabled />
              </Form.Item>
              <Form.Item
                label="详细地址"
                name="address"
                rules={[{ required: true, message: "请输入详细地址" }]}
              >
                <Input placeholder="请输入详细地址" disabled />
              </Form.Item>
              <Form.Item
                label="营业时间"
                // name="start_time"
                rules={[
                  { type: "object", required: true, message: "请输入营业时间" },
                ]}
              >
                {/* <Input placeholder="请输入详细地址" disabled /></Form.Item> */}
                <TimePicker
                  disabled
                  defaultValue={moment(formData.start_time, "HH:mm:ss")}
                  onChange={(time, timeString) => {
                    console.log(time, timeString);
                    setFormData({
                      ...formData,
                      start_time: timeString,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="结束时间"
                // name="start_time"
                rules={[
                  { type: "object", required: true, message: "请输入营业时间" },
                ]}
              >
                {/* <Input placeholder="请输入详细地址" disabled /></Form.Item> */}
                <TimePicker
                  disabled
                  defaultValue={moment(formData.end_time, "HH:mm:ss")}
                  onChange={(time, timeString) => {
                    console.log(time, timeString);
                    setFormData({
                      ...formData,
                      end_time: timeString,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="开业时间"
                // name="start_time"
                rules={[
                  { type: "object", required: true, message: "请输入开业时间" },
                ]}
              >
                {console.log(formData.opening_date, "开业时间")}
                <DatePicker
                  disabled
                  defaultValue={moment(formData.opening_date, "YYYY-MM-DD")}
                  onChange={(time, timeString) => {
                    console.log(time, timeString);
                    setFormData({
                      ...formData,
                      opening_date: timeString,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="店员人数"
                name="employee_num"
                rules={[{ required: true, message: "请输入详细地址" }]}
              >
                <InputNumber placeholder="请输入详细地址" disabled />
              </Form.Item>
              <Form.Item
                label="基础人流量"
                name="base_flow_rate"
                rules={[{ required: true, message: "请输入基础人流量" }]}
              >
                <InputNumber placeholder="请输入基础人流量" disabled />
              </Form.Item>
              <Form.Item
                label="经营状态"
                name="business_format"
                rules={[{ required: true, message: "请输入经营状态" }]}
              >
                <Input placeholder="请输入经营状态" disabled />
              </Form.Item>
              <Form.Item
                label="分店营业执照"
                name="bus_license_phone"
                // rules={[{ required: true, message: "请上传证件照" }]}
              >
                <Upload
                  disabled
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList.bus_license_phone}
                  onPreview={handlePreview}
                  onRemove={(file) => {
                    console.log(file);

                    setFormData({
                      ...formData,
                      bus_license_phone: "",
                    });
                    // setFileList(...fileList,);
                  }}
                  onChange={(info) => handleChange(info, "bus_license_phone")}
                >
                  {fileList.bus_license_phone.length >= 1
                    ? null
                    : "+ 请上传分店营业执照"}
                </Upload>
              </Form.Item>
              <Form.Item
                label="分店内照片"
                name="shop_images"
                rules={[{ required: true, message: "请上传证件照" }]}
              >
                <Upload
                  disabled
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList.shop_images}
                  onPreview={handlePreview}
                  onRemove={(file) => {
                    console.log(file);

                    setFormData({
                      ...formData,
                      bus_license_phone: "",
                    });
                    // setFileList(...fileList,);
                  }}
                  onChange={(info) => handleChange(info, "shop_images")}
                >
                  {"+ 请上传分店内照片"}
                </Upload>
              </Form.Item>
              <Form.Item
                label="操作员身份证"
                name="operator_card_photo"
                rules={[{ required: true, message: "请上传证件照" }]}
              >
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList.operator_card_photo}
                  disabled
                  onPreview={handlePreview}
                  onRemove={(file) => {
                    console.log(file);

                    setFormData({
                      ...formData,
                      operator_card_photo: "",
                    });
                    // setFileList(...fileList,);
                  }}
                  onChange={(info) => handleChange(info, "operator_card_photo")}
                >
                  {fileList.operator_card_photo.length >= 2
                    ? null
                    : "+ 请上传操作员身份证正反照"}
                </Upload>
              </Form.Item>
              <Form.Item
                label="签约文件"
                name="sign_file_url"
                // rules={[{ required: true, message: "请上传证件照" }]}
              >
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList.sign_file_url}
                  onPreview={handlePreview}
                  onRemove={(file) => {
                    console.log(file);

                    setFormData({
                      ...formData,
                      sign_file_url: "",
                    });
                    // setFileList(...fileList,);
                  }}
                  onChange={(info) => handleChange(info, "sign_file_url")}
                >
                  {fileList.sign_file_url.length >= 1
                    ? null
                    : "+ 请上传签约文件"}
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </Card>
      <PreviewImage preview={previewImage} key={previewOpen} previewOpen={previewOpen} handlePicCancel={handlePicCancel} />
    </div>
  );
}
