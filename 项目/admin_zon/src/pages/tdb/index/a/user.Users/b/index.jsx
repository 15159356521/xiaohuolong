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
  Image,
  Upload,
} from "antd";
import styles from "./index.module.scss";
import { getAllList, getUp, PostUp, PostAdd, PostDel,getShop,getShopMinute } from "@/api/tdUser";
import { useRef } from "react";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import routerContant from "@/utils/constant";
import { baseIMgURL } from "@/utils/request";
const { Column } = Table;
export default function Index() {
  // const { state: {id} } = useLocation()
  const [upLogin, setUpLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isShopModal, setIsShopModal] = useState(false);
  const[isListModal,setIsListModal] = useState(false)
  const [search, setSearch] = useState({ name: "", phone: "" });
  const [id, setId] = useState("");
  const[shopId,setShopId] = useState("")
  const [shopList,setShopList] = useState([])
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  const [paginationPramas, setPaginationPramas] = useState({
  page: 1, //当前页码
   pageSize: 10, // 每页数据条数
    total: "", // 总条数
  });
  const [listPramas, setListPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total:"", // 总条数
  });
  const[shopPramas,setShopPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total:"", // 总条数
  })
  const handleListChange = (page, limit) => {
 
    setListPramas((preState) => ({ ...preState, page, limit }));
    // console.log(paginationPramas,'dsfgd');
    getShop(id,{
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
  const handleShopChange = (page, limit) => {
 
    setShopPramas((preState) => ({ ...preState, page, limit }));
    // console.log(paginationPramas,'dsfgd');
    getShopMinute({
      page: page,
      limit: limit,
      user_id:id,
      shop_id:shopId
    }).then((res) => {
      // console.log(res.data.code);
      if (res.data.code == 200) {
        setShopList(res.data.data);
        setShopPramas((preState) => ({
          ...preState,
          total: res.data.total,
        }));
      }
    });
  };
  const [fileList, setFileList] = useState([]);
  const [formOption, setFormOption] = useState({
    group_id: { list: [], value: "" },
    status: { list: [], value: "" },
  });
  const handlePageChange = (page, limit) => {
console.log(search,'search');
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
    group_id: "",
    name: "",
    phone: "",
    pwd: "",
    status: "",
  });
  const getAllRoleGroupData = async () => {
    setLoading(true);
    const { data, count } = await getAllList();
    
    console.log(data);
    setTableData(data.data);
    setPaginationPramas((preState) => ({ ...preState, total: count }));
    setLoading(false);
  };
  useEffect(() => {
    (async function () {
      getAllRoleGroupData();
      console.log(formOption, "formOption");
      console.log(formData, "formData");
      const opt = { ...formOption };
      const reqdata = await getUp(11).then((res) => {
        return res.data.data.field;
      });
      for (let a in reqdata) {
        console.log(reqdata[a]);
        if (reqdata[a].options) {
          console.log(reqdata[a].field, "option");
          let key = reqdata[a].field;
          opt[key].list = reqdata[a].options;
          opt[key].value = reqdata[a].value;

          console.log(opt, "opt");

          // setSearchOpt( (preState) => ({ ...preState, group_id: reqdata[a].option }));
        } else {
          console.log(65465);
        }
        setFormOption(opt);
      }
    })();
  }, []);
  //  搜索管理员区

  const onFinish = async (value) => {
    console.log(value, "sdfsf");
    setSearch(value);
    for (let key in value) {
      if (value[key] == undefined) {
        value[key] = "";
      }
    }
    const up = { name: value.name, phone: value.phone, page: 1, limit: 10 };
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
    setSearch({ name: "", phone: "" });
    const { data } = await getAllList({ page: 1, limit: 10, });
    console.log(data);
    if (data.code !== 400) {
      message.success({ content: "重置成功", key: "reset" });
      setTableData(data.data);
      setPaginationPramas((preState) => ({ ...preState,page:1,limit:10, total: data.count }));
    }
  };
  
  // 表格区
  // 修改、添加管理人员
  const handleOk = async (file) => {
    try{
       setUpLogin(true);
    let files = formRef.current.getFieldValue();
    console.log(files);
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
        setUpLogin(false);
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
      const fileds = await formRef.current.validateFields([
        "name",
        "status",
        "phone",
      ]);
      console.log(
        "🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds",
        fileds,
        formData
      );
      const { data } = await PostAdd({
        ...fileds,
        pwd: formData.pwd,
        status: formData.status,
        group_id: formData.group_id,
      });
      setUpLogin(false);
      if (data.code === 400) {
        message.warning("密码不能为空");
        return;
      } else {
        message.success(data.msg);
        getAllRoleGroupData();
        setIsOpenModal(false);
      }
    }
    }catch{
      setUpLogin(false);
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
      title: `确定删除${record.name}吗?`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: () => handlerOk(record.user_id),
    });
  };

  // 点击添加按钮显示弹窗
  const handlerAdd = async () => {
    setIsOpenModal(true);
    setFormData({
      group_id: "",
      name: "",
      phone: "",
      pwd: "",
      status: "",
    });
  };
  // 编辑操作
  const handlerEidt = async (record) => {
    const obj = { ...formData };
    const opt = { ...formOption };
    const reqdata = await getUp(record.user_id).then((res) => {
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
        obj.id = record.user_id;
        //  console.log(obj);
      }
      setFormOption(opt);

      setFormData(obj);
    }

    setIsOpenModal(true);
  };
