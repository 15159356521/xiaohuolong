// import React from "react";
// import { UploadOutlined } from "@ant-design/icons";
// import { Form, Input, Button, Radio, Upload } from "antd";
// import styles from "./index.module.scss";
// // 提现
// const onFinish = (values) => {
//   console.log(values);
// };
// // 图片显示
// const fileList = [
//   {
//     uid: "-1",
//     name: "xxx.png",
//     status: "done",
//     url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
//     thumbUrl:
//       "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
//   },
// ];

// //监听开票方式
// const handleChange = (e) => {
//   let formbox = document.getElementsByClassName("formbox")[0];
//   console.log(e.target.value);
//   let frombox_id = e.target.value;
//   if (frombox_id === "b") {
//     formbox.style.display = "block";
//   } else {
//     formbox.style.display = "none";
//   }
// };

// export default function WeChatw() {
//   return (
//     <div className={styles.root}>
//       <div>
//         <span style={{ marginRight: "30px", color: "red" }}>到账说明</span>
//         <span>
//           结算上个月底以前的全部金额；微信提现1个工作日内，银行卡提现3个工作日内。
//         </span>
//       </div>
//       <div style={{ marginTop: "30px" }}>
//         <Form
//           layout="inline"
//           name="nest-messages"
//           initialValues={{
//             remember: true,
//           }}
//         >
//           <Form.Item name="username" label="姓名">
//             <Input />
//           </Form.Item>
//           <Form.Item name="phone" label="银行卡号">
//             <Input />
//           </Form.Item>
//           <Form.Item name="address" label="提现截止">
//             <Input />
//           </Form.Item>
//         </Form>
//       </div>
//       <div style={{ marginTop: "30px" }}>
//         <Form.Item label="开票方式">
//           <Radio.Group
//             defaultValue="a"
//             buttonStyle="solid"
//             onChange={handleChange}
//           >
//             <Radio.Button value="a">代开</Radio.Button>
//             <Radio.Button value="b">自提供</Radio.Button>
//           </Radio.Group>
//         </Form.Item>
//         <div className="formbox">
//           <Form>
//             <Form.Item label="上传发票">
//               <Button icon={<UploadOutlined />}>上传发票</Button>
//               <Upload
//                 maxCount="1"
//                 action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
//                 listType="picture"
//                 defaultFileList={[...fileList]}
//                 className="upload-list-inline"
//               ></Upload>
//             </Form.Item>
//           </Form>
//         </div>
//       </div>
//       <div style={{ marginTop: "30px" }}>
//         <span style={{ marginRight: "30px", color: "red" }}>手续费说明</span>
//         <span>
//           *跨行提现手续费说明，1万y以为5元，1～5万0元，5万以上15元，代开发票按照百分之3收取。
//         </span>
//       </div>
//       <div style={{ marginTop: "30px" }}>
//         <Form
//           layout="horizontal"
//           name="nest-messages"
//           onFinish={onFinish}
//           labelCol={{
//             span: 8,
//           }}
//           wrapperCol={{
//             span: 16,
//           }}
//           initialValues={{
//             remember: true,
//           }}
//           style={{ width: "400px" }}
//         >
//           <Form.Item name="username" label="姓名">
//             <Input />
//           </Form.Item>
//           <Form.Item name="phone" label="银行卡号">
//             <Input />
//           </Form.Item>
//           <Form.Item name="address" label="提现截止">
//             <Input />
//           </Form.Item>
//           <Form.Item name="1125" label="提现金额">
//             <Input />
//           </Form.Item>
//           <Form.Item name="aess" label="开户行支行">
//             <Input />
//           </Form.Item>
//           <Form.Item
//             wrapperCol={{
//               offset: 14,
//               span: 16,
//             }}
//           >
//             <Button type="primary" htmlType="submit">
//               提交申请
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// }
