import React, { useEffect, useState } from "react";
import { Input, Form, Button, Card, message } from "antd";
import { StoreCustomercaddApi } from "../../utils/api";
import { getstore_id } from "../../utils/store_id";
import { StoreSelminApi } from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
export default function Minup() {
  const navigate = useNavigate();
  const name = localStorage.getItem("real_name");
  let params = useParams();
  console.log(params.id);
  const store_id = getstore_id();
  const [datamin, setDatamin] = useState();
  useEffect(() => {
    let id = localStorage.getItem("id");
    StoreSelminApi({ id, store_id }).then((res) => {
      // console.log(res.data.data.current_minute);
      setDatamin(res.data.data.current_minute);
    });
  });

  const onFinish = (values) => {
    let id = localStorage.getItem("id");
    let num = values.num;
    let user_id = params.id;
    StoreCustomercaddApi({ num, id, user_id, name, store_id }).then((res) => {
      console.log(res);
      if (res.data.code === 1) {
        message.success(res.data.msg);
        setTimeout(() => {
          navigate("/Operation/member");
        }, 1500);
      } else {
        message.error(res.data.msg);
      }
    });
  };

  return (
    <div>
      {" "}
      <Card>
        <Form
          layout="inline"
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
        >
          <Form.Item label="剩余分钟">
            <Input value={datamin} />
          </Form.Item>

          <Form.Item label="充值分钟" name="num">
            <Input type="number" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
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
}
