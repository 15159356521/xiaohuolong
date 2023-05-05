import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSubAccount } from "../../api/user";
import { ProFormCaptcha } from "@ant-design/pro-components";
import { Table, Modal, Pagination } from "antd";
import styles from "./subAccount.module.scss";

const { Column } = Table;

const SubAccount = () => {
  //保存的localStorage值
  const Id = localStorage.getItem("Id");

  const [data, setData] = useState([]);

  useEffect(() => {
    // axios.post("sub_admin/subcontractor.SubcontractorSubc/sel", {
    //   id: Id,
    //   page: 1,
    // });
    // console.log(11111111111);
    getSubAccount(1, 10)
      .then(function (response) {
        console.log(response);
        console.log(11111111111);
        setData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const [openphone, setopenphone] = useState(false);
  const [phone, setPhone] = useState();

  useEffect(() => {
    let phone1 = localStorage.getItem("phone");
    setPhone(phone1);
  });
  // 显示确定
  const clickOk = () => {
    console.log(222);
    setopenphone(false);
  };
  // 显示取消
  const clickCancel = () => {
    setopenphone(false);
  };
  // 登陆账号显示

  const handlermodal = () => {
    setopenphone(true);
  };

  const handlerchange = (page, pageSize) => {
    console.log(page, pageSize);
    getSubAccount(page, pageSize)
      .then(function (response) {
        console.log(response);
        setData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      <Table
        dataSource={data}
        className={styles.table}
        //
        pagination={false}
      >
        <Column dataIndex="id" key="id" title="id"></Column>
        <Column dataIndex="level" key="level" title="账号等级"></Column>
        <Column
          dataIndex="phone"
          key="phone"
          title=<span>
            登陆账号 <a onClick={handlermodal}>显示</a>
            <Modal
              title="显示手机号"
              style={{ marginTop: "200px" }}
              open={openphone}
              onOk={clickOk}
              onCancel={clickCancel}
              okText="确认"
              cancelText="取消"
            >
              已绑定:&nbsp;&nbsp;
              <label>{phone}</label>
              <ProFormCaptcha
                fieldProps={{
                  size: "large",
                }}
                captchaProps={{
                  size: "large",
                }}
                placeholder={"请输入验证码"}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${"获取验证码"}`;
                  }
                  return "获取验证码";
                }}
                name="captcha"
                rules={[
                  {
                    len: 6,
                    required: true,
                    message: "请输入验证码！",
                  },
                ]}
                onGetCaptcha={async () => {
                  console.log(1);
                }}
              />
            </Modal>{" "}
          </span>
        ></Column>
        <Column dataIndex="nickname" key="nickname" title="账号名称"></Column>
        <Column dataIndex="status" key="status" title="审核"></Column>
        <Column dataIndex="settlement" key="settlement" title="代结算"></Column>
        <Column dataIndex="grade" key="grade" title="等级"></Column>
        <Column dataIndex="add_time" key="add_time" title="加入时间"></Column>
      </Table>
      <Pagination
        total={30}
        onChange={handlerchange}
        defaultCurrent={1}
        style={{ marginTop: "10px", marginLeft: "400px" }}
      />
    </div>
  );
};

export default SubAccount;
