import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Form, Input, Button, Radio, Upload, message, Card } from "antd";
import styles from "./index.module.scss";
import { StoreBankCardmApi } from "../../utils/api";
import { getstore_id } from "../../utils/store_id";
import { useForm } from "antd/es/form/Form";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
const store_id = getstore_id();
// 图片显示
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

  if (!isJpgOrPng) {
    message.error("请使用 JPG/PNG 格式!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isLt2M) {
    message.error("请上传小于2MB!");
  }

  return isJpgOrPng && isLt2M;
};

export default function BankCardm() {
  const [imgurl, setImgurl] = useState();

  const [loading, setLoading] = useState(false);
  // 图片显示
  const [imageUrl, setImageUrl] = useState("");

  const handleChangeimg = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        setImgurl(info.file.response.msg.url);
        console.log(info.file.response.msg.url);
      });
    }
  };

  // 提现
  const onFinish = (values) => {
    let num = 1;
    let img = imgurl;
    StoreBankCardmApi({ num, img, of, store_id }).then((res) => {
      console.log("===========", res.data.code);
      if (res.data.code === 1) {
        message.success(res.data.msg);
      } else {
        message.error(res.data.msg);
      }
    });
  };
  const form = useForm();
  const [of, setOf] = useState("1");
  //监听开票方式
  const handleChange = (e) => {
    let formboxa = document.getElementsByClassName("formboxa")[0];
    console.log(e.target.value);
    let frombox_id = e.target.value;
    setOf(frombox_id);
    if (frombox_id === "2") {
      formboxa.style.display = "block";
    } else {
      formboxa.style.display = "none";
    }
    // console.log(of);
  };

  // 银行卡提现查找
  const [bankdata, setBankdata] = useState({
    bank: "",
    bank_no: "",
    lastmoney: "",
    money: "",
    real_name: "",
    ticket: "",
    time: "",
  });

  useEffect(() => {
    StoreBankCardmApi({ of, store_id }).then((res) => {
      // console.log("============================", res.data.code);
      if (res.data.code == 1) {
        setBankdata((preState) => ({
          ...preState,
          bank: res.data.data.bank,
          bank_no: res.data.data.bank_no,
          lastmoney: res.data.data.lastmoney,
          money: res.data.data.money,
          real_name: res.data.data.real_name,
          ticket: res.data.data.ticket,
          time: res.data.data.time,
        }));
      }
    });
  }, [of]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传发票
      </div>
    </div>
  );

  // 自提供
  const handleClickztg = () => {
    console.log(of);
  };

  return (
    <div className={styles.root}>
      <Card>
        <div>
          <span style={{ marginRight: "30px", color: "red" }}>到账说明</span>
          <span>
            结算上个月底以前的全部金额；微信提现1个工作日内，银行卡提现3个工作日内。
          </span>
        </div>
        <div style={{ marginTop: "30px" }}>
          <Form
            layout="inline"
            name="nest-messages"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item label="姓名">
              <Input value={bankdata.real_name} />
            </Form.Item>
            <Form.Item label="银行卡号">
              <Input value={bankdata.bank_no} />
            </Form.Item>
            <Form.Item label="提现截止">
              <Input value={bankdata.time} />
            </Form.Item>
            <Form.Item label="提现金额">
              <Input value={bankdata.money} />
            </Form.Item>
          </Form>
        </div>
        <div style={{ marginTop: "30px" }}>
          <Form.Item label="开票方式">
            <Radio.Group
              defaultValue="1"
              buttonStyle="solid"
              onChange={handleChange}
            >
              <Radio.Button value="1">代开</Radio.Button>
              <Radio.Button value="2" onClick={handleClickztg}>
                自提供
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <div className="formboxa">
            <Form>
              <Form.Item label="上传发票">
                <Upload
                  name="file"
                  maxCount={1}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://sub.admin.longyaoapp.com/index.php/common.Upload/uploadImage"
                  beforeUpload={beforeUpload}
                  onChange={handleChangeimg}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="发票"
                      style={{
                        width: "90%",
                        height: "90%",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div style={{ marginTop: "30px" }}>
          <span style={{ marginRight: "30px", color: "red" }}>手续费说明</span>
          <span>
            *跨行提现手续费说明，1万y以为5元，1～5万0元，5万以上15元，代开发票按照百分之3收取。
          </span>
        </div>
        <div style={{ marginTop: "30px" }}>
          <Form
            layout="horizontal"
            name="nest-messages"
            // form={form}
            onFinish={onFinish}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            className="formOne"
            initialValues={{
              remember: true,
            }}
        
          >
            <Form.Item label="跨行提现费">
              <Input value={bankdata.bank} />
            </Form.Item>
            <Form.Item label="开票费用">
              <Input value={bankdata.ticket} />
            </Form.Item>

            <Form.Item label="可到账金额">
              <Input value={bankdata.lastmoney} />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 14,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                提交申请
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
}
