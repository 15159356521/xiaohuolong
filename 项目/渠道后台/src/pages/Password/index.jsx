import { Button, Checkbox, Form, Input, message, Modal, Card } from "antd";
import React, { useState } from "react";
import styles from "./index.module.scss";
import { PasswordApi } from "../../utils/api";
import { getstore_id } from "../../utils/store_id";
import { useNavigate } from "react-router-dom";
const Password = () => {
  const store_id = getstore_id();
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Success:", values);
    let oldpwd = values.oldpassword;
    let newpwd = values.newpassword1;
    if (values.newpassword1 === values.newpassword2) {
      PasswordApi({ oldpwd, newpwd, store_id }).then((res) => {
        console.log(res);
        if (res.data.code === 1) {
          message.success(res.data.msg);
          setTimeout(() => {
            window.localStorage.clear();
            navigate("/login");
          }, 1500);
        } else {
          message.error(res.data.msg);
        }
      });
    } else {
      message.error("两次密码输入不一致！");
    }
  };

  return (
    <div className={styles.root}>
      <Card>
        <Form
          
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="原密码"
            name="oldpassword"
            
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password placeholder="请输入原密码" value="" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newpassword1"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            label="重复新密码"
            name="newpassword2"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 12,
            }}
          >
            <Button type="primary" htmlType="submit">
              立即提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default Password;