// 详情
const handlerList = async (record) => {
  console.log(record);
  setIsListModal(true);
  setListPramas((preState) => ({ ...preState, page: 1,limit:10,}))
  let up = { limit: 10, page: 1 ,user_id:record.user_id};
  setId(record.user_id);
  getShop(record.user_id, { ...up }).then((res) => {
    console.log(res.data, "修改");
    setListPramas((preState) => ({
      ...preState,
      total: res.data.count,
    }));
    setList(res.data.data);
  });

};
const handList = async (record) => {
setShopPramas((preState) => ({
  ...preState,
  page: 1,
  limit: 10,
}));
  let up = { limit: 10, page: 1 ,user_id:id,shop_id:record.shop_id};
  setShopId(record.shop_id);
  const {data:{data}}=await getShopMinute( { ...up })
  setIsShopModal(true);
  setShopList(data);
};
  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
    setUpLogin(false);
  };
  const listCancel = () => {
    setList([])
    setIsListModal(false);
  };
  // 上传图片
  const onUpdataChange = ({ fileList: newFileList }) => {
    console.log(fileList, "sdfdfsfsd");
    setFileList(newFileList);
    if (newFileList[0]?.response?.code === 400) {
      message.warning(newFileList[0]?.response?.msg);
      setFormData((preState) => ({ ...preState, img: null }));
      setFileList([]);
      return;
    } else {
      setFormData((preState) => ({
        ...preState,
        img:
          newFileList.length === 0 ? null : newFileList[0]?.response?.data?.url,
      }));
    }
  };
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item >特定波会员</Breadcrumb.Item>
        </Breadcrumb>
        {routerContant("/user.users/index") ? (
        <Card>
          <Form layout="inline" onFinish={onFinish} form={form}>
            <Form.Item label="账号" name="phone">
              <Input
                placeholder="请输入搜索账号"
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
            <Form.Item label="名称" name="name">
              <Input
                placeholder="请输入搜索名称"
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
        ):null}
                <Card>
          {/* <Button type="primary" onClick={() => handlerAdd()}>
            添加
          </Button> */}
          <Table
            scroll={{ x: 800 }}
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
              title="id"
              dataIndex="user_id"
              key="user_id"
              fixed="left"
            /> */}
            <Column align="center" title="账号" dataIndex="phone" key="name"/>
            <Column align="center" title="名称" dataIndex="name" key="name" />
            <Column
            align="center" 
              title="头像"
              dataIndex="avatar"
              key="avatar"
              render={(_, record) => (
                <Image
                  preview={{
                    imgVisible: false,
                  }}
                  src={`${record.avatar}`}
                />
              )}
            />
            <Column
              align="center"
              title="登录时间"
              dataIndex="logintime"
              key="logintime"
            />
              {/* <Column
              align="center"
              title="当前分钟数"
              dataIndex="current_minute"
              render={(_, record) => (
                <>{record.tdbUsers.current_minute}</>
  )}

            /> */}
            <Column
              align="center"
              title="状态"
              dataIndex="status"
              key="status"
              render={(_, record) => (
                <Tag color="#108ee9">
                  {record.status === 1 ? "正常" : "异常"}
                </Tag>
              )}
            />
       
            <Column
              align="center"
              title="分钟余额"
              key="operation"
              
              render={(_, record) => (
                <Space size="middle">
                  
                    <>
                                  <Button
                          type="link"
                          key="edit"
                          onClick={() => handlerList(record)}
                        >
                          详情
                        </Button>
                    </>
                
                </Space>
              )}
            />
      
          </Table>
        </Card>
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
              // form={form}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                ...formData,
              }}
              autoComplete="off"
            >
              <Form.Item
                label="头像"
                name="avatar"
                rules={[{ required: true, message: "请选择您的封面" }]}
              >
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList}
                  onRemove={(file) => {
                    console.log(file);
                    formRef.current.setFieldsValue({
                      img: "",
                    });
                    setFormData({
                      ...formData,
                      img: "",
                    });
                    setFileList([]);
                  }}
                  onChange={onUpdataChange}
                >
                  {fileList.length < 1 && "+上传图片"}
                </Upload>
              </Form.Item>

              <Form.Item
                label="账号"
                name="phone"
                rules={[{ required: true, message: "请输入您的账号" }]}
              >
                <Input placeholder="请输入您的账号" />
              </Form.Item>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: "请输入您的名称" }]}
              >
                <Input placeholder="请输入您的名称" />
              </Form.Item>
              <Form.Item label="密码">
                <Input
                  placeholder="不修改密码留空添加账号时需"
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      pwd: e.target.value,
                    }))
                  }
                />
              </Form.Item>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: "请输入您的状态" }]}
              >
                <Switch
                  checked={formData.status === 1}
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      status: e ? 1 : 2,
                    }))
                  }
                />
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
            {isListModal ? (
         <Modal
         width={1200}
         title="分店"
         open={isListModal}
         onCancel={listCancel}
         footer={null}
       >
         <Table
           scroll={{ x: 800 }}
           pagination={{
            hideOnSinglePage: false,
            showSizeChanger: true,
            total: listPramas.total,
            pageSize: listPramas.limit,
            current: listPramas.page,
            onChange: (page, pageSize) => {
              handleListChange(page, pageSize);
            },
          }}
           rowKey="id"
           dataSource={list}
           loading={loading}
           style={{ marginTop: "20px" }}

         >
             <Column align="center" title="店名" dataIndex="remain_minute"
           render={(_, record) => (
            <>{record.shopInfo.shop_name}</>
)}
           />
           <Column align="center" title="分钟数" dataIndex="minute" />
         

           <Column align="center" title="操作" dataIndex="declare" 
           render={(_, record) => (
            <><Button onClick={()=>handList(record)}>查看明细</Button></>
)}
           />
         </Table>
       </Modal>
        ) : null}
         {isShopModal ? (
         <Modal
         width={1000}
         title="详情"
         open={isShopModal}
         onCancel={()=>setIsShopModal(false)}
         footer={null}
       >
         <Table
           scroll={{ x: 800 }}
           pagination={{
            hideOnSinglePage: false,
            showSizeChanger: true,
            total: shopPramas.total,
            pageSize: shopPramas.limit,
            current: shopPramas.page,
            onChange: (page, pageSize) => {
              handleShopChange(page, pageSize);
            },
          }}
           rowKey="id"
           dataSource={shopList}
           loading={loading}
           style={{ marginTop: "20px" }}

         >
              <Column align="center" title="店名" dataIndex="remain_minute"
           render={(_, record) => (
            <>{record.shopInfo.shop_name}</>
)}
           />
           <Column align="center" title="分钟数" dataIndex="minute" />
        

           {/* <Column align="center" title="操作" dataIndex="declare" 
           render={(_, record) => (
            <><Button onClick={()=>handList(record)}>查看明细</Button></>
)}
           /> */}
         </Table>
       </Modal>
        ) : null}
      </Card>
    </div>
  );
}
