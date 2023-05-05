import { Card, Table } from "antd";
import React, { useState, useEffect } from "react";
import { Space, Input, Form, Button, Modal, message } from "antd";
import "moment/locale/zh-cn";

import styles from "./index.jsx.module.scss";
import {
  // StoregrouplistApi,
  // StoreShopcgroupApi,
  // StoregroupselApi,
  // StoregroupcompileApi,
  // StoregroupdelApi,
  // StoreselgroupApi,
  // StoregroupdeleteApi,
  // StoregroupadddevApi,
  StoretitleaddgroupApi,
  StoreselectgroupstoreApi,
  StoregroupdelgroupApi,
  StoregroupupdategroupApi,
} from "../../../utils/api";
export default function Storeclassify() {
  // const [form] = Form.useForm();
  // // 编辑
  // const [valuesdata, setValuesdata] = useState("");
  // const [recodeid, setRecodeid] = useState();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isModalOpenxq, setIsModalOpenxq] = useState(false);
  // const [xqdata, setXqdata] = useState();
  // const [isModalOpenwfz, setIsModalOpenwfz] = useState(false);
  // // 点击获取编辑id
  // const [bianjirid, setBianjirid] = useState();
  // const showModal = (recode) => {
  //   setIsModalOpen(true);
  //   console.log(recode);
  //   setRecodeid(recode.id);
  // };
  // const handleOk = () => {
  //   setIsModalOpen(false);
  //   console.log(valuesdata);
  //   StoregroupcompileApi({ id: recodeid, title: valuesdata }).then((res) => {
  //     console.log(res.data.code);
  //     if (res.data.code === 1) {
  //       message.success(res.data.msg);
  //       StoregroupselApi().then((res) => {
  //         setData1(res.data.data);
  //       });
  //     } else {
  //       message.error(res.data.msg);
  //     }
  //   });
  // };
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  // 查看详情
  // const showModalxiaangqing = (recode) => {
  //   console.log(recode);
  //   setBianjirid(recode.id);
  //   // console.log(titledata);
  //   setIsModalOpenxq(true);
  //   StoreselgroupApi({ id: recode.id }).then((res) => {
  //     console.log(res.data.data);
  //     setXqdata(res.data.data);
  //   });
  // };

  // const handleOkxq = () => {
  //   setIsModalOpenxq(false);
  // };
  // const handleCancelxq = () => {
  //   setIsModalOpenxq(false);
  // };

  // const columnsxq = [
  //   {
  //     title: "姓名",
  //     dataIndex: "real_name",
  //     key: "real_name",
  //   },
  //   {
  //     title: "门店名称",
  //     dataIndex: "shop_name",
  //     key: "shop_name",
  //   },
  //   {
  //     title: "联系人手机号",
  //     dataIndex: "phone",
  //     key: "phone",
  //   },
  //   {
  //     title: "地址",
  //     dataIndex: "address",
  //     key: "address",
  //   },
  //   {
  //     title: "营业执照照片",
  //     dataIndex: "bus_license_phone",
  //     key: "bus_license_phone",
  //     render: (_, rocord) => (
  //       <Image
  //         width={60}
  //         height={60}
  //         src={rocord.bus_license_phone}
  //         alt="头像"
  //       />
  //     ),
  //   },

  //   {
  //     title: "创建时间",
  //     dataIndex: "created_at",
  //     key: "created_at",
  //   },
  //   {
  //     title: "操作",
  //     dataIndex: "del",
  //     key: "del",
  //     render: (_, recode) => {
  //       return (
  //         <>
  //           <Space>
  //             <Button
  //               type="link"
  //               onClick={() => {
  //                 console.log(bianjirid, recode.id);
  //                 StoregroupdeleteApi({ id: recode.id, de_id: bianjirid }).then(
  //                   (res) => {
  //                     console.log(res);
  //                     if (res.data.code === 1) {
  //                       message.success(res.data.msg);
  //                       StoreselgroupApi({ id: bianjirid }).then((res) => {
  //                         console.log(recode);
  //                         setXqdata(res.data.data);
  //                         StoregroupselApi().then((res) => {
  //                           setData1(res.data.data);
  //                         });
  //                       });
  //                     }
  //                   }
  //                 );
  //               }}
  //             >
  //               删除
  //             </Button>
  //           </Space>
  //         </>
  //       );
  //     },
  //   },
  // ];

  // 保存的分组数据
  const [data, setData] = useState();
  const [recodeid, setRecodeid] = useState();
  const [isModalOpenmake, setIsModalOpenmake] = useState(false);
  const [form]=Form.useForm();
  const [keyForm]=Form.useForm();
  const showModalmake = () => {
    form.resetFields();
    setIsModalOpenmake(true);
  };
  const handleCanceltitlebianji = () => {
    setIsModalOpenmake(false);
  };

  const onFinishtitlestorebianji = (values) => {
    let title = values.title;
    console.log(title);
    StoregroupupdategroupApi({ title, id: recodeid }).then((res) => {
      console.log(res);
      if (res.data.code === 1) {
        message.success(res.data.msg);
        StoreselectgroupstoreApi().then((res) => {
          console.log(res.data.data);
          setData(res.data.data);
        });
        setIsModalOpenmake(false);
      }
    });
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "分组名称",
      dataIndex: "title",
      key: "title",
    },
    // {
    //   title: "店名",
    //   dataIndex: "include",
    //   key: "include",
    // },
    {
      title: "统计数",
      dataIndex: "allshop",
      key: "allshop",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
    },

    {
      title: "操作",
      dataIndex: "del",
      key: "del",
      render: (_, recode) => {
        return (
          <>
            <Space>
              <Button
                type="link"
                onClick={() => {
                  StoregroupdelgroupApi({ id: recode.id }).then((res) => {
                    console.log(res);
                    if (res.data.code === 1) {
                      message.success(res.data.msg);
                      StoreselectgroupstoreApi().then((res) => {
                        console.log(res.data.data);
                        setData(res.data.data);
                      });
                    }
                  });
                }}
              >
                删除
              </Button>
              {/* <Button type="link" onClick={() => showModal(recode)}>
                编辑
              </Button> */}
              <Button
                type="link"
                onClick={() => {
                  showModalmake();
                  console.log(recode.id,'sdfsdf');
                  setRecodeid(recode.id);
                }}
              >
                编辑
              </Button>
              {/* <Button type="link" onClick={() => {}}>
                添加
              </Button> */}
            </Space>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    StoreselectgroupstoreApi().then((res) => {
      console.log(res.data.data);
      setData(res.data.data);
    });
  }, []);

  const [isModalOpentitle, setIsModalOpentitle] = useState(false);

  const handlestorelist = () => {
    keyForm.resetFields();
    setIsModalOpentitle(true);
  };

  const handleCanceltitle = () => {
    setIsModalOpentitle(false);
  };
  // 保存
  const onFinishtitlestore = (values) => {
    let title = values.title;
    console.log(title);
    StoretitleaddgroupApi({ title }).then((res) => {
      console.log(res);
      if (res.data.code === 1) {
        message.success(res.data.msg);
        StoreselectgroupstoreApi().then((res) => {
          console.log(res.data.data);
          setData(res.data.data);
        });
        setIsModalOpentitle(false);
      } else {
        message.error(res.data.msg);
      }
    });
  };
  // 分页
  const paginationProps = {
    hideOnSinglePage: true,
  };
  return (
    <div className={styles.root}>
      <Card>
        <Button type="primary" onClick={handlestorelist}>
          添加店家分组
        </Button>
      </Card>
      <Modal
        title="店家分组名称"
        open={isModalOpentitle}
        footer={[]}
        onCancel={handleCanceltitle}
        destroyOnClose={true}
      >
        <Form
          name="horizontal_login"
          layout="inline"
          onFinish={onFinishtitlestore}
          form={keyForm}
        >
          <Form.Item name="title">
            <Input placeholder="请输入分组名称" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Card>
        <Table
         scroll={{ x:1200 }}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
        />
      </Card>
      <Modal
        title="修改"
        open={isModalOpenmake}
        footer={[]}
        onCancel={handleCanceltitlebianji}
      >
        <Form
          name="horizontal_login"
          layout="inline"
          form={form}
          onFinish={onFinishtitlestorebianji}
        >
          <Form.Item name="title">
            <Input placeholder="请输入分组名称" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
