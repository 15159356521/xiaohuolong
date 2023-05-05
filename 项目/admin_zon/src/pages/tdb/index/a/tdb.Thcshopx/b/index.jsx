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
  Radio,
  TimePicker,
  DatePicker,
  InputNumber,
  Select,
  Image,
  Tag,
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

} from "@/api/beauditindex";
import{
AddBranch,
// 编辑分店
getEditBranch,
} from "@/api/Thcshop";
import {
  SearchOutlined,
  ReloadOutlined,

} from "@ant-design/icons";
import PreviewImage from "@/components/PreviewImage";
import styles from "./index.module.scss";
import { useRef } from "react";
import routerContant from "@/utils/constant";
import City from "@/components/City";
import moment from "moment";
import { baseIMgURL } from "@/utils/request";
const { Column } = Table;
const { Option } = Select;

/*
 const butList = [
{value:"待审核",key:40},{value:"待培训",key:2},{value:"待签约",key:2},]
 */
export default function Index() {
  // const { state: {id} } = useLocation()
  //   console.log(routerContant[location.pathname]);
  // const id = routerContant[location.pathname]
  const [upLogin, setUpLogin] = useState(false);
  const [baLogin,setBaLogin]=useState(false)
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [butList, setButList] = useState([]);
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1,
    limit: 10,
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
    // hideOnSinglePage: false,
    // showSizeChanger: true,
  });
  const [status, setStatus] = useState(1);
  const [search, setSearch] = useState({ name: "" });
  const [form] = Form.useForm();

  const keyForm = useRef(null);
  const [keyForm1] = Form.useForm();
  // 添加与编辑
  const [braSta, setBraSta] = useState(0);
  const [branch, setBranch] = useState(false);
  const [fileList, setFileList] = useState({
    sign_file_url: [],
    thcShopInfo_id_card_photo: [],
    thcShopInfo_bus_license_phone: [],
    shop_images: [],
    bus_license_phone: [], //营业执照
    id_card_photo: [], //身份证
    thcShopBrancInfo:[],//门店信息 
    operator_card_photo :[],//运营者身份证
  });
  const [formOption, setFormOption] = useState({
    device_id: { list: [], value: "" },
    status: { list: [], value: "" },
    pack_id: { list: [], value: "" },
    earnings_list: []
  });
  const [branchData, setBranchData] = useState({
    shop_branch_name: "",
    bus_license_phone: [],
    shop_images: [],
    operator_card_photo: [],
    province: "",
    address: "",
    city: "",
    district: "",
    remark: "",
    start_time: "",
    end_time: "",
    employee_num: "",
    opening_date: "",
    base_flow_rate: "",
    business_format: "",
    area: "",
    id: "",
  });
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState([]);
  const handlePageChange = (page, limit) => {
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({
      page: page,
      limit: limit,
      shop_branch_name: search.name,
      status: status,
    }).then((res) => {
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

  const getNewListData = async () => {
    setLoading(true);
    const { data } = await getAllList({ page: 1, limit: 10, status: status });
    setTableData(data.data);
    setPaginationPramas((preState) => ({ ...preState, total: data.count }));

    // 转换成数组格式
    const arr = [];
    console.log(arr, "arr");
    for (const key in data.reqdata) {
      arr.push(data.reqdata[key]);
    }
    console.log(arr, "arr");
    // 取数组前三个

    setButList(arr.slice(0, 3));
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
  function but(value) {
    setStatus(value + 1);
    setTableData([]);
    let up = { ...paginationPramas, status: value + 1 };
    getAllList(up).then((res) => {
      setTableData(res.data.data);
      form.setFieldValue("phone", "");
      setPaginationPramas((preState) => ({
        ...preState,
        total: res.data.count,
      }));
    });
  }
  function btus() {
    return (
      <div className="filter">
        <Radio.Group
          onChange={(e) => {
            but(e.target.value);
          }}
          className="filRight"
          defaultValue={0}
          buttonStyle="solid"
        >
          {butList.map((item, index) => {
            return (
              <Radio.Button key={index} value={index}>
                {item.value} <span style={{ color: "red" }}>({item.key})</span>
              </Radio.Button>
            );
          })}
        </Radio.Group>
      </div>
    );
  }
  const onReset = async () => {
    form.resetFields();
    setPaginationPramas((preState) => ({
      ...preState,
      status: status,
      page: 1,
      limit: 10,
    }));
    let up = { page: 1, limit: 10, status: status, shop_branch_name: "" };
    const { data } = await getAllList(up);
    console.log(data);
    if (data.code === 200) {
      message.success({ content: "重置成功", key: 1 });
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
      case 1:
        return (
          
          <>
             {routerContant(
                      "/tdb/index/a/tdb.Thcshop/b/beaudittoaudit"
                    ) ? (
            <Button type="link" onClick={() => handlerEidt(record)}>
              审核
            </Button>
            ) : null}
          </>
        );
      case 2:
        return (
          <>
             {routerContant(
                      "/tdb/index/a/tdb.Thcshop/b/besigntosign"
                    ) ? (
            <Button type="link" onClick={() => handlerEidt(record)}>
              签约
            </Button>
            ) : null}
          </>
        );
      case 3:
        return (
          <>
                 {routerContant(
                      "/tdb/index/a/tdb.Thcshop/b/betrainapprove"
                    ) ? (
             <Button type="link" onClick={() => handlerEidt(record)}>
            通过
          </Button>
            ) : null}
          </>
       
        );
    }
  }
  // 修改、添加
  const handleOk = async () => {
    try{
          console.log(formData);
    setUpLogin(true);
    if (formData.id) {
const fileds =  await keyForm.current.validateFields();
      console.log(
        "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",

        formData,fileds
      );
      fileds.id_card_photo = formData.id_card_photo;
      fileds.bus_license_phone= formData.bus_license_phone;

      // 校验keyForm
      // const keyFormFields = await keyForm.current.validateFields();
      // console.log(
      //   "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ keyFormFields",
      //   keyFormFields
      // );
      let data = null;
      if (status == 1) {
        data = await PostUp(formData.id, {
          ...fileds,
        }).then((res) => {
          return res.data;
        });
      } else if (status == 2) {
        data = await PostSignUp(formData.id, {
          ...formData,
        }).then((res) => {
          return res.data;
        });
      } else if (status == 3) {
        data = await PostTrainUp(formData.id,{...fileds}).then((res) => {
          return res.data;
        });
      } else if (status == 4) {
        data = await PostBindUp(formData.id, { ...formData }).then((res) => {
          return res.data;
        });
      } 
      setUpLogin(false);
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
    }catch{
      setUpLogin(false);
    }

  };
  const brancOK = async () => {
    try{

       setBaLogin(true);
    const fileds = await keyForm.current.validateFields();
    console.log(
      "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",
      formData,
      fileds
    );
    fileds.bus_license_phone = branchData.bus_license_phone;
    fileds.shop_images = branchData.shop_images;
    fileds.operator_card_photo = branchData.operator_card_photo;
    fileds.opening_date=  fileds.opening_date.format('YYYY-MM-DD')
    fileds.start_time=  fileds.start_time.format('HH:mm')
    fileds.end_time=  fileds.end_time.format('HH:mm')
    let data = null;
    if (braSta == 0) {
      data = await AddBranch(formData.id, { ...fileds }).then((res) => {
        return res.data;
      });
    } else {
      data = await getEditBranch(branchData.id, { ...fileds }).then((res) => {
        return res.data;
      });
    }
    setBaLogin(false);
    if (data.code === 200) {
      getNewListData();
      setBranch(false);
      handlerEidt(formData,status);
      // setIsOpenModal(false);
      message.success(data.msg);
      setFileList({
        ...fileList,
        thcShopInfo_bus_license_phone: [],
        shop_images: [],
        operator_card_photo: [], //运营者身份证
      });
    } else {
      setBranch(false);
      message.warning(data.msg);
    }
    }catch{
      setBaLogin(false);
    }
 
  };
  const handlerBranch = async (record, num) => {
    // 查找分店
    console.log(record, "record");
    setBraSta(num);
    let arr = [];
    formData.thcShopBrancInfo.map((item) => {
      if (item.id == record.id) {
        for(let i in item){
       
          if(i=="start_time"){
           item[i]=moment(item[i], "HH:mm")
          }else if(i=="end_time"){
           item[i]=moment(item[i],"HH:mm")
          }else if(i=="opening_date"){
           item[i]=moment(item[i],"YYYY-MM-DD")
          }
   }
        setBranchData(item);

        keyForm1.setFieldsValue({
          ...item,
        });
        for (let a in item) {
          let arr = [];
          // 判断是是不是数组类型
          if (Array.isArray(item[a])) {
            if (item[a].length > 0) {
              if (a == "bus_license_phone") {
                item[a].map((item1) => {
                  console.log(a, 123);
                  arr.push({
                    uid: item1,
                    name: "xxx.png",
                    status: "done",
                    url: item1,
                  });
                  fileList.thcShopInfo_bus_license_phone = arr;

                  console.log(arr, "arr");
                });
              } else {
                item[a].map((item1) => {
                  console.log(a, 123);
                  arr.push({
                    uid: item1,
                    name: "xxx.png",
                    status: "done",
                    url: item1,
                  });
                  fileList[a] = arr;

                  console.log(arr, "arr");
                });
              }
              // console.log(reqdata.data[a], 123);
            }
          }
          setFileList(fileList);
        }

        arr.push({
          uid: item,
          name: "xxx.png",
          status: "done",
          url: item.bus_license_phone,
        });
        console.log(arr, "item");
        // 延时0.5秒

        setBranch(true);
        // setFileList({
        //   ...fileList,
        //   // thcShopInfo_bus_license_phone:arr,
        //   shop_images:item.shop_images,
        //   operator_card_photo:item.operator_card_photo,
        // })
      }
    });
  };

  // 编辑操作
  const handlerEidt = async (record) => {

    setFileList({
      sign_file_url: [],
      thcShopInfo_id_card_photo: [],
      thcShopInfo_bus_license_phone: [],
      shop_images: [],
      operator_card_photo: [],
      bus_license_phone: [], //营业执照
      id_card_photo: [], //身份证
      thcShopBrancInfo:[],//门店信息 
      operator_card_photo :[],//运营者身份证
    });
    try {
      // const obj = { ...formData };
      let obj;
      let reqdata;
      if (status == 1) {
        reqdata = await getUp(record.id).then((res) => {
          return res.data;
        });
      } else if (status == 2) {
        reqdata = await getSignUp(record.id).then((res) => {
          return res.data;
        });
      } else if (status == 4) {
        reqdata = await getBindUp(record.id).then((res) => {
          return res.data;
        });
      } else if (status == 3) {
        reqdata = await GetTrainUp(record.id).then((res) => {
          return res.data;
        });
      } 
      const opt = { ...formOption };
      if (reqdata == undefined) {
        message.warning("数据为空");
      } else {
        if(status == 3){
          obj={...reqdata.data.info}
          console.log(obj, 123);
          getImg(reqdata.data.info)

               obj.pack_id = reqdata.data.earnings_list[0].value;
               console.log(obj,'sdf');
               console.log(reqdata.data.earnings_list,"fe");
               setFormOption({
                  ...opt,
                  earnings_list: reqdata.data.earnings_list,
            
                });


       
             
     
        }else{
              obj = { ...reqdata.data };
              obj.status=2
        getImg(reqdata.data)
        }

      }
      // setFormOption(opt);
      setFormData(obj);
      // setFileList(fileList);
    } catch (error) {
      console.log(error);
      message.warning(error);
    }

    setIsOpenModal(true);
  }; // 弹窗取消逻辑
  const getImg = (res) => {
    for (let a in res) {
      // console.log(reqdata.data[a], 123);
      let arr = [];
      // 判断是是不是数组类型
      if (Array.isArray(res[a])) {
        if (res[a].length > 0) {
          // console.log(reqdata.data[a], 123);
          res[a].map((item) => {
            console.log(a, 123);

            // 判断是不是对象
            if (typeof item == "object") {
              // getImg(item);
            } else {
              arr.push({
                uid: item,
                name: "图片不存在.png",
                status: "done",
                url: item,
              });
              fileList[a] = arr;
            }
            console.log(arr, "arr");
          });
        }
      }
      setFileList(fileList);
    }
  };
  const handleCancel = () => {
    setUpLogin(false);
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

    if (newFileList[newFileList.length - 1]?.response?.code === 200) {
      if (name == "sign_file_url") {
        setFormData({
          ...formData,
          [name]:
         `${baseIMgURL}${newFileList[newFileList.length - 1].response.data.url}`
        });
      } else {
        if (
          name == "thcShopInfo_bus_license_phone" ||
          name == "operator_card_photo" ||
          name == "shop_images"
        ) {
          let obj = { ...branchData };
          console.log(obj, "obj");
          if (name == "thcShopInfo_bus_license_phone") {
            let arr = [];
            newFileList.map((item) => {
              // console.log(item.response.data);
              if (item.status == "done") {
                if (item.url) {
                  arr.push(item.url);
                } else {
                  arr.push(
                    `${baseIMgURL}${item.response.data.url}`
                  );
                }
                console.log(arr, "arr");
              }
            });
            obj.bus_license_phone = arr;
      
          } else {
            let arr = [];
            newFileList.map((item) => {
              if (item.status == "done") {
                if (item.url) {
                  arr.push(item.url);
                } else {
                  arr.push(
                    `${baseIMgURL}${item.response.data.url}`
                  );
                }
              }
            });
            obj[name] = arr;
            console.log(obj, arr, "o123");
          }
          console.log(obj, "obj");
          setBranchData(obj);
        }
        let arr = [];
        newFileList.map((item) => {
          // console.log(item.response.data);
          if (item.status == "done") {
            if (item.url||item.url=="") {
              arr.push(item.url);
            } else {
              arr.push(
                `${baseIMgURL}${item.response.data.url}`
              );
            }
        
          }
        });
        console.log(arr, "arr");
        setFormData((preState) => ({
          ...preState,
          [name]: arr,
        }));
      }
    }

    // setFormData((preState) => ({ ...preState, [name]: file.fileList }));
    console.log(formData);
  };
  // 删除图片
  const handleRemove = (file, name) => {
    let arr = fileList[name].filter((item) => item.uid !== file.uid);
    console.log(file, "file");
    setFileList({ ...fileList, [name]: arr });
    if (
      name == "thcShopInfo_bus_license_phone" ||
      name == "operator_card_photo" ||
      name == "shop_images"
    ) {
      if (name == "thcShopInfo_bus_license_phone") {
        branchData.bus_license_phone.filter((item) => {
          return console.log(file, item, "item"), item !== file.url;
        });

        setBranchData({
          ...branchData,
          bus_license_phone: Remove(branchData.bus_license_phone, file),
        });
      } else {
        console.log(branchData[name].filter((item) => item.uid !== file.uid));

        setBranchData({
          ...branchData,
          [name]: Remove(branchData[name], file),
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: Remove(formData[name], file),
      });

      console.log(Remove(formData[name], file));
    }
  };
  const Remove = (file, item) => {
    console.log(file, item, "item");
    if (item.url||item.url=="") {
      console.log(item, 1);
      return file.filter((item1) => item1 !== item.url);
    } else {
      console.log(item, 2);
      return file.filter(
        (item1) =>
          item1 !==`${baseIMgURL}${item.response.data.url}`
      );
    }
  };
  const handlePicCancel = () => {
    setPreviewOpen(false);
  };
  // 表单切换
  function Change() {
    if (status == 1) {
      return (
        <>
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
              value={2}
            >
             
              <Option value={2}>通过</Option>
              <Option value={6}>未通过</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark"
            // rules={[{ required: true, message: "请输入备注" }]}
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
      );
    } else if (status == 2) {
      return (
        <>
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
              {fileList.sign_file_url.length >= 1 ? null : "+ 请上传签约文件"}
            </Upload>
          </Form.Item>
        </>
      );
    }else if(status==3){
      return (
        <>
         <Form.Item
                        label="套餐"
                        name="pack_id"
                        rules={[{ required: true, message: "请选择套餐" }]}
                        
                      >
                        <Select
                          placeholder="请选择套餐"
                          showArrow
                         value={formData.pack_id}
                          onChange={(item) => {
                            setFormData((preState) => ({
                              ...preState,
                              earnings_list: item,
                            }));
                          }}
                   
                          allowClear
                        >
                          {formOption.earnings_list.map((item, index) => (
                            <Select.Option value={item.value} key={item.value}>
                              {/* {console.log(item, "item")} */}
                              {item.label}
                            </Select.Option>
                            // console.log(item, "item")
                          ))}
                        </Select>
                      </Form.Item>
          <Form.Item
            label="登入密码"
            name="password"
            // rules={[{ required: true, message: "请上传证件照" }]}
          >
            <Input 
            placeholder="请输入登入密码"
            onChange={(value) => {
              setFormData({
                ...formData,
                password: value.target.value,
              });
            }}
            />
          </Form.Item>
        </>
      );
    }
  }
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>待审核店家</Breadcrumb.Item>
        </Breadcrumb>

        {routerContant("/auth.admgroup/index") ? (
          <Card>
            <Form layout="inline" onFinish={onFinish} form={form}>
            <Form.Item label="联系方式" name="phone">
              <Input
                placeholder="请输入联系方式"
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
                {btus()}
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
            title="店家id"
            dataIndex="id"
            key="id"
            fixed="left"
          /> */}
           <Column align="center" title="所属服务商" dataIndex="bus_name"
      
                 render={(text, record) => (
                  <div>
                    {record.thcBusinessInfo.real_name}
                
                  </div>
                )}/>
          <Column align="center" title="联系人" dataIndex="real_name" />
          {/* <Column align="center" title="身份证号" dataIndex="idnum" /> */}
          <Column align="center" title="手机号" dataIndex="phone" />
          <Column align="center" title="公司名称" dataIndex="shop_name" />
          <Column
            align="center"
            title="企业营业执照"
            dataIndex="bus_license_phone"
            render={(_, record) => (
              <Image
                preview={{
                  imgVisible: false,
                }}
                src={`${record.bus_license_phone[0]}`}
              />
            )}
          />
          <Column
            align="center"
            title="具体地点"
            dataIndex="address"
            render={(text, record) => (
              <div>
                {record.province}省
                  {record.city}市
                  {record.district?record.district+'县':''}
                  {record.address}
              </div>
            )}
          />
          <Column align="center" title="提现收益" dataIndex="money" />
          <Column align="center" title="创建时间" dataIndex="created_at" />
          <Column
            align="center"
            title="状态"
            dataIndex="status"
            key="status"
            render={(_, record) => (
              <Tag color="#108ee9">
                {record.status === 1
                  ? "待审核"
                  : record.status === 2
                  ? "待签约"
                  : "待培训"}
              </Tag>
            )}
          />
          <Column
            align="center"
            title="操作"
            key="operation"
      
            render={(_, record) => (
              <Space size="middle">{statuses(record)}</Space>
            )}
          />
        </Table>

        {isOpenModal ? (
          <Modal
            width={1200}
            title={"审核店家"}
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
            zIndex={10}
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
                label="姓名"
                name="real_name"
                rules={[{ required: true, message: "请输入名称" }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item
                label="联系方式"
                name="phone"
                rules={[{ required: true, message: "请输入联系方式",
                pattern: /^1[3456789]\d{9}$/, }]}
              >
                <Input placeholder="请输入联系方式" />
              </Form.Item>
              <Form.Item
                label="公司名称"
                name="shop_name"
                rules={[{ required: true, message: "请输入名称" }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item
                label="身份证"
                name="idnum"
                rules={[{ required: true, message: "请输入身份证",
                pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, }]}
              >
                <Input placeholder="请输入身份证" />
              </Form.Item>
      {status==3?null:     <>
                  <Form.Item
                    label="身份证照"
                    name="id_card_photo"
                    rules={[{ required: true, message: "请上传证件照" }]}
                  >
                    <Upload
                      accept="image/*"
                      action={"/common.upload/uploadImage"}
                      listType="picture-card"
                      fileList={fileList.id_card_photo}
                      onPreview={handlePreview}
                      
                      onRemove={(file) => 
                        handleRemove(file, "id_card_photo")}
                      onChange={(info) => handleChange(info, "id_card_photo")}
                    >
                      {fileList.id_card_photo.length >= 2
                        ? null
                        : "+ 请上传身份证正反面"}
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    label="企业营业执照"
                    name="bus_license_phone"
                  rules={[{ required: true, message: "请上传证件照" }]}
                  >
                    <Upload
                      accept="image/*"
                      action={"/common.upload/uploadImage"}
                      listType="picture-card"
                      
                      fileList={fileList.bus_license_phone}
                      onPreview={handlePreview}
                      onRemove={(file) => 
                        handleRemove(file, "bus_license_phone")}
            
                      onChange={(info) =>
                        handleChange(info, "bus_license_phone")
                      }
                    >
                      {fileList.bus_license_phone.length >= 1
                        ? null
                        : "+ 请上传企业营业执照"}
                    </Upload>
                  </Form.Item>
                </>}
           
                <City province={formData.province} city={formData.city}
                district={formData.district}              />
              <Form.Item
                label="详细地址"
                name="address"
                rules={[{ required: true, message: "请输入详细地址" }]}
              >
                <Input placeholder="请输入详细地址"  />
              </Form.Item>
              {status == 4 || status == 5 ? null : (
                <>              
                  {Change()}
                </>
              )}
     <Form.Item label="分店">
                  <Button
                    onClick={() => {
                      setBranch(true);
                      setBranchData({
                        shop_branch_name: "",
                        bus_license_phone: [],
                        shop_images: [],
                        operator_card_photo: [],
                        province: "",
                        address: "",
                        city: "",
                        district: "",
                        remark: "",
                        start_time: "",
                        end_time: "",
                        employee_num: "",
                        opening_date: "",
                        base_flow_rate: "",
                        business_format: "",
                        area: "",
                        id: formData.id,
                      });
                      setFileList({
                        ...fileList,
                        thcShopInfo_bus_license_phone: [],
                        shop_images: [],
                        operator_card_photo: [],
                      });
                      setBraSta(0);
                    }}
                  >
                    新增分店
                  </Button>

                  <Table
                    pagination={false}
                    rowKey="id"
                    dataSource={formData.thcShopBrancInfo}
                    loading={loading}
                    style={{ marginTop: "20px" }}
                  >
                    <Column title="分店id" dataIndex="id" />
                    <Column title="分店名称" dataIndex="shop_branch_name" />
                    <Column
                      align="center"
                      title="具体地点"
                      dataIndex="address"
                      render={(text, record) => (
                        <div>
                          {record.province}
                          {record.city}
                          {record.district}
                          {record.address}
                        </div>
                      )}
                    />
                    <Column title="申请时间" dataIndex="created_at" />
                    <Column
                      align="center"
                      title="操作"
                      key="operation"
                      fixed="right"
                      render={(_, record) => (
                        <Space size="middle">
                          {routerContant("/tdb/index/a/tdb.Thcshop/b/edit") ? (
                            <>
                              <Button
                                type="link"
                                key="edit"
                                onClick={() => {
                                  handlerBranch(record, 1);
                                }}
                              >
                                详情
                              </Button>
                              <Button
                                type="link"
                                key="edit"
                                onClick={() => handlerBranch(record, 2)}
                              >
                                编辑
                              </Button>
                            </>
                          ) : null}
                        </Space>
                      )}
                    />
                  </Table>
                </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </Card>
      {/* <Modal
        open={previewOpen}
        title="预览"
        footer={null}
        zIndex={13}
        onCancel={handlePicCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal> */}
        <PreviewImage preview={previewImage} key={previewOpen} previewOpen={previewOpen} handlePicCancel={handlePicCancel} />
      <Modal
        open={branch}
        title="分店"
        onOk={brancOK}
        width={1000}
        zIndex={12}
        onCancel={() => {
          setBranch(false);
          //  销毁表单
          keyForm.current.resetFields();
          setBranchData({
            shop_branch_name: "",
            bus_license_phone: [],
            shop_images: [],
            operator_card_photo: [],
            province: "",
            address: "",
            city: "",
            district: "",
            remark: "",
            start_time: "",
            end_time: "",
            employee_num: "",
            opening_date: "",
            base_flow_rate: "",
            business_format: "",
            area: "",
            id: formData.id,
          });
          setFileList({
            ...fileList,
            thcShopInfo_bus_license_phone: [],
            shop_images: [],
            operator_card_photo: [],
          });
        }
        }
        footer={[
          <Button key="back" onClick={()=>  {
            setBranch(false);
            //  销毁表单
        
            setBranchData({
              shop_branch_name: "",
              bus_license_phone: [],
              shop_images: [],
              operator_card_photo: [],
              province: "",
              address: "",
              city: "",
              district: "",
              remark: "",
              start_time: "",
              end_time: "",
              employee_num: "",
              opening_date: "",
              base_flow_rate: "",
              business_format: "",
              area: "",
              id: formData.id,
            });
            keyForm1.setFieldsValue({
              shop_branch_name: "",
              bus_license_phone: [],
              shop_images: [],
              operator_card_photo: [],
              province: "",
              address: "",
              city: "",
              district: "",
              remark: "",
              start_time: "",
              end_time: "",
              employee_num: "",
              opening_date: "",
              base_flow_rate: "",
              business_format: "",
              area: "",
              id: formData.id,
            })
            setFileList({
              ...fileList,
              thcShopInfo_bus_license_phone: [],
              shop_images: [],
              operator_card_photo: [],
            });
            // setIsOpenModal(true)
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={baLogin} onClick={brancOK}>
            确定
          </Button>,
        ]}
       
      >
        <Form
          form={keyForm1}
          ref={keyForm}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
          autoComplete="off"
          // initialValues={[branchData[0]]}
          initialValues={{ ...branchData }}
          disabled={braSta == 1 ? true : false}
        >
          <Form.Item
            label="分店名称"
            name="shop_branch_name"
            rules={[{ required: true, message: "请输入分店名称" }]}
          >
            <Input placeholder="请输入分店名称"></Input>
          </Form.Item>
          <Form.Item
            label="营业执照"
            name="bus_license_phone"
            rules={[{ required: true, message: "分店营业执照" }]}
          >
            <Upload
              accept="image/*"
              action={"/common.upload/uploadImage"}
              listType="picture-card"
              fileList={fileList.thcShopInfo_bus_license_phone}
              onPreview={handlePreview}
              onRemove={(file) =>
                handleRemove(file, "thcShopInfo_bus_license_phone")
              }
              onChange={(info) =>
                handleChange(info, "thcShopInfo_bus_license_phone")
              }
            >
              {fileList.thcShopInfo_bus_license_phone.length >= 1
                ? null
                : "+ 请上传企业营业执照"}
            </Upload>
          </Form.Item>

          <Form.Item
            label="操作员身份证"
            name="operator_card_photo"
            rules={[{ required: true, message: "请上传作员身份证" }]}
          >
            <Upload
              accept="image/*"
              action={"/common.upload/uploadImage"}
              listType="picture-card"
              fileList={fileList.operator_card_photo}
              onPreview={handlePreview}
              onRemove={(file) => handleRemove(file, "operator_card_photo")}
              onChange={(info) => handleChange(info, "operator_card_photo")}
            >
              {fileList.operator_card_photo.length >= 2
                ? null
                : "+ 请上传作员身份证"}
            </Upload>
          </Form.Item>
          <Form.Item
            label="分店内照片"
            name="shop_images"
            rules={[{ required: true, message: "请上传分店内照片" }]}
          >
            <Upload
              accept="image/*"
              action={"/common.upload/uploadImage"}
              listType="picture-card"
              fileList={fileList.shop_images}
              onPreview={handlePreview}
              onRemove={(file) => handleRemove(file, "shop_images")}
              onChange={(info) => handleChange(info, "shop_images")}
            >
              {fileList.shop_images.length >= 5 ? null : "+ 请上传分店内照片"}
            </Upload>
          </Form.Item>
          <City province={branchData.province} city={branchData.city}
                district={branchData.district}              />

          <Form.Item
            label="详细地址"
            name="address"
            rules={[{ required: true, message: "请输入详细地址" }]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>
          <Form.Item
            label="营业开始时间"
            name="start_time"
            rules={[
              {
                required: true,
                message: "请输入营业开始时间XX:XX",
                // pattern: /^([0-1][0-9]|[2][0-3]):[0-5][0-9]$/,
              },
            ]}
          >
              <TimePicker format="HH:mm"  />
            <Input placeholder="请输入营业开始时间XX:XX" />
          </Form.Item>
          <Form.Item
            label="营业结束时间"
            name="end_time"
            rules={[
              {
                // pattern: /^([0-1][0-9]|[2][0-3]):[0-5][0-9]$/,
                required: true,
                message: "请输入营业结束时间XX:XX",
              },
            ]}
          >
              <TimePicker format="HH:mm"  />
            {/* <Input placeholder="请输入营业结束时间XX:XX" /> */}
          </Form.Item>
          <Form.Item
            label="开业时间"
            name="opening_date"
            rules={[
              {
                // type: "object",

                required: true,
                message: "请输入营业时间",
                // pattern: /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/,
                // pattern: /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/,
                // message: "请输入正确的时间格式",
              },
            ]}
          >
            {/*                   
                    <DatePicker
                      
                     defaultValue={moment(branchData.opening_date, "YYYY-MM-DD")}
             
                    />
                     */}
                    <DatePicker format="YYYY-MM-DD"  />
            {/* <Input placeholder="请输入营业开始时间XXXX-XX-XX" /> */}
          </Form.Item>
          <Form.Item
            label="店员人数"
            name="employee_num"
            rules={[
              {
                required: true,
                message: "请输入详细地址",
                pattern: new RegExp(/^[1-9]\d*$/, "g"),
              },
            ]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>
          <Form.Item
            label="基础人流量"
            name="base_flow_rate"
            rules={[
              {
                required: true,
                message: "请输入基础人流量",
                pattern: new RegExp(/^[1-9]\d*$/, "g"),
              },
            ]}
          >
            <Input placeholder="请输入基础人流量" />
          </Form.Item>
          <Form.Item
            label="经营状态"
            name="business_format"
            // rules={[{ required: true, message: "请输入经营状态", }]}
          >
            <Input placeholder="请输入经营状态" />{" "}
          </Form.Item>
          <Form.Item
            label="店家面积m²"
            name="area"
            rules={[
              {
                required: true,
                message: "店家面积",
                pattern: new RegExp(/^[1-9]\d*$/, "g"),
              },
            ]}
          >
            <Input placeholder="请输入店家面积" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
