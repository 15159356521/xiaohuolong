import React, { useCallback, useRef, useState, useEffect } from "react";
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
  Image,
  Upload,
  Select,
  Row,
  Col,
  Tooltip,
  InputNumber,
} from "antd";
import styles from "./index.module.scss";
import {
  getAllList,
  getUp,
  PostUp,
  postDel,
  getShop,
  delShop,
  upShop,
  postShop,
} from "@/api/orderProduct.js";
import Editor from "@/components/Editor";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import update from "immutability-helper";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import routerContant from "@/utils/constant";
import { baseIMgURL } from "@/utils/request";
import PreviewImage from "@/components/PreviewImage";
const type = "DragableUploadList";
const { Column } = Table;
const { Option } = Select;
const DragableUploadListItem = ({ originNode, moveRow, file, fileList }) => {
  const ref = useRef(null);
  const index = fileList.indexOf(file);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward",
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: {
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  const errorNode = (
    <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>
  );
  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${
        isOver ? dropClassName : ""
      }`}
      style={{
        cursor: "move",
      }}
    >
      {file.status === "error" ? errorNode : originNode}
    </div>
  );
};
export default function Index() {
  const [commodityData, setCommodityData] = useState({ shop_img: [], sort: 0 });
  const [upLogin, setUpLogin] = useState(false);
  const [sendLogin, setSendLogin] = useState(false);
  const [commodityModal, setCommodityModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [shopData, setShopData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState({});
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const [formOption, setFormOption] = useState({
    class: { list: [], value: "" },
  });
  // 图片预览
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handlePageChange = async (page, limit) => {
    setLoading(true);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    const {
      data: { data },
    } = await getAllList({
      page: page,
      limit: limit,
      ...search,
    });
    const new_list = data.data.map((org) => mapTree(org));
    setTableData(new_list);
    console.log(data);
    setFormOption((preState) => ({
      ...preState,
      class: { list: data.class, value: "" },
    }));
    setPaginationPramas((preState) => ({ ...preState, total: data.count }));
    setLoading(false);
  };
  const [fileList, setFileList] = useState({
    image: [],
    shop_img: [],
  });
  const [formRef] = Form.useForm();
  const [commodityForm] = Form.useForm();
  const [formData, setFormData] = useState({ image: [], sort: 0 });

  const getAllRoleGroupData = async () => {
    setLoading(true);

    const {
      data: { data },
    } = await getAllList();
    const new_list = data.data.map((org) => mapTree(org));
    console.log(new_list);
    setTableData(new_list);
    console.log(data);
    setFormOption((preState) => ({
      ...preState,
      class: { list: data.class, value: "" },
    }));
    setPaginationPramas((preState) => ({ ...preState, total: data.count }));
    setLoading(false);
  };
  const mapTree = (org) => {
    const haveChildren = Array.isArray(org.children) && org.children.length > 0;
    console.log(haveChildren, org, "sdfsf");
    return {
      ...org,
      key: org.goods_id + "",
      children: haveChildren ? org.children.map((i) => mapTree(i)) : null,
    };
  };
  useEffect(() => {
    (async function () {
      console.log(fileList, "sdffs");
      getAllRoleGroupData();
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
    // console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value);
    const { data } = await getAllList(up);
    // console.log(data);
    if (data.code === 200) {
      message.success("查询成功");
      const new_list = data.data.data.map((org) => mapTree(org));
      setTableData(new_list);

      setPaginationPramas((preState) => ({
        ...preState,
        total: data.data.data.total,
      }));
    } else {
      message.warning(data.msg);
      return;
    }
  };
  const onReset = async () => {
    form.resetFields();
    setPaginationPramas((preState) => ({ ...preState, page: 1, limit: 10 }));
    const {
      data: {
        code,
        data: { data, count },
      },
    } = await getAllList();
    console.log(data, code);
    if (code === 200) {
      message.success("重置成功");
      const new_list = data.map((org) => mapTree(org));
    console.log(new_list);
    setTableData(new_list);
      // setTableData(data);
      setPaginationPramas((preState) => ({
        ...preState,
        total: count,
      }));
    } else {
      message.warning("重置失败");
      return;
    }
  };
  // 表格区
  const columnsx = [
    {
      title: "sku名称",
      dataIndex: "goods_name",
      align: "center",
    },
    {
      title: "sku金额",
      dataIndex: "goods_price",
      align: "center",
    },
    {
      title: "是否支持积分折扣",
      dataIndex: "is_points_discount",
      align: "center",
    },
    {
      title: "sku状态",
      dataIndex: "status",
      align: "center",
    },
  ];
  // const [fileList, setFileList] = useState({image:[],shop_img:[]});

  const handleOk = async () => {
    let files = await formRef.validateFields();
    console.log(files);
    files.image = formData.image;
    files.status = files.status ? 10 : 20;
    files.is_points_discount = files.is_points_discount ? 1 : 0;
    files.id = formData.goods_id ? formData.goods_id : null;
    setUpLogin(true);
    try {
      const {
        data: { code, msg },
      } = await PostUp({
        ...files,
      });
      if (code == 200) {
        message.success({ content: msg, key: "dd" });
        setIsOpenModal(false);
        formRef.setFieldsValue({
          goods_name: "",
          goods_price: "",
          name: "",
          goods_no: "",
          content: "",
          sort: 0,
          status: "",
          is_points_discount: "",
        });
        setShopData([]);
        setFileList((preState) => ({ ...preState, image: [] }));
        setFormData((preState) => ({ image: [], sort: 0 }));
        if (formData.goods_id == null) {
          message.success({ content: "请在商品列表中添加修改sku", key: "dd" });
        } else {
          message.success({ content: "ddd", key: "dd" });
        }
        getAllRoleGroupData();
      } else {
        message.error({ content: msg, key: "dd" });
      }
    } catch (err) {
      console.log(err);
      setUpLogin(false);
    }
    setUpLogin(false);
  };
  const shopOk = async () => {
    try {
      setSendLogin(true);
      const fileds = await commodityForm.validateFields();
      console.log("🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds", fileds);

      fileds.shop_img = commodityData.shop_img;
      fileds.status = commodityData.status == "上架" ? 10 : 20;
      fileds.is_points_discount =
        commodityData.is_points_discount == "允许" ? 1 : 0;
      fileds.shop_num = fileds.sort;
      // fileds.goods_id=commodityData.id?commodityData.id:formData.goods_id
      if (commodityData.id) {
        fileds.goods_id = commodityData.id;
      } else {
        fileds.id = formData.goods_id;
      }
      console.log("🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds", fileds);

      const {
        data: { code, msg },
      } = await postShop({
        ...fileds,
      });
      if (code == 200) {
        message.success(msg);
        setCommodityModal(false);
        setSendLogin(false);
        handlerEidt(formData);
        commodityForm.setFieldsValue({
          goods_sku_name: "",
          goods_price: "",
          shop_img: "",
          goods_sku_no: "",
          is_points_discount: false,
          status: false,
          shop_num: "",
          sort: 0,
        });
        getAllRoleGroupData();
        setCommodityData((preState) => ({ shop_img: [], sort: 0 }));
        setFileList((preState) => ({ ...preState, shop_img: [] }));
      } else {
        setSendLogin(false);
      }
    } catch {
      setSendLogin(false);
      message.warning({ content: "操作失败", key: "up" });
    }
    setUpLogin(false);
  };
  const handlerOk = async (id) => {
    const { data } = await postDel(id);
    if (data.code == 200) {
      message.success(data.msg);
      getAllRoleGroupData();
    } else {
      message.warning(data.msg);
    }
  };

  const handlerDel = (record) => {
    Modal.confirm({
      title: `确定删除${record.goods_name}吗?`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: () => handlerOk(record.goods_id),
    });
  };

  // 点击添加按钮显示弹窗
  const handlerAdd = async () => {
    setIsOpenModal(true);
    formRef.setFieldsValue({
      sort: 0,
    });
    setFileList({ image: [], shop_img: [] });
  };
  // 编辑操作
  const handlerEidt = async (record) => {
    const {
      data: { data },
    } = await getUp(record.goods_id);
    const {
      data: { data: shopData },
    } = await getShop(record.goods_id);
    setShopData(shopData);
    formRef.setFieldsValue({ ...data });
    setFormData(data);
    getImg(data);
    setIsOpenModal(true);
  };
  // 商品子类别
  const columns = [
    { title: "属性", dataIndex: "goods_sku_name", align: "center" },
    { title: "价格", dataIndex: "goods_price", align: "center" },
    // { title: "库存", dataIndex: "shop_num" },
    {
      title: "图片",
      dataIndex: "shop_img",
      align: "center",
      render: (text, record) => {
        return (
          text.map((item) => {
            return <Image src={item} width={100} height={100} />;
          }) || ""
        );
      },
    },
    { title: "状态", dataIndex: "status", align: "center" },
    { title: "积分折扣", dataIndex: "is_points_discount", align: "center" },
    // {
    //   title: "状态",
    //   dataIndex: "shop_status",align:'center',
    //   render: (text, record) => {
    //     return text === 1 ? (
    //       <Tag color="blue">上架</Tag>
    //     ) : (
    //       <Tag color="red">下架</Tag>
    //     );
    //   },
    // },

    {
      title: "操作",
      dataIndex: "shop_id",
      align: "center",
      render: (text, record) => {
        return (
          <Space size="middle">
            {routerContant("/mall/index/a/goods.GoodsSkuc/b/addedit") ? (
              <Button
                onClick={async () => {
                  setCommodityModal(true);
                  const {
                    data: { data },
                  } = await upShop({ ids: record.id });
                  setCommodityData(data[0]);
                  commodityForm.setFieldsValue({ ...data[0] });
                  commodityForm.setFieldsValue({
                    is_points_discount:
                      data[0].is_points_discount == "允许" ? true : false,
                    status: data[0].shop_status == "上架" ? true : false,
                  });
                  console.log(commodityForm.getFieldValue("status"), "eeee");
                  getImg(data[0]);
                }}
              >
                编辑
              </Button>
            ) : null}
            {routerContant("/mall/index/a/goods.GoodsSkuc/b/del") ? (
              <Button
                onClick={async () => {
                  Modal.confirm({
                    title: `确定删除${record.goods_sku_name}吗?`,
                    icon: <ExclamationCircleOutlined />,
                    okText: "确认",
                    cancelText: "取消",
                    onOk: async () => {
                      const {
                        data: { code, msg },
                      } = await delShop(record.id);
                      if (code == 200) {
                        message.success(msg);
                        handlerEidt(formData);
                      }
                    },
                  });
                }}
              >
                删除
              </Button>
            ) : null}
          </Space>
        );
      },
    },
  ];
  // 显示图片
  const handlePreview = async (file) => {
    console.log(file);
    setPreviewImage(file.url || `${baseIMgURL}${file.response.data.url}`);
    setPreviewOpen(true);
  };
  // 取消预览
  const handlePicCancel = () => {
    setPreviewOpen(false);
  };
  // 弹窗取消逻辑
  const handleCancel = () => {
    formRef.setFieldsValue({
      goods_name: "",
      image: "",
      goods_price: "",
      name: "",
      goods_no: "",
      content: "",
      sort: 0,
      status: "",
      is_points_discount: "",
    });
    setFormData({ image: [], sort: 0 });
    setIsOpenModal(false);
    setUpLogin(false);
  };
  //   上传图片
  const onUpdataChange = async ({ fileList: newFileList }, name) => {
    setFileList({ ...fileList, [name]: newFileList });
    // let new_list=await newFileList[newFileList.length - 1].response.code === 200?newFileList[newFileList.length - 1]:[]
    // let arr = [];
    // arr.push(new_list.response.data.url);
    // setCommodityData((preState) => ({
    //         ...preState,
    //         [name]: arr,
    //       }));
    if (newFileList[newFileList.length - 1]?.response?.code === 200) {
      console.log(newFileList, "newFileList");
      if (name == "image") {
        let arr = [...formData[name]];
        arr.push(
          `${baseIMgURL}${
            newFileList[newFileList.length - 1].response.data.url
          }`
        );
        console.log(arr, "arr");
        setFormData((preState) => ({
          ...preState,
          [name]: arr,
        }));
      } else {
        let arr = [];
        await newFileList.map((item) => {
          if (item.status == "done") {
            if (item.url) {
              arr.push(item.url);
            } else {
              arr.push(`${baseIMgURL}${item.response.data.url}`);
            }
            console.log(arr, "arr");
          }
        });
        console.log(newFileList);
        setCommodityData((preState) => ({
          ...preState,
          [name]: arr,
        }));
      }
    }

    // setFormData((preState) => ({ ...preState, [name]: file.fileList }));
  };
  const getImg = (res) => {
    for (let a in res) {
      // console.log(reqdata.data[a], 123);
      let arr = [];
      // 判断是是不是数组类型
      if (a == "image" || a == "shop_img") {
        if (res[a].length > 0) {
          // console.log(reqdata.data[a], 123);
          res[a].map((item, index) => {
            console.log(item, 123);

            // 判断是不是对象
            arr.push({
              uid: index,
              name: "xxx.png",
              status: "done",
              url: item,
            });
            fileList[a] = arr;

            console.log(arr, "arr");
          });
        }
      }
      setFileList(fileList);
    }
  };
  // 删除图片
  const handleRemove = (file, name) => {
    let arr = fileList[name].filter((item) => item.uid !== file.uid);

    setFileList({ ...fileList, [name]: arr });

    if (name == "image") {
      // formData.image.filter((item) => {
      //   return console.log(file, item, "item"), item !== file.url;
      // });
      console.log(Remove(formData.image, file));
      setFormData({
        ...formData,
        image: Remove(formData.image, file),
      });
    } else {
      console.log(commodityData[name].filter((item) => item.uid !== file.uid));

      setCommodityData({
        ...commodityData,
        [name]: Remove(commodityData[name], file),
      });
    }
  };
  const Remove = (file, item) => {
    console.log(file, item, "item");
    if (item.url) {
      let arr = file;
      for (let i = 0; i < file.length; i++) {
        let a = file.indexOf(item.url);
        console.log(a, "aq");
        if (a != -1) {
          file.splice(a, 1);
          arr = file;
          console.log(arr);
          console.log(i, "qqqq");
          break;
        }
      }
      console.log(arr, 1);
      return arr;
    } else {
      console.log(item, 2);
      return file.filter(
        (item1) => item1 !== `${baseIMgURL}${item.response.data.url}`
      );
    }
  };
  // 拖动

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = fileList.shop_img[dragIndex];
      console.log(dragRow, "dragRow");
      // 更新fileList里的shop_img
      setFileList({
        ...fileList,
        shop_img: update(fileList.shop_img, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      });
      // 更新commodityData里的shop_img
      setCommodityData({
        ...commodityData,
        shop_img: update(commodityData.shop_img, {
          $splice: [
            [dragIndex, 1],
            [
              hoverIndex,
              0,
              dragRow.url || `${baseIMgURL}${dragRow.response.data.url}`,
            ],
          ],
        }),
      });

      // setFileList(
      //   update(fileList.shop_img, {
      //     $splice: [
      //       [dragIndex, 1],
      //       [hoverIndex, 0, dragRow],
      //     ],
      //   }),
      // );
    },
    [fileList]
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.root}>
        <Card>
          <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>产品列表</Breadcrumb.Item>
          </Breadcrumb>
          {routerContant("/mall/index/a/goods.Goodsc/b/index") ? (
            <Card>
              <Form layout="inline" onFinish={onFinish} form={form}>
                <Form.Item label="商品名称" name="commodity">
                  <Input
                    placeholder="请输入搜索的商品"
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </Form.Item>
                <Form.Item label="分类" name="recommended">
                  <Select
                    placeholder="请选择"
                    showArrow
                    onChange={(item) => {}}
                    allowClear
                  >
                    {formOption.class.list.map((item, index) => {
                      return (
                        <Option key={item.name} value={item.name}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
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
            {routerContant("/mall/index/a/goods.Goodsc/b/addedit") ? (
              <Button type="primary" onClick={() => handlerAdd()}>
                添加
              </Button>
            ) : null}
            <Table
          scroll={{ x: 750 }}
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
              // expandedRowRender={expandedRowRender}
              expandedRowRender={(record) => {
                return (
                  <Table
                    rowKey={record.id}
                    columns={columnsx}
                    dataSource={record.children}
                    pagination={false}
                  />
                );
              }}
              expandedRowKeys={tableData.id}
              childrenColumnName="childrenX"
              rowKey={tableData.id}
              dataSource={tableData}
              loading={loading}
              style={{ marginTop: "20px" }}
            >
              <Column
                align="center"
                title="商品名称"
                dataIndex="goods_name"
          
              />
              {/* <Column
              align="center"
              title="商品图片"
              dataIndex="image"
              width={100}
              render={(_, record) => (
                <Image
                  preview={{
                    imgVisible: false,
                  }}
                  src={`${record.image}`}
                />
              )}
            /> */}
              <Column
                align="center"
                title="商品分类"
                dataIndex="name"
                key="content"
              />
              <Column align="center" title="sku数量" dataIndex="count" />
              <Column
                align="center"
                title="状态"
                dataIndex="commodity_status"
                key="status"
                render={(_, record) => (
                  <>
                    {record.status === 10 ? (
                      <Tag color="#108ee9">上架中</Tag>
                    ) : (
                      <Tag color="red">下架</Tag>
                    )}
                  </>
                )}
              />
              {/* <Column
              align="center"
              title="积分折扣"
              dataIndex="sort"
              render={(_, record) => (
                <>
                  {record.is_points_discount === 1 ? (
                    <Tag color="green">支持</Tag>
                  ) : (
                    <Tag color="blue">不支持</Tag>
                  )}
                </>
              )}
            /> */}
              <Column align="center" title="价格" dataIndex="goods_price" />
              <Column align="center" title="创建时间" dataIndex="create_time" />
              <Column
                align="center"
                title="操作"
                key="operation"
              
                render={(_, record) => (
                  <Space size="middle">
                    {routerContant("/mall/index/a/goods.Goodsc/b/del") ? (
                      <Button type="link" onClick={() => handlerDel(record)}>
                        删除
                      </Button>
                    ) : null}
                    {routerContant("/mall/index/a/goods.Goodsc/b/addedit") ? (
                      <Button
                        type="link"
                        key="edit"
                        onClick={() => handlerEidt(record)}
                      >
                        修改/添加sku
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
              title={formData.goods_id ? "编辑" : "添加"}
              open={isOpenModal}
              afterClose={() => formRef.resetFields()}
              onCancel={handleCancel}
              zIndex={20}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  取消
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={upLogin}
                  onClick={handleOk}
                >
                  确定
                </Button>,
              ]}
            >
              <Form
                form={formRef}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                initialValues={{
                  ...formData,
                }}
                autoComplete="off"
              >
                <Form.Item
                  label="商品名称"
                  name="goods_name"
                  rules={[{ required: true, message: "请输入商品标题" }]}
                >
                  <Input placeholder="请输入商品标题" />
                </Form.Item>
                {/* <Form.Item
                label="封面"
                name="image"
                rules={[{ required: true, message: "请选择您的封面" }]}
              >
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList.image}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemove(file, "image")}
                  onChange={(info) => onUpdataChange(info, "image")}
                >
                  {fileList.image.length >= 1 ? null : "+ 请上传封面浏览图"}
                </Upload>
              </Form.Item> */}
                {/* <Form.Item
                label="商品价格"
                name="goods_price"
                rules={[{ required: true, message: "请输入商品标题" }]}
              >
                <InputNumber placeholder="请输入商品价格" />
              </Form.Item> */}
                <Form.Item
                  label="商品分类"
                  name="name"
                  rules={[{ required: true, message: "请选择您的类型" }]}
                >
                  <Select placeholder="请选择分类" showArrow allowClear>
                    {formOption.class.list.map((item, index) => (
                      <Select.Option value={item.name} key={item.name}>
                        {item.name}
                      </Select.Option>
                      // console.log(item, "item")
                    ))}
                  </Select>
                </Form.Item>
                {/* <Form.Item
                label="介绍"
                name="content"
                rules={[{ required: true, message: "请输入介绍您的商品" }]}
              >
                <Input placeholder="请输入介绍您的商品" />
              </Form.Item> */}
                {/* <Form.Item
                label="商品编号"
                name="goods_no"
                rules={[{ required: true, message: "请输入商品编号" }]}
              >
                <Input placeholder="请输入商品编号" />
              </Form.Item> */}

                {formData.goods_id ? (
                  <Form.Item label="商品种类">
                    <>
                      {routerContant(
                        "/mall/index/a/goods.GoodsSkuc/b/addedit"
                      ) ? (
                        <Button
                          type="primary"
                          onClick={() => {
                            setCommodityModal(true);
                            setFileList((preState) => ({
                              ...preState,
                              shop_img: [],
                            }));
                          }}
                        >
                          添加种类
                        </Button>
                      ) : null}
                      <Table   scroll={{ x: 750 }} columns={columns} dataSource={shopData}></Table>
                    </>
                  </Form.Item>
                ) : null}

                {/* <Form.Item label="商品种类">
                    <>
                      <Button
                        type="primary"
                        onClick={() => {
                          setCommodityModal(true);
                          setFileList((preState) => ({
                            ...preState,
                            shop_img: [],
                          }));
                        }}
                      >
                        添加种类
                      </Button>
                      <Table columns={columns} dataSource={shopData}></Table>
                    </>
                  </Form.Item> */}
                <Form.Item
                  label="商品详情"
                  name="content"
                  rules={[{ required: true, message: "请输入您的内容" }]}
                >
                  <Editor
                    content={formData.content}
                    getContent={(content) => {
                      console.log(content, "sdfsdf");
                      formRef.setFieldsValue({ content: content });
                      console.log(formRef.getFieldsValue(), "formRef");
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="排序"
                  name="sort"
                  rules={[
                    {
                      required: true,
                      message: "请输入商品排序",
                      pattern: new RegExp(/^[+]{0,1}(\d+)$/, "g"),
                      message: "请输入大于等于0的数字",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: 150 }}
                    placeholder="请输入商品排序"
                  />
                </Form.Item>
                {formData.goods_id ? (
                  <Form.Item label="状态" name="status">
                    <Switch
                      checkedChildren="上架"
                      unCheckedChildren="下架"
                      defaultChecked={formData.status == 10 ? true : false}
                    />
                  </Form.Item>
                ) : null}
                {/* <Form.Item label="状态" name="status">
                  <Switch
                    checkedChildren="上架"
                    unCheckedChildren="下架"
                    defaultChecked={formData.status == 10 ? true : false}
                  />
                </Form.Item> */}
              </Form>
            </Modal>
          ) : null}
        </Card>
        <PreviewImage preview={previewImage} key={previewOpen} previewOpen={previewOpen} handlePicCancel={handlePicCancel} />
        <Modal
          open={commodityModal}
          title="商品"
          zIndex={21}
          onCancel={async () => {
            setCommodityData({ shop_img: [], sort: 0 });
            commodityForm.setFieldsValue({
              goods_sku_name: "",
              goods_price: "",
              shop_img: "",
              goods_sku_no: "",
              is_points_discount: null,
              status: null,
              sort: 0,
            });
            setCommodityModal(false);
            setFileList((preState) => ({ ...preState, shop_img: [] }));
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                commodityForm.setFieldsValue({
                  goods_sku_name: "",
                  goods_price: "",
                  shop_img: "",
                  goods_sku_no: "",
                  is_points_discount: null,
                  status: null,
                  sort: 0,
                });
                setCommodityData({ shop_img: [], sort: 0 });

                setCommodityModal(false);
                setFileList((preState) => ({ ...preState, shop_img: [] }));
                console.log(commodityForm.getFieldValue("status"));
              }}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={sendLogin}
              onClick={shopOk}
            >
              确定
            </Button>,
          ]}
        >
          <Form
            form={commodityForm}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              ...commodityData,
            }}
            autoComplete="off"
          >
            <Form.Item
              label="商品子类"
              name="goods_sku_name"
              rules={[{ required: true, message: "请输入商品子类" }]}
            >
              <Input placeholder="请输入商品子类" />
            </Form.Item>
            <Form.Item
              label="封面"
              name="shop_img"
              rules={[{ required: true, message: "请选择您的封面" }]}
            >
              <Upload
                accept="image/*"
                action={"/common.upload/uploadImage"}
                listType="picture-card"
                fileList={fileList.shop_img}
                onPreview={handlePreview}
                // multiple={true}
                onRemove={(file) => handleRemove(file, "shop_img")}
                onChange={(info) => onUpdataChange(info, "shop_img")}
                itemRender={(originNode, file, currFileList) => (
                  <DragableUploadListItem
                    originNode={originNode}
                    file={file}
                    fileList={currFileList}
                    moveRow={moveRow}
                  />
                )}
              >
                {fileList.shop_img.length < 10 && "+上传图片"}
              </Upload>
            </Form.Item>
            <Form.Item
              label="价格"
              name="goods_price"
              rules={[{ required: true, message: "请输入商品价格" }]}
            >
              <InputNumber
                style={{ width: 150 }}
                placeholder="请输入商品价格"
              />
            </Form.Item>

            <Form.Item
              label="排序"
              name="sort"
              rules={[
                {
                  required: true,
                  message: "请输入商品排序",
                  pattern: new RegExp(/^[+]{0,1}(\d+)$/, "g"),
                  message: "请输入大于等于0的整数",
                },
              ]}
            >
              <InputNumber style={{ width: 150 }} keyboard={true} />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Switch
                checkedChildren="上架"
                unCheckedChildren="下架"
                checked={commodityData.status == "上架" ? true : false}
                onChange={(e) => {
                  console.log(e, "asfsdf");
                  console.log(commodityData.status === "下架");
                  console.log(e, "asfsdf大大大大大大");
                  e
                    ? setCommodityData((preState) => {
                        return { ...preState, status: "上架" };
                      })
                    : setCommodityData((preState) => {
                        return { ...preState, status: "下架" };
                      });
                }}
              />
            </Form.Item>
            <Form.Item label="积分折扣" name="is_points_discount">
              <Switch
                checkedChildren="支持"
                unCheckedChildren="不支持"
                checked={
                  commodityData.is_points_discount == "允许" ? true : false
                }
                onChange={(e) => {
                  console.log(e, "asfsdf");
                  console.log(commodityData.is_points_discount === "不允许");
                  console.log(e, "asfsdf大大大大大大");
                  e
                    ? setCommodityData((preState) => {
                        return { ...preState, is_points_discount: "允许" };
                      })
                    : setCommodityData((preState) => {
                        return { ...preState, is_points_discount: "不允许" };
                      });
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DndProvider>
  );
}
