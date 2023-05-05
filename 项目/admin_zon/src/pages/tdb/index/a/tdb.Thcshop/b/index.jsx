import React, { useState, useEffect,useCallback } from "react";
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
  Image,
  Select,
  Radio,
  Tag,
  Upload,
  TimePicker,
  DatePicker,
} from "antd";
import styles from "./index.module.scss";
import {
  getAllList,
  getShop,
  // 详情
  getUp,
  getEdi,
  PostUp, //编辑
  // 绑定设备
  getBind,
  PostBind,
  getDel,
  DelBindUp,
  // 更改套餐
  PostUpPackage,
  getPackage,
  // 回退审核
  PostBack,
  // 添加分店
  AddBranch,
  // 编辑分店
  getEditBranch,
  // 修改签约文件
  PostFile,
} from "@/api/Thcshop";
import City from "@/components/City";
import { useRef } from "react";
import {
  SearchOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import PreviewImage from "@/components/PreviewImage";
// import Btus from "@/components/ButLIst";
import routerContant from "@/utils/constant";
import { baseIMgURL } from "@/utils/request";
const { Column } = Table;
const { confirm } = Modal;
export default function Index() {
  // const { state: {id} } = useLocation()
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
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    district: "",
    id: "",
    idnum: "",
    phone: "",
    province: "",
    real_name: "",
    shop_name: "",
    status: "",
  });
  const [upLogin, setUpLogin] = useState(false);
  const [baLogin, setBaLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isListModal, setIsListModal] = useState(false);
  const [search, setSearch] = useState({ name: "", phone: "" });
  const [stu, setStu] = useState(0);
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const [id, setId] = useState("");
  const [list, setList] = useState([]);
  const [listPramas, setListPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
  });
  const handleListChange = (page, limit) => {
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    // console.log(paginationPramas,'dsfgd');
    getShop(id, {
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
  const [formOption, setFormOption] = useState({
    device_id: [{ label: "", value: "" }], //绑定设备
    thcDeviceInfo: [{ label: "", value: "" }], //设备列表解除绑定
    thcPackInfo: [{ label: "", value: "" }], //套餐列表
  });
  const [status, setStatus] = useState(4);
  const [butList, setButList] = useState([]);

  // 预览图片
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({
      page: page,
      limit: limit,
      ...search,
      status: status,
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
  const keyForm = useRef();
  const [form] = Form.useForm();
  const [keyForm1] = Form.useForm();

  const [branch, setBranch] = useState(false);

  const [braSta, setBraSta] = useState(0);
  const getAllRoleGroupData = async () => {
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
    // 取数组后面4个
    const arr1 = arr.slice(arr.length - 4, arr.length);
    console.log(arr1, "arr1");

    setButList(arr.slice(arr.length - 3, arr.length));
    setLoading(false);
  };
  useEffect(() => {
    (async function () {
      getAllRoleGroupData();
      console.log(formOption, "formOption");
      console.log(formData, "formData");
      const opt = { ...formOption };
    })();
  }, []);

  //  搜索管理员区
  // const [form] = Form.useForm();
  const onFinish = async (value) => {
    console.log(value, "sdfsf");

    setSearch(value);
    const up = { ...value, page: 1, limit: 10 };
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
  function btus() {
    return (
      <div className="filter">
        <Radio.Group
          onChange={(e) => {
            but(e.target.value);
          }}
          className="filRight"
          defaultValue={4}
          buttonStyle="solid"
        >
          {butList.map((item, index) => {
            return (
              <Radio.Button key={item.status} value={item.status}>
                {item.value} <span style={{ color: "red" }}>({item.key})</span>
              </Radio.Button>
            );
          })}
        </Radio.Group>
      </div>
    );
  }
  function but(value) {
    console.log(value, "value");
    setStatus(value);
    setTableData([]);
    let up = { ...paginationPramas, status: value };
    getAllList(up).then((res) => {
      setTableData(res.data.data);
      form.setFieldsValue({
        phone: "",
      });
      setPaginationPramas((preState) => ({
        ...preState,
        total: res.data.count,
      }));
    });
  }
  const onReset = async () => {
    form.resetFields();
    setSearch({});
    const { data } = await getAllList({ page: 1, limit: 10, status: 4 });
    console.log(data);
    if (data.code !== 400) {
      message.success({ content: "重置成功", key: "reset" });
      setTableData(data.data);
      setPaginationPramas((preState) => ({ ...preState, total: data.count }));
    }
  };
  // 表格区
  // 修改、添加
  const [fileList, setFileList] = useState({
    sign_file_url: [],
    thcShopInfo_id_card_photo: [],
    thcShopInfo_bus_license_phone: [], //分店营业执照
    shop_images: [],
    bus_license_phone: [], //营业执照
    id_card_photo: [], //身份证
    thcShopBrancInfo: [], //门店信息
    operator_card_photo: [], //运营者身份证
  });
  const handleOk = async () => {
    try {
      setUpLogin(true);
      if (stu < 6) {
        const fileds = await formRef.current.validateFields();
        console.log(
          "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",

          formData,
          fileds
        );
        fileds.id_card_photo = formData.id_card_photo;
        fileds.bus_license_phone = formData.bus_license_phone;
        let data = null;
        if (stu == 1) {
          data = await PostBind(formData.id, { ...formData }).then((res) => {
            return res.data;
          });
        } else if (stu == 2) {
          data = await DelBindUp(formData.id, { ...fileds }).then((res) => {
            return res.data;
          });
        } else if (stu == 3) {
          data = await PostUpPackage(formData.id, { ...fileds }).then((res) => {
            return res.data;
          });
        } else if (stu == 5) {
          data = await PostUp(formData.id, { ...fileds }).then((res) => {
            return res.data;
          });
        }

        console.log(data);
        if (data.code === 200) {
          getAllRoleGroupData();
          setIsOpenModal(false);
          setBranch(false);
          setUpLogin(false);
          message.success(data.msg);
          setFileList({
            sign_file_url: [],
            thcShopInfo_id_card_photo: [],
            thcShopInfo_bus_license_phone: [],
            shop_images: [],
            bus_license_phone: [], //营业执照
            id_card_photo: [], //身份证
            thcShopBrancInfo: [], //门店信息
            operator_card_photo: [], //运营者身份证
          });
        } else {
          setIsOpenModal(false);
          message.warning(data.msg);
        }
      }
    } catch {
      setUpLogin(false);
    }
    console.log(formData);
  };
  const brancOK = async () => {
    try {
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
      fileds.opening_date = fileds.opening_date.format("YYYY-MM-DD");
      fileds.start_time = fileds.start_time.format("HH:mm");
      fileds.end_time = fileds.end_time.format("HH:mm");
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
        console.log(formData.id);
        handlerEidt(formData, stu);
        getAllRoleGroupData();
        setBranch(false);
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
    } catch {
      setBaLogin(false);
    }
  };
  // 切换操作

  function statuses(record) {
    console.log(status);
    switch (status) {
      case 4:
        return (
          <>
            <Form layout="horizontal" wrapperCol={14} labelCol={2}>
              <Form.Item>
                {routerContant("/tdb/index/a/tdb.Thcshop/b/minlog") ? (
                  <Button
                    type="link"
                    key="edit"
                    onClick={() => handlerEidt(record, 0)}
                  >
                    详情
                  </Button>
                ) : null}
                {routerContant("/tdb/index/a/tdb.Thcshop/b/bebinding") ? (
                  <Button
                    type="link"
                    key="edit"
                    onClick={() => handlerEidt(record, 1)}
                  >
                    绑定设备
                  </Button>
                ) : null}
              </Form.Item>
            </Form>
          </>
        );
      case 5:
        return (
          <>
            {" "}
            <Form layout="horizontal" wrapperCol={14} labelCol={2}>
              <Form.Item>
                {routerContant("/tdb/index/a/tdb.Thcshop/b/minlog") ? (
                  <Button
                    type="link"
                    key="edit"
                    onClick={() => handlerEidt(record, 0)}
                  >
                    详情
                  </Button>
                ) : null}
                {routerContant("/tdb/index/a/tdb.Thcshop/b/edit") ? (
                  <Button
                    type="link"
                    key="edit"
                    onClick={() => handlerEidt(record, 5)}
                  >
                    编辑
                  </Button>
                ) : null}
                {routerContant("/tdb/index/a/tdb.Thcshop/b/bebinding") ? (
                  <Button
                    type="link"
                    key="edit"
                    onClick={() => handlerEidt(record, 1)}
                  >
                    绑定设备
                  </Button>
                ) : null}
                {routerContant("/tdb/index/a/tdb.Thcshop/b/beunbind") ? (
                  <Button type="link" onClick={() => handlerEidt(record, 2)}>
                    解除绑定
                  </Button>
                ) : null}
                {routerContant("/tdb/index/a/tdb.Thcshop/b/editpack") ? (
                  <Button type="link" onClick={() => handlerEidt(record, 3)}>
                    更改套餐
                  </Button>
                ) : null}
                {routerContant("/tdb/index/a/tdb.Thcshop/b/minlog") ? (
                  <Button type="link" onClick={() => handlerList(record)}>
                    分钟数明细
                  </Button>
                ) : null}
              </Form.Item>
            </Form>
          </>
        );
      case 6:
        return (
          <>
            {routerContant("/tdb/index/a/tdb.Thcshop/b/editbeaudit") ? (
              <Button
                type="link"
                onClick={() => {
                  confirm({
                    title: "确定要回退到审核吗?",
                    onOk() {
                      handlerEidt(record, 4);
                    },
                  });
                }}
              >
                回退审核
              </Button>
            ) : null}
          </>
        );
    }
  }
  // 编辑操作
  const handlerEidt = async (record, num) => {
    setStu(num);
    console.log(record, "dfsdf");
    let reqdata = null;
    const opt = { ...formOption };
    let obj;
    switch (num) {
      case 0:
        reqdata = await getUp(record.id).then((res) => {
          return res.data;
        });
        break;
      case 1:
        reqdata = await getBind(record.id).then((res) => {
          return res.data;
        });
        break;
      case 2:
        reqdata = await getDel(record.id).then((res) => {
          return res.data;
        });
        break;
      case 3:
        reqdata = await getPackage(record.id).then((res) => {
          return res.data;
        });
        break;
      case 4:
        reqdata = await PostBack(record.id).then((res) => {
          return res.data;
        });
        break;
      case 5:
        reqdata = await getEdi(record.id).then((res) => {
          return res.data;
        });
        break;
      case 6:
        setBranch(true);
        // reqdata = await getEdi(record.id).then((res) => {
        //   return res.data;
        // });
        break;
    }
    if (status == 6) {
      getAllRoleGroupData();
    } else {
      if (reqdata.code === 200) {
        console.log(reqdata, "reqdata");
        if (num == 0 || num == 5) {
          obj = reqdata.data;
          if (reqdata.data.thcDeviceInfo.length > 0) {
            let arr = [];
            opt.thcDeviceInfo = reqdata.data.thcDeviceInfo;
            for (let i = 0; i < opt.thcDeviceInfo.length; i++) {
              arr.push(opt.thcDeviceInfo[i].id);
            }
            console.log(arr, "arr");
            obj.thcDeviceInfo = arr;
            if (reqdata.data.thcPackInfo != null) {
              obj.thcPackInfo = reqdata.data.thcPackInfo.title;
            }
          }

          getImg(reqdata.data);
        } else if (num == 1) {
          obj = { ...reqdata.data.info };
          console.log(obj, "obj");
          if (reqdata.data.device_list.length > 0) {
            console.log(5465456);
            obj.device_id = reqdata.data.device_list[0].value;
            opt.device_id = reqdata.data.device_list;
          } else {
            console.log(5465456);
            // obj.device_id = "";
            opt.device_id = [{ label: "暂无设备", value: "" }];
            message.warning("暂无设备");
          }
        } else if (num == 2) {
          obj = { ...reqdata.data };
          let arr = [];
          console.log(reqdata.data.thcDeviceInfo, "reqdata.data.thcDeviceInfo");
          opt.thcDeviceInfo = reqdata.data.thcDeviceInfo;
          for (let i = 0; i < opt.thcDeviceInfo.length; i++) {
            arr.push(opt.thcDeviceInfo[i].id);
          }
          console.log(arr, "arr");
          obj.device_id_ary = arr;
          console.log(obj, "obj");
        } else if (num == 3) {
          obj = { ...reqdata.data.info };
          console.log(reqdata.data.earnings_list, "reqdata.data.thcDeviceInfo");
          opt.thcPackInfo = reqdata.data.earnings_list;
          if (reqdata.data.info.thcPackInfo != null) {
            obj.pack_id = reqdata.data.info.thcPackInfo.title;
          }

          console.log(obj, "obj");
        }
        // setBranchData(obj.thcShopBrancInfo[0]);
        setFormOption(opt);
        setFormData(obj);
        setIsOpenModal(true);
      } else {
        message.warning(reqdata.msg);
      }
    }
  };
  // 分钟详情
  const handlerList = async (record) => {
    setIsListModal(true);
    console.log(record, "record");
    let up = { limit: 10, page: 1 };
    setId(record.id);
    getShop(record.id, { ...up })
      .then((res) => {
        console.log(res.data.data, "修改");
        setList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 分店编辑
  const handlerBranch = async (record, num) => {
    // 查找分店
    console.log(record, "record");
    setBraSta(num);
    let arr = [];
    formData.thcShopBrancInfo.map((item) => {
      if (item.id == record.id) {
        for (let i in item) {
          if (i == "start_time") {
            item[i] = moment(item[i], "HH:mm");
          } else if (i == "end_time") {
            item[i] = moment(item[i], "HH:mm");
          } else if (i == "opening_date") {
            item[i] = moment(item[i], "YYYY-MM-DD");
          }
        }
        console.log(item, "item");
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
      }
    });
  };
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
  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
    setUpLogin(false);
  };
  const listCancel = () => {
    setIsListModal(false);
  };
  // 显示图片
  const handlePreview = async (file) => {
    console.log(file);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  //   上传图片
  const handleChange = ({ fileList: newFileList }, name, id) => {
    console.log(newFileList, name, id);
    setFileList({ ...fileList, [name]: newFileList });

    if (newFileList[newFileList.length - 1]?.response?.code === 200) {
      if (name == "sign_file_url") {
        // setFormData({
        //   ...formData,
        //   [name]:
        //     "https://l.src.xiaohuolongfujiankeji.com" +
        //     newFileList[newFileList.length - 1].response.data.url,
        // });
        setFileList({
          ...fileList,
          [name]: [],
        });
        PostFile(id.id, {
          sign_file_url: `          ${baseIMgURL}${
            newFileList[newFileList.length - 1].response.data.url
          }`,
        }).then((res) => {
          message.success("修改签约文件完成");
          getAllRoleGroupData();
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
                  arr.push(`${baseIMgURL}${item.response.data.url}`);
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
                  arr.push(`${baseIMgURL}${item.response.data.url}`);
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
            if (item.url || item.url == "") {
              arr.push(item.url);
            } else {
              arr.push(`${baseIMgURL}${item.response.data.url}`);
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
    if (item.url || item.url == "") {
      console.log(item, 1);
      return file.filter((item1) => item1 !== item.url);
    } else {
      console.log(item, 2);
      return file.filter(
        (item1) => item1 !== `${baseIMgURL}${item.response.data.url}`
      );
    }
  };
  const handlePicCancel =() => {
    console.log(99999);
   setPreviewOpen(false);
  };
  function Change() {
    if (stu == 0) {
      return (
        <>
          <Form.Item
            label="绑定的设备 "
            name="thcDeviceInfo"
            rules={[{ required: true, message: "请选择您解除的绑定" }]}
          >
            <Select
              mode="tags"
              style={{
                width: "100%",
              }}
              placeholder="Tags Mode"
              onChange={(item) => {
                console.log(item, "sdsd");
              }}
              // options={formOption.thcDeviceInfo}
            >
              {formOption.thcPackInfo.map((item, index) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.device_code}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      );
    } else if (stu == 1) {
      return (
        <>
          <Form.Item
            label="绑定设备"
            name="device_id"
            rules={[{ required: true, message: "请选择您的设备" }]}
          >
            <Select
              placeholder="请选择分类"
              showArrow
              value={formOption.device_id[0].value}
              onChange={(item) => {
                setFormData((preState) => ({
                  ...preState,
                  device_id: item,
                }));
              }}
              allowClear
            >
              {formOption.device_id.map((item, index) => (
                <Select.Option value={item.value} key={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      );
    } else if (stu == 2) {
      return (
        <>
          <Form.Item
            label="解除绑定"
            name="device_id_ary"
            rules={[{ required: true, message: "请选择您解除的绑定" }]}
          >
            <Select
              mode="tags"
              style={{
                width: "100%",
              }}
              placeholder="Tags Mode"
              onChange={(item) => {
                console.log(item, "sdsd");
              }}
              // options={formOption.thcDeviceInfo}
            >
              {formOption.thcDeviceInfo.map((item, index) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.device_code}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      );
    } else if (stu == 3) {
      return (
        <>
          <Form.Item
            label="修改套餐"
            name="pack_id"
            rules={[{ required: true, message: "请选择您的分类" }]}
          >
            <Select
              placeholder="请选择分类"
              showArrow
              onChange={(item) => {
                setFormData((preState) => ({
                  ...preState,
                  thcPackInfo: item,
                }));
              }}
              allowClear
            >
              {formOption.thcPackInfo.map((item, index) => (
                <Select.Option value={item.value} key={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
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
          <Breadcrumb.Item>店家列表</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <Form layout="inline" onFinish={onFinish} form={form}>
            <Form.Item label="联系方式" name="phone">
              <Input
                placeholder="请输入联系方式"
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
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
            <Form.Item label="门店状态" name="status">
              {btus()}
            </Form.Item>
          </Form>
        </Card>
        <Card>
          <Table
            scroll={{ x: 2000 }}
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
            {/* <Column
              align="center"
              title="店家id"
              dataIndex="id"
              key="id"
              fixed="left"
              
            /> */}
            <Column
              align="center"
              title="所属服务商"
              dataIndex="bus_name"
              render={(text, record) => (
                <div>{record.thcBusinessInfo.real_name}</div>
              )}
            />
            <Column align="center" title="店名" dataIndex="shop_name" />
            <Column align="center" title="联系人" dataIndex="real_name" />
            {/* <Column align="center" title="身份证号" dataIndex="idnum" /> */}
            <Column align="center" title="手机号" dataIndex="phone" />
            <Column
              align="center"
              title="企业营业执照"
              width={200}
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
              title="绑定套餐"
              dataIndex="thcPackInfo"
              render={(text, record) => (
                <span>
                  {record.thcPackInfo != null
                    ? record.thcPackInfo.title
                    : "未绑定套餐"}
                </span>
              )}
            />
            <Column
              align="center"
              title="具体地点"
              dataIndex="address"
              render={(text, record) => (
                <div>
                  {record.province}省{record.city}市
                  {record.district ? record.district + "县" : ""}
                  {record.address}
                </div>
              )}
            />
            <Column align="center" title="提现收益" dataIndex="money" />
            <Column
              align="center"
              title="当前分钟数"
              dataIndex="current_minute"
            />
            {status == 4 || status == 5 ? (
              <>
                <Column
                  align="center"
                  title="签约文件"
                  width={200}
                  dataIndex="sign_file_url"
                  render={(_, record) => (
                    <Image
                      preview={{
                        imgVisible: false,
                      }}
                      src={`${record.sign_file_url}`}
                    />
                  )}
                />
                <Column
                  align="center"
                  title="修改签约文件"
                  dataIndex="sign_file_url"
                  width={200}
                  render={(_, record) => (
                    <Upload
                      width={100}
                      name="file"
                      accept="image/*"
                      showUploadList={false}
                      fileList={fileList.sign_file_url}
                      action={"/common.upload/uploadImage"}
                      listType="picture"
                      onChange={(info) =>
                        handleChange(info, "sign_file_url", record)
                      }
                    >
                      <Button style={{ width: "20" }} icon={<UploadOutlined />}>
                        修改签约文件
                      </Button>
                      {fileList.sign_file_url.length >= 0 ? null : null}
                    </Upload>
                  )}
                />

                <Column align="center" title="签约时间" dataIndex="sign_time" />
              </>
            ) : (
              <Column align="center" title="备注" dataIndex="remark" />
            )}

            <Column
              align="center"
              title="状态"
              dataIndex="status"
              key="status"
              render={(_, record) => (
                <Tag color="#108ee9">
                  {record.status === 4
                    ? "未绑定设备"
                    : record.status === 5
                    ? "已绑定设备"
                    : record.status === 6
                    ? "未通过"
                    : "已注销"}
                </Tag>
              )}
            />

            <Column
              align="center"
              title="操作"
              key="operation"
              width={100}
              render={(_, record) => (
                <Space size="middle">
                  {routerContant("/tdb/index/a/tdb.Thcshop/b/edit") ? (
                    <>{statuses(record)}</>
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
            // onOk={handleOk}
            onCancel={handleCancel}
            footer={
              stu == 0
                ? null
                : [
                    <Button onClick={handleCancel}>取消</Button>,
                    <Button type="primary" loading={upLogin} onClick={handleOk}>
                      确定
                    </Button>,
                  ]
            }
            // okText="确定"
            // cancelText="取消"
            zIndex={10}
          >
            <Form
              // form={keyForm}
              ref={formRef}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 20 }}
              autoComplete="off"
              initialValues={{ ...formData }}
              disabled={stu == 0 ? true : false}
            >
              {stu == 0 || stu == 5 ? (
                <>
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
                    rules={[
                      {
                        required: true,
                        message: "请输入联系方式",
                        pattern: /^1[3456789]\d{9}$/,
                      },
                    ]}
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
                    rules={[
                      {
                        required: true,
                        message: "请输入身份证",
                        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                      },
                    ]}
                  >
                    <Input placeholder="请输入身份证" />
                  </Form.Item>

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
                      onRemove={(file) => handleRemove(file, "id_card_photo")}
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
                        handleRemove(file, "bus_license_phone")
                      }
                      onChange={(info) =>
                        handleChange(info, "bus_license_phone")
                      }
                    >
                      {fileList.bus_license_phone.length >= 1
                        ? null
                        : "+ 请上传企业营业执照"}
                    </Upload>
                  </Form.Item>
                  <City
                    province={formData.province}
                    city={formData.city}
                    district={formData.district}
                  />

                  <Form.Item
                    label="详细地址"
                    name="address"
                    rules={[{ required: true, message: "请输入详细地址" }]}
                  >
                    <Input placeholder="请输入详细地址" />
                  </Form.Item>

                  <>
                    {stu == 0 ? (
                      <>
                        <Form.Item
                          label="绑定的设备"
                          name="thcDeviceInfo"
                          rules={[
                            { required: true, message: "请选择您解除的绑定" },
                          ]}
                        >
                          <Select
                            mode="tags"
                            style={{
                              width: "100%",
                            }}
                            placeholder="未绑定设备"
                            onChange={(item) => {
                              console.log(item, "sdsd");
                            }}
                            // options={formOption.thcDeviceInfo}
                          >
                            {formOption.thcDeviceInfo.map((item, index) => (
                              <Select.Option value={item.id} key={item.id}>
                                {item.device_code}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="绑定的套餐"
                          name="thcPackInfo"
                          rules={[
                            { required: true, message: "请选择您的分类" },
                          ]}
                        >
                          <Select
                            placeholder="未绑定套餐"
                            showArrow
                            onChange={(item) => {
                              setFormData((preState) => ({
                                ...preState,
                                thcPackInfo: item,
                              }));
                            }}
                            allowClear
                          >
                            {formOption.thcPackInfo.map((item, index) => (
                              <Select.Option
                                value={item.value}
                                key={item.value}
                              >
                                {item.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </>
                    ) : null}
                    {stu == 5 ? (
                      <>
                        <Form.Item
                          label="修改密码"
                          name="password"
                          // rules={[{ required: true, message: "请上传证件照" }]}
                        >
                          <Input
                            placeholder="如果不修改密码，请留空"
                            onChange={(value) => {
                              setFormData({
                                ...formData,
                                password: value.target.value,
                              });
                            }}
                          />
                        </Form.Item>
                      </>
                    ) : null}
                  </>
                </>
              ) : (
                <>{Change()}</>
              )}
              <Form.Item
                label="备注"
                name="remark"
                // rules={[{ required: true, message: "请输入备注" }]}
              >
                <Input
                  placeholder="请输入备注"
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      remark: value.target.value,
                    });
                  }}
                />
              </Form.Item>
              {stu == 0 || stu == 5 ? (
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
              ) : null}
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
        width={1000}
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
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
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
              // setIsOpenModal(true)
            }}
          >
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={baLogin}
            onClick={brancOK}
          >
            确定
          </Button>,
        ]}
        zIndex={12}
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
          <City
            province={branchData.province}
            city={branchData.city}
            district={branchData.district}
          />
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
              },
            ]}
          >
            <TimePicker format="HH:mm" />
            {/* <TimePicker 
                   format="HH:mm"
                    /> */}
            {/* <Input placeholder="请输入营业开始时间XX:XX" /> */}
          </Form.Item>
          <Form.Item
            label="营业结束时间"
            name="end_time"
            rules={[
              {
                required: true,
                message: "请输入营业结束时间XX:XX",
              },
            ]}
          >
            {/* <TimePicker
                      
                   defaultValue={moment(branchData.end_time, "HH:mm:ss")}
             
                    /> */}
            {/* <Input placeholder="请输入营业结束时间XX:XX" /> */}
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            label="开业时间"
            name="opening_date"
            rules={[
              {
                required: true,
                message: "请输入营业时间",

                message: "请输入正确的时间格式",
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
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
      {isListModal ? (
        <Modal
          width={1200}
          title="详情"
          open={isListModal}
          onCancel={listCancel}
          footer={null}
        >
          <Table
            scroll={{ x: 800 }}
            pagination={{
              total: listPramas.total,
              pageSize: listPramas.limit,
              page: listPramas.page,
              onChange: (page, pageSize) => {
                handleListChange(page, pageSize);
              },
            }}
            rowKey="id"
            dataSource={list}
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            <Column
              align="center"
              title="增加或减少分钟数"
              dataIndex="minute"
            />
            <Column
              align="center"
              title="操作后分钟数"
              dataIndex="remain_minute"
            />
            <Column align="center" title="操作时间" dataIndex="created_at" />
            <Column align="center" title="说明" dataIndex="declare" />
          </Table>
        </Modal>
      ) : null}
    </div>
  );
}
