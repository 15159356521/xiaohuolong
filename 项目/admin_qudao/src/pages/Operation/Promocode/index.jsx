import React from "react";
import { Form, Button, Input, message, Card } from "antd";
import QRCode from "qrcode.react";
import styles from "./index.module.scss";
const inputChange = (e) => {
  console.log(e);
};

export default function Promocode() {
  // let sid = session.getAttribute("record");
  // console.log(sid);

  const id = localStorage.getItem("id");
  // const value = `https://sub.admin.longyaoapp.com/#/prozhuce/${id}`;
  const value = `https://sub.admin.longyaoapp.com/zhuce/img.html?id=${id}`;
  const handleClick = () => {
    navigator.clipboard.writeText(value).then((res) => {
      message.success("复制成功");
    });
  };
  // const handleClicktz = () => {
  //   window.open(
  //     "about:blank"
  //   ).location.href = `https://sub.admin.longyaoapp.com/zhuce/img.html?id=${id}`;
  // };
  return (
    <div className={styles.root}>
      <div className="divbox">
        <Card>
          <Form
            name="horizontal_login"
            layout="inline"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
          >
            <Form.Item label="推广码链接">
              <Input value={value} bordered={false} />
            </Form.Item>
            <br />{" "}
            <Button type="primary" danger onClick={handleClick}>
              复制
            </Button>
            {/* <Button type="primary" onClick={handleClicktz}>
              跳转
            </Button> */}
          </Form>
          <div 
          className="foot"
          style={{}}>
            {" "}
            <QRCode
              value={value}
              //value参数为字符串类型
              size={200} //二维码的宽高尺寸
              fgColor="#000000" //二维码的颜色
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
