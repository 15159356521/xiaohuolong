import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Card } from "antd";
import styles from "./index.module.scss";

import { PersonalApi } from "../../utils/api";
import { getstore_id } from "../../utils/store_id";

const store_id = getstore_id();
export default function Personal() {
  // 上传表单
  const [form] = Form.useForm();

  let real_name = localStorage.getItem("real_name");
  const [nicknameInput, setNicknameInput] = useState(real_name);
  const [personal, setPersonal] = useState({
    bank_name: "",
    bank_no: "",
    phone: "",
  });
  useEffect(() => {
    PersonalApi({ store_id }).then((res) => {
      console.log(res.data.data);
      setPersonal((preState) => ({
        ...preState,
        bank_name: res.data.data.bank_name,
        bank_no: res.data.data.bank_no,
        phone: res.data.data.phone,
        real_name: res.data.data.real_name,
      }));
      // form.setFieldsValue({

      // })
    });
  }, []);

  const onFinish = (values) => {
    console.log("Success:", values);
    values.real_name = nicknameInput;
    let real_name = values.real_name;
    PersonalApi({ real_name, store_id }).then((res) => {
      if (res.data.code === 1) {
        message.success(res.data.msg);
        // console.log(res.data.data.datas.real_name);
        window.localStorage.setItem("real_name", res.data.data.datas.real_name);
        window.location.reload();
      } else {
        message.warning(res.data.msg);
      }
    });
  };
  const handleClick = () => {
    console.log(11111);
  };

  return (
    <div className={styles.root}>
      <Card>
        <Form
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          name="nest-messages"
          form={form}
          layout="horizontal"
        >
          <Form.Item
            // name="nickname"
            label="昵称"
          >
            {/* value={personal.nickname} */}

            <Input
              // value={personal.real_name}
              value={nicknameInput}
              onChange={(e) => {
                setNicknameInput(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="银行">
            <Input value={personal.bank_name} disabled />
          </Form.Item>
          <Form.Item label="银行卡号">
            <Input value={personal.bank_no} disabled />
          </Form.Item>
          <Form.Item label="银行预留手机号">
            <Input value={personal.phone} disabled />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 12,
              span: 12,
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
}
