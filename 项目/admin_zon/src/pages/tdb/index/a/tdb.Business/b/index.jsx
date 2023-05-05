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
  TimePicker,
  DatePicker,
  InputNumber,Select
} from "antd";
import {

  getAllList,

  getUp,
  PostAdd,
  PostUp,
} from "@/api/Business";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { useRef } from "react";
import routerContant from "@/utils/constant";
import PreviewImage from "@/components/PreviewImage";
import moment from 'moment';

const { Column } = Table;
const{Option}=Select
export default function Index() {
  // const { state: {id} } = useLocation()
  //   console.log(routerContant[location.pathname]);
  // const id = routerContant[location.pathname]

  const [loading, setLoading] = useState(false);
  const [upLogin, setUpLogin] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
    // hideOnSinglePage: false,
    // showSizeChanger: true,
  });
  const [search, setSearch] = useState({real_name:"",phone:""});
  const [form] = Form.useForm();
  const keyForm = useRef(null)
// 添加与编辑
const [fileList, setFileList] = useState({sign_file_url:[],thcShopInfo_id_card_photo:[],thcShopInfo_bus_license_phone:[],shop_images:[],operator_card_photo:[],bus_license_phone:[]});
const [previewTitle, setPreviewTitle] = useState('');
const [previewOpen, setPreviewOpen] = useState(false);
const [previewImage, setPreviewImage] = useState('');
  const handlePageChange = (page, limit) => {
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({ page: page, limit: limit, ...search }).then((res) => {
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
    const up={...value,page:1,limit:10}
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
      form.resetFields();
    } else {
      message.warning(data.msg);
      return;
    }
  };
  // 修改、添加
  const handleOk = async () => {
    try{

  setUpLogin(true);
    const keyFormFields = await keyForm.current.validateFields()
    console.log();
    if (formData.id) {
      // const fileds =  formRef.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",
     
        formData
      );
      const { data } = await PostUp(formData.id, {
      ...keyFormFields
      });
 setUpLogin(false);
      if (data.code === 200) {
        getNewListData();
        setIsOpenModal(false);
        message.success(data.msg);
      } else {
       
        setIsOpenModal(false);
        message.warning(data.msg);
      }
    } 
    else {
      // const fileds = await keyForm.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds",
        // fileds,
        formData
      );
      const { data} = await PostAdd({
        ...keyFormFields
      }); 
      setUpLogin(false);
      if (data.code === 400) {
        message.warning(data.msg);
        return;
      } else {
       
        message.success(data.msg);
        getNewListData();
        setIsOpenModal(data.false);
      }
    }

      
    }catch{setUpLogin(false);}
  
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
       real_name:"",
       phone:"",
       idnum:"",
        address:"",
        password:"",
        remark:"",
     
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
    setUpLogin(false);
    setIsOpenModal(false);
    setFormData({
      real_name:"",
      phone:"",
      idnum:"",
       address:"",
       password:"",
       remark:"",
    
   });
  };

    const handlePicCancel = () => {
        setPreviewOpen(false);
    }
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item >服务商列表</Breadcrumb.Item>
        </Breadcrumb>

        {routerContant("/tdb/index/a/tdb.Business/b/index") ? (
          <Card>
            <Form layout="inline" onFinish={onFinish} form={form}>
              <Form.Item label="服务商名称" name="real_name">
                <Input
                  placeholder="请输入服务商名称"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
              <Form.Item label="联系电话" name="phone">
                <Input
                  placeholder="请输入联系电话"
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
        {routerContant("/tdb/index/a/tdb.Business/b/add") ? (
          <Button type="primary" onClick={() => handlerAdd()}>
            添加
          </Button>
        ) : null}
        <Table
          scroll={{ x: 750 }}
          pagination={{  hideOnSinglePage: false,
            showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,current:paginationPramas.page,onChange:(page,pageSize)=>{
            handlePageChange(page,pageSize)
          }}}
          rowKey="id"
         
          dataSource={tableData}
          loading={loading}
          style={{ marginTop: "20px",
        }}
        >
          {/* <Column
            align="center"
            title="服务商id"
            dataIndex="id"
            key="id"
            fixed="left"
          /> */}
        
          <Column
            align="center"
            title="服务商名称"
            dataIndex="real_name"
           
          />
  <Column
            align="center"
            title="开机时间"
            dataIndex="created_at"

          />
                <Column
            align="center"
            title="服务商地址"
            dataIndex="address"
 
          />
                <Column
            align="center"
            title="联系方式"
            dataIndex="phone"
        
          />
         
          {/* <Column
            align="center"
            title="总计收益"
            dataIndex="total_earnings"
       
          />
           <Column
            align="center"
            title="累计提现"
            dataIndex="total_withdraw_earnings"
          /> */}
          <Column
            align="center"
            title="待提现"
            dataIndex="stay_withdraw_earnings"
          />
            {routerContant("/tdb/index/a/tdb.Business/b/edit") ? (
          <Column
            align="center"
            title="操作"
            key="operation"
     
            render={(_, record) => (
              <Space size="middle">  
              <>
                      <Button type="link" onClick={() => handlerEidt(record)}>
                        修改
                      </Button>
              
    
              
                  </>
             
              </Space>
            )}
          />
        ) : null}
        </Table>

        {isOpenModal ? (
          <Modal
            width={1200}
            title={formData.id ? "编辑" : "添加"}
            open={isOpenModal}
            // onOk={handleOk}
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
              // form={keyForm}
             ref={keyForm}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 20 }}
              autoComplete="off"
                initialValues={{...formData}  }  
            >
              <Form.Item
                label="姓名"
                name="real_name"
                rules={[{ required: true, message: "请输入服务商姓名" }]}
                >
                <Input placeholder="请输入服务商姓名" /></Form.Item>
                <Form.Item
                label="联系方式"
                name="phone"
                rules={[{ required: true, message: "请输入联系方式",
                pattern: /^1[3456789]\d{9}$/,

              //  
              }]}
                >
                <Input placeholder="请输入联系方式" /></Form.Item>
                <Form.Item
                label="身份证号"
                name="idnum"
                rules={[{ required: true, message: "请输入身份证号" 
                 ,pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
              }]}
                >
                <Input placeholder="请输入身份证号"  /></Form.Item>
                <Form.Item
                label="地址"
                name="address"
                rules={[{ required: true, message: "请输入地址"
              //  
              }]}
                >
                <Input placeholder="请输入地址" /></Form.Item>
                
                        
           {formData.id?<Form.Item
                label="密码"
                name="password"
              
                >
                <Input placeholder="请输入修改的密码如果不修改空着"  /></Form.Item>:
                <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入服务商姓名" }]}
                >
                <Input placeholder="请输入密码"  /></Form.Item>
           } 
            <Form.Item
                label="备注"
                name="remark"
              
                >
                <Input placeholder="请输入备注"  /></Form.Item>
                
               
            </Form>
            
          </Modal>
        ) : null}
      </Card>
      <PreviewImage preview={previewImage} key={previewOpen} previewOpen={previewOpen} handlePicCancel={handlePicCancel} />
    </div>
  );
}
