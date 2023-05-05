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
import {
  // 审核
  getAllList,
  getUp,
  PostUp,
  //   绑定

  getBindUp,
  PostBindUp,
  
  // 签约

  getSignUp,
  PostSignUp,
  
  // 签约
GetTrainUp,

  PostTrainUp,
//   绑定
// 解绑
DelBindUp,
// 回退
PostBackUp
} from "@/api/beauditindex";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import PreviewImage from "@/components/PreviewImage";
import styles from "./index.module.scss";
import { useRef } from "react";
import routerContant from "@/utils/constant";

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
    page: 1,
    limit: 10,
    total: "", // 总条数
    onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: true,
  });
  const [status, setStatus] = useState("1");
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
  const [formOption, setFormOption] = useState({
    device_id: { list: [], value: "" },
    status:{list:[],value:""},
    pack_id: { list: [], value: "" },
  });
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handlePageChange = (page, limit) => {
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({ page: page, limit: limit, name: search.name }).then((res) => {
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

    const { data } = await getAllList(value);
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
    setPaginationPramas((preState) => ({ ...preState,status:status, page: 1, limit: 10 }));
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
  function statuses(record) {
    console.log(status);

    switch (status) {
      case "1":
        return (
          <>
            {" "}
           
            <Button type="link" onClick={() => handlerEidt(record)}>
              审核
            </Button>
          </>
        );
      case "2":
        return (
          <>
            {" "}
            <Button type="link" onClick={() => handlerEidt(record)}>
              签约
            </Button>
          </>
        );
      case "3":
        return (
          <Button type="link" onClick={() => handlerEidt(record)}>
            通过
          </Button>
        );
      case "4":
        return (
          <Button type="link" onClick={() => handlerEidt(record)}>
           绑定设备
          </Button>
        );
      case "5":
        return (
          <Button type="link" onClick={() => handlerEidt(record)}>
            解绑设备
          </Button>
        );
      case "6":
        return (
          <Button type="link" onClick={() => handlerEidt(record)}>
            回退到审核
          </Button>
        );
      case "7":
        return (
          <Button type="link" onClick={() => handlerEidt(record)}>
            已注销
          </Button>
        );
    }
  }
  // 修改、添加
  const handleOk = async () => {
    if (formData.id) {
      // const fileds =  formRef.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",

        formData
      );
      // 校验keyForm
      const keyFormFields = await keyForm.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ keyFormFields",
        keyFormFields
      );
     let data=null
      if(status==1){
       data  = await PostUp(formData.id, {
        ...formData,
      }).then((res) => {
        return res.data;
    });;
      }else if(status==2){
    data  = await PostSignUp(formData.id, {
            ...formData,
          }).then((res) => {
            return res.data;
        });;
    }else if(status==3){
        data  = await PostTrainUp(formData.id).then((res) => {
                return res.data;
            });;
        }else if(status==4){
            data  = await PostBindUp(formData.id,{...formData}).then((res) => {
                return res.data;
            });;
        }else if(status==5){
            data  = await DelBindUp(formData.id).then((res) => {
                return res.data;
            });;
        }else if(status==6){
            data  = await PostBackUp(formData.id).then((res) => {
                return res.data;
            });;
        }

    // const  data  = await PostUp(formData.id, {
    //     ...formData,
    //   }).then((res) => {
    //     return res.data;
    // });
console.log(data);
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
      status: "",
      remark: "",
      pack_id: "",
    });
    // const { data } = await getAdd();
    // console.log(data.data.field[1].props.data, 6545);
  };

  // 编辑操作
  const handlerEidt = async (record) => {
    try {
      const obj = { ...formData };
      const id={id:record.id}
      let reqdata
      if(status==1){
       reqdata = await getUp(record.id).then((res) => {
            return res.data.data.field;
          });
      }else if(status==2){
        reqdata = await getSignUp(record.id).then((res) => {
            return res.data.data.field;
          });
    }else if(status==4){
        reqdata = await getBindUp(record.id).then((res) => {
            return res.data.data.field;
          });
    }else if(status==3){
        reqdata = await getUp(record.id).then((res) => {
            return res.data.data.field;
          });
    }else if(status==5){
        reqdata = await getUp(record.id).then((res) => {
            return res.data.data.field;
          });
    }else if(status==6){
        reqdata = await getUp(record.id).then((res) => {
            return res.data.data.field;
          });
    }else if(status==7){
        reqdata = await getUp(record.id).then((res) => {
            return res.data.data.field;
          });
    }
 const opt = { ...formOption };
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
        } else if (reqdata[a].options) {
        
            let key = reqdata[a].field;
            console.log(reqdata[a].field, "sdfgf");
            opt[key].list = reqdata[a].options;
            opt[key].value = reqdata[a].value;

            console.log(opt, "opt");
            // setSearchOpt( (preState) => ({ ...preState, group_id: reqdata[a].option }));
          } 
      }
      console.log(obj, "obj");
      setFormOption(opt);
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
      status: "",
      remark: "",
      sign_file_url: "",
        pack_id: "",
        device_id: "",
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
// 表单切换
function Change(){
    if(status==1){
        return <>
         <Form.Item
                label="审核状态"
                name="status"
                rules={[{ required: true, message: "请选择审核状态" }]}
              >
                <Select
                  placeholder="请选择审核状态"
                  onChange={(value) => {
                    console.log(value);
                    setFormData({
                      ...formData,
                      status: value,
                    });
                  }}
                >
                  <Option value="2">通过</Option>
                  <Option value="6">未通过</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="备注"
                name="remark"
                rules={[{ required: true, message: "请输入备注" }]}
              >
                <Input
                  placeholder="请输入备注或审核不通过的原因"
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      remark: value.target.value,
                    });
                  }}
                />
              </Form.Item>
        </>
    }else if(status==2){
        return <>
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
        </>
    }
   
}
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item href="#/newList">待审核店家</Breadcrumb.Item>
        </Breadcrumb>

        {routerContant("/auth.admgroup/index") ? (
          <Card>
            <Form layout="inline" onFinish={onFinish} form={form}>
              <Form.Item label="门店名称" name="shop_branch_name">
                <Input
                  placeholder="请输入店家名称"
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
              {/* 选择器 */}
              <Form.Item label="门店状态" name="status">
                <Select
                  placeholder="请选择门店状态"
                  allowClear
                  defaultValue="1"
                  style={{ width: 200 }}
                  onChange={(value) => {
                    setStatus(value);
                    let up = { page: 1, limit: 10, status: value,name:"" };
                    getAllList(up).then((res) => {
                      setTableData(res.data.data);
                      setPaginationPramas((preState) => ({
                        ...preState,
                        total: res.data.count,
                      }));
                       
                    });
                  }}
                >
                  <Option value="1">待审核</Option>
                  <Option value="2">待签约</Option>
                  <Option value="3">待培训</Option>
                  <Option value="4">已通过未投放 </Option>
                  <Option value="5">已通过已投放 </Option>
                  <Option value="6">未通过 </Option>
                  <Option value="7">已注销 </Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        ) : null}
        {/* {routerContant("/auth.admgroup/add") ? (
          <Button type="primary" onClick={() => handlerAdd()}>
            添加
          </Button>
        ) : null} */}
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
            title="店家id"
            dataIndex="id"
            key="id"
            fixed="left"
          />
          <Column
            align="center"
            title="公司名称"
            dataIndex="shop_branch_name"
          />
          <Column
            align="center"
            title="服务商收益2"
            dataIndex="real_name"
            render={(text, record) => (
              <div>{record.business_info.real_name}</div>
            )}
          />
          <Column
            align="center"
            title="联系人"
            dataIndex="thcShopInfo"
            render={(text, record) => <div>{record.thcShopInfo.real_name}</div>}
          />
          <Column
            align="center"
            title="联系方式"
            dataIndex="real_name"
            render={(text, record) => <div>{record.thcShopInfo.phone}</div>}
          />
          <Column align="center" title="省" dataIndex="province" />
          <Column align="center" title="市" dataIndex="city" />
          <Column align="center" title="具体地点" dataIndex="address" />

          <Column align="center" title="签约时间" dataIndex="created_at" />

          <Column
            align="center"
            title="操作"
            key="operation"
            fixed="right"
            render={(_, record) => (
              <Space size="middle">{statuses(record)}</Space>
            )}
          />
        </Table>

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
              {status==4?null:<>
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
                // rules={[{ required: true, message: "请上传证件照" }]}
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
              
              </>}
             
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
              {status==4?null:<>
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
                  { type: "object", required: true, message: "请输入营业时间" },
                ]}
              >
                {/* <Input placeholder="请输入详细地址" disabled /></Form.Item> */}
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
                  {fileList.shop_images.length >= 3
                    ? null
                    : "+ 请上传分店内照片"}
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
                    {Change()}
                
                </>}
                {status==4?<>        <Form.Item
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
              <Form.Item
                label="绑定设备"
                name="device_id"
                rules={[{ required: true, message: "请选择您的分类" }]}
              >
                <Select
                  placeholder="请选择分类"
                  showArrow
                  value="formOption.device_id.value"
                  onChange={(item) => {
                    setFormData((preState) => ({
                      ...preState,
                      device_id: item,
                    }));
                  }}
                  allowClear
                >
                  {formOption.device_id.list.map((item, index) => (
                    <Select.Option value={item.value} key={item.value}>
                      {console.log(item, "item")}
                      {item.label}
                    </Select.Option>
                    // console.log(item, "item")
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="备注"
                name="remark"
                rules={[{ required: true, message: "请输入备注" }]}
              >
                <Input
                  placeholder="请输入备注或审核不通过的原因"
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      remark: value.target.value,
                    });
                  }}
                />
              </Form.Item>
              </>:null}
           
            </Form>
          </Modal>
        ) : null}
      </Card>
      <PreviewImage preview={previewImage} key={previewOpen} previewOpen={previewOpen} handlePicCancel={handlePicCancel} />
    </div>
  );
}
