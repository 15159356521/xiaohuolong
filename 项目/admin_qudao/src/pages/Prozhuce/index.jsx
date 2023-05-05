import React, { useEffect, useState } from "react";
import { StoreregisterApi } from "../../utils/api";
import styles from "./index.module.scss";
import {
  Form,
  Input,
  message,
  Upload,
  Button,
  Modal,
  Cascader,
  TimePicker,
  InputNumber,
  DatePicker,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import options from "./city.js";
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
// const id = localStorage.getItem("id");

export default function Prozhuce() {
  let params = useParams();
  console.log("==================", params.id);
  let id = params.id;

  const onFinish = (values) => {
    let bus_license_phone = values.imageUrl;
    let id_card_photo = values.imageUrlup;
    values.imageUrlcard = formData.imageUrlcard;
    let bus_license_phones = values.imageUrlcard;
    values.imageUrlcardup = formData.imageUrlcardup;
    let shop_images = values.imageUrlcardup;

    let shop_name = values.shop_name;
    let real_name = values.real_name;
    let phone = values.phone;
    let shop_branch_name = values.shop_branch_name;
    // let prd = values.prd.toString();
    let prd = values.prd;
    let address = values.address;
    let employee_num = values.employee_num;
    let area = values.area;
    let base_flow_rate = values.base_flow_rate;
    let business_format = values.business_format;

    console.log("Success:", values.shop_branch_name);

    StoreregisterApi({
      id,
      time,
      opening_date,
      shop_name,
      real_name,
      phone,
      bus_license_phone,
      id_card_photo,
      shop_branch_name,
      prd,
      address,
      employee_num,
      area,
      base_flow_rate,
      business_format,
      bus_license_phones,
      shop_images,
    }).then((res) => {
      console.log(res);
      if (res.data.code === 1) {
        message.success(res.data.msg);
      } else {
        setIsModalOpen(true);
        message.error(res.data.msg);
      }
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: [],
    imageUrlup: [],
    imageUrlcard: [],
    imageUrlcardup: [],
  });
  const [fileList, setFileList] = useState({
    imageUrl: [], //营业执照
    imageUrlup: [], //法人身份证
    imageUrlcard: [], //营业执照
    imageUrlcardup: [], //店内环境
  });
  const [form] = Form.useForm();
  const handleChange = ({ fileList: newFileList }, name) => {
    // console.log(newFileList, name);
    setFileList({ ...fileList, [name]: newFileList });
    let log = newFileList.length - 1;
    // console.log(newFileList[log].response);
    if (newFileList[log]?.response?.code === 1) {
      let imgUrl = formData[name];
      console.log(imgUrl, "sdweeewr");
      console.log(imgUrl, "sdfsdfsdf");

      if (imgUrl.length > 0) {
        imgUrl.push(
          "https://l.src.xiaohuolongfujiankeji.com" +
            newFileList[log].response.msg.url
        );
      } else {
        imgUrl[0] =
          "https://l.src.xiaohuolongfujiankeji.com" +
          newFileList[log].response.msg.url;
      }
      setFormData((preState) => ({
        ...preState,
        [name]: imgUrl,
      }));
      form.setFieldsValue({
        [name]: imgUrl,
      });

      console.log(form.getFieldValue(), "img");
    }
    // setFormData((preState) => ({ ...preState, [name]: file.fileList }));
  };

  // 监听对话框 城市地址 内容

  // const onSave = async () => {
  //   const values = await form.validateFields(); //2.表单验证并获取表单值
  //   console.log("=================-------------", values);
  // };
  const onChangecasc = (value) => {
    console.log(value);
  };

  // 开业时间
  const [opening_date, setOpening_date] = useState();
  //监听对话框 开始结束 内容
  const [time, setTime] = useState([]);
  const handleChangetime = (_, timer) => {
    console.log(timer);
    setTime(timer);
  };

  return (
    <div className={styles.root}>
      <div className="page-head">
        <div className="logo-box">
          <span style={{ marginLeft: "10px" }}>店家注册</span>
        </div>
      </div>

      <Form
        form={form}
        name="basic"
        layout="horizontal"
        onFinish={onFinish}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        // initialValues={{
        //   remember: true,
        // }}
        style={{ marginLeft: "10px" }}
      >
        <Form.Item>
          <div> 商家注册申请所需资料:</div>
        </Form.Item>
        <Form.Item
          name="shop_name"
          label="品牌名称"
          rules={[
            {
              required: true,
              message: "请输入您的品牌名称!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="real_name"
          label="联系人"
          rules={[
            {
              required: true,
              message: "请输入联系人!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="联系方式"
          name="phone"
          rules={[
            {
              required: true,
              pattern:
                /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/,
              message: "请输入正确的手机号!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="营业执照扫描件"
          name="imageUrl"
          rules={[
            {
              required: true,
              message: "请上传您的营业执照!",
            },
          ]}
        >
          <Upload
            name="file"
            maxCount={1}
            fileList={fileList.imageUrl}
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={true}
            action="https://sub.admin.longyaoapp.com/index.php/common.Upload/uploadImage"
            beforeUpload={beforeUpload}
            // onChange={handleChangeyyzz}
            onChange={(info) => handleChange(info, "imageUrl")}
          >
            {fileList.imageUrl.length >= 1 ? null : "+ 请上传签约文件"}
          </Upload>
        </Form.Item>
        <Form.Item
          label="法人身份证扫描件："
          name="imageUrlup"
          rules={[
            {
              required: true,
              message: "请上传您的身份证!",
            },
          ]}
        >
          <div style={{ display: "table" }}>
            <div style={{ display: "table-cell" }}>
              <Upload
                name="file"
                maxCount={2}
                fileList={fileList.imageUrlup}
                listType="picture-card"
                className="avatar-uploader"
                c
                action=" https://sub.admin.longyaoapp.com/index.php/common.Upload/uploadImage"
                beforeUpload={beforeUpload}
                // onChange={handleChangefrsfz}
                onChange={(info) => handleChange(info, "imageUrlup")}
              >
                {fileList.imageUrlup.length >= 2 ? null : "+ 请上传签约文件"}
              </Upload>
            </div>
          </div>
        </Form.Item>
        <Form.Item
          label="我的门店"
          rules={[
            {
              required: true,
              message: "门店信息未填写!",
            },
          ]}
        >
          <Button type="primary" onClick={showModal}>
            设备投放地址
          </Button>
          <Modal
            title="分店申请所需资料："
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            // width={200}
            style={{ height: "1400px", width: "300px", marginLeft: "10px" }}
          >
            <Form.Item name="shop_branch_name" label="店名名称">
              <Input />
            </Form.Item>
            <Form.Item name="prd" label="店家地址">
              <Cascader
                options={options}
                onChange={onChangecasc}
                placeholder="请选择城市"
              />
            </Form.Item>
            <Form.Item label="详细地址" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="营业时间">
              {/* name="time" */}
              <TimePicker.RangePicker onChange={handleChangetime} />
            </Form.Item>
            <Form.Item label="员工人数" name="employee_num">
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="门店面积" name="area">
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="开业时间">
              {/* name="opening_date" */}
              <DatePicker
                onChange={(_, e) => {
                  console.log(e);
                  setOpening_date(e);
                }}
              />
            </Form.Item>
            <Form.Item label="基础流量（人/日" name="base_flow_rate">
              <Input />
            </Form.Item>
            <Form.Item label="经营业态" name="business_format">
              <Input />
            </Form.Item>
            <Form.Item
              label="操作人员身份证扫描件"
              rules={[
                {
                  required: true,
                  message: "请上传操作人员身份证!",
                },
              ]}
            >
              .
              <div style={{ display: "table-cell" }}>
                <Upload
                  name="file"
                  maxCount={2}
                  fileList={fileList.imageUrlcard}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={true}
                  action="https://sub.admin.longyaoapp.com/index.php/common.Upload/uploadImage"
                  beforeUpload={beforeUpload}
                  // onChange={handleChangefrsfz}
                  onChange={(info) => handleChange(info, "imageUrlcard")}
                >
                  {fileList.imageUrlcard.length >= 2
                    ? null
                    : "+ 请上传操作人员身份证"}
                </Upload>
              </div>
            </Form.Item>
            <Form.Item
              label="店内环境照片"
              rules={[
                {
                  required: true,
                  message: "请上传店内环境照片!",
                },
              ]}
            >
              <div style={{ display: "table" }}>
                <Upload
                  name="file"
                  maxCount={6}
                  fileList={fileList.imageUrlcardup}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={true}
                  action=" https://sub.admin.longyaoapp.com/index.php/common.Upload/uploadImage"
                  beforeUpload={beforeUpload}
                  // onChange={handleChangefrsfz}
                  onChange={(info) => handleChange(info, "imageUrlcardup")}
                >
                  {fileList.imageUrlcardup.length >= 6
                    ? null
                    : "+ 请上传店内环境照片"}
                </Upload>
              </div>
            </Form.Item>
            {/* <Form.Item>
                <Button type="primary" htmlType="submit">
                  完成
                </Button>
              </Form.Item> */}
          </Modal>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 9,
            span: 15,
          }}
        >
          <Button type="primary" htmlType="submit">
            申请
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
