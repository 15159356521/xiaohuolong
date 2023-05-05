import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { StoreBankCardwApi, StorelistshopbrachselApi } from "../../utils/api";
import { getstore_id } from "../../utils/store_id";
import styles from "./index.module.scss";
import { useState, useEffect } from "react";
const BankCardw = (props) => {
  const [disabled, setDisabled] = useState(false);
  const id = localStorage.getItem("id");
  const store_id = getstore_id();
  const [form] = Form.useForm();
  // const [bank, setBank] = useState({
  //   bank_branch: "",
  //   bank_name: "",
  //   bank_no: "",
  //   idnum: "",
  //   phone: "",
  //   real_name: "",
  // });
  const onFinish = (values) => {
    console.log(values);
    StoreBankCardwApi({
      real_name: values.real_name,
      phone: values.phone,
      card: values.idnum,
      bankname: values.bank_name,
      bankcard: values.bank_no,
      bankbranch: values.bank_branch,
      id,
      store_id,
    }).then((res) => {
      console.log("=================================", res.data.data);
      if (res.data.code === 1) {
        message.success(res.data.msg);
      } else {
        message.error(res.data.msg);
      }
      setDisabled(!false);
    });
  };
  useEffect(() => {
    StorelistshopbrachselApi({ id, store_id }).then((res) => {
      console.log("------------------", res.data.data);
      console.log(res.data.code);
      if (res.data.code == 1) {
        // setBank((preState) => ({
        //   ...preState,
        //   bank_branch: res.data.data[0].bank_branch,
        //   bank_name: res.data.data[0].bank_name,
        //   bank_no: res.data.data[0].bank_no,
        //   idnum: res.data.data[0].idnum,
        //   phone: res.data.data[0].phone,
        //   real_name: res.data.data[0].real_name,
        // }));
        form.setFieldsValue({
          bank_branch: res.data.data[0].bank_branch,
          bank_name: res.data.data[0].bank_name,
          bank_no: res.data.data[0].bank_no,
          idnum: res.data.data[0].idnum,
          phone: res.data.data[0].phone,
          real_name: res.data.data[0].real_name,
        });
      }
      if (res.data.data[0].real_name) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    });
  }, [store_id]);

  return (
    <div className={styles.root}>
      <Card>
        <Form
          name="nest-messages"
          form={form}
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{ width: "400px" }}
          disabled={disabled}
        >
          <Form.Item
            label="真实姓名"
            name="real_name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            {/* <Input /> */}
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="预留手机号"
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
            name="idnum"
            label="身份证号"
            rules={[
              {
                required: true,
                pattern:
                  /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                message: "请输入正确的身份证号!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bank_name"
            label="所属银行"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bank_no"
            label="银行卡号"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bank_branch"
            label="开户行支行"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 14,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BankCardw;
