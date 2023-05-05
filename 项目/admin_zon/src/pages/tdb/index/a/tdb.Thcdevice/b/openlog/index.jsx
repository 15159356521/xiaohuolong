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
import { getAllList, getUp, PostUp, PostRefund } from "@/api/openlog";
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
const { confirm } = Modal;
export default function Index() {
  // const { state: {id} } = useLocation()
  //   console.log(routerContant[location.pathname]);
  // const id = routerContant[location.pathname]

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [paginationPramas, setPaginationPramas] = useState({
    page: 1,
    limit: 10,
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
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
    console.log(search.name, limit, "sdgfsdf");
    getAllList({ page: page, limit: limit, ...search }).then((res) => {
      if (res.data.code == 200) {
        console.log(res.data);
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
    const up = {...paginationPramas };
    const { data:{data,count} } = await getAllList(up);
    console.log(data,count,"sdf");
    setTableData(data);
    setPaginationPramas((preState) => ({ ...preState, total: count }));

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
    const up = { ...value, ...paginationPramas };
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
    const { data } = await getAllList();
    console.log(data);
    if (data.code === 200) {
      message.success("重置成功");
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

        message.success(data.msg);
      } else {
        message.warning(data.msg);
      }
    }
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
  // const { data } = await getAdd();
  // console.log(data.data.field[1].props.data, 6545);

  // 弹窗取消逻辑
  const handleCancel = () => {
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
          <Breadcrumb.Item>开机记录</Breadcrumb.Item>
        </Breadcrumb>

        {routerContant("/auth.admgroup/index") ? (
          <Card>
            <Form layout="inline" onFinish={onFinish} form={form}>
              <Form.Item label="设备编号" name="device_code">
                <Input
                  placeholder="请输入设备编号"
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
        <Table
          scroll={{ x: 1200 }}
          // pagination={paginationPramas}
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
          <Column
            align="center"
            title="设备编码"
            dataIndex="device_code"
       
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
              return <span>{record.businessInfo.real_name}</span>;
            }}
          />
          <Column
            align="center"
            title="服务店家"
            dataIndex="shopInfo`"
            render={(text, record) => {
              return <span>{record.shopInfo.shop_name}</span>;
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
            title="开机状态"
            dataIndex="start_statue`"
            render={(text, record) => {
              return (
                <>
                  {record.is_refund === 1 ? (
                    <Tag color="#87d068">命令已发送</Tag>
                  ) : record.is_refund === 2 ? (
                    <Tag color="#2db7f5">启动成功</Tag>
                  ) : record.is_refund === 3 ? (
                    <Tag color="blue">已结束</Tag>
                  ) : (
                    <Tag color="#f50">启动超时</Tag>
                  )}
                </>
              );
            }}
          />
          <Column
            align="center"
            title="开机模式"
            dataIndex="is_refund`"
            render={(text, record) => {
              return (
                <>
                  {record.is_refund === 0 ? (
                    <Tag color="red">未支付</Tag>
                  ) : record.is_refund === 1 ? (
                    <Tag color="#108ee9">已支付</Tag>
                  ) : record.is_refund === 2 ? (
                    <Tag color="red">待退款</Tag>
                  ) : record.is_refund === 3 ? (
                    <Tag color="#87d068">已退款</Tag>
                  ) : (
                    <Tag color="#f50">退款失败</Tag>
                  )}
                </>
              );
            }}
          />
          <Column
            align="center"
            title="操作"
            key="operation"
           
            render={(_, record) => (
              <Space size="middle">
                <>
                  <Button
                    type="link"
                    disabled={record.is_refund != 1 ? true : false}
                    onClick={() => {
                      confirm({
                        title: "是否退款?",
                        onOk() {
                          PostRefund(record.id).then((res) => {
                            console.log(res);
                            if (res.data.code === 200) {
                              message.success("操作成功");
                              getNewListData();
                            } else {
                              message.error(res.data.msg);
                            }
                          });
                        },
                      });
                    }}
                  >
                    退分钟
                  </Button>
                </>
              </Space>
            )}
          />
        </Table>
      </Card>
      <PreviewImage preview={previewImage} key={previewOpen} previewOpen={previewOpen} handlePicCancel={handlePicCancel} />
    </div>
  );
}
