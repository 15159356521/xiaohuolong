import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Switch,
  Card,
  Button,
  Table,
  Modal,
  Form,
  message,
  Input,
  Breadcrumb,
  InputNumber,
} from "antd";
import styles from "./index.module.scss";
import { getAllList, getUp, PostUp, postDel } from "@/api/order.class.js";
import routerContant from "@/utils/constant";
export default function Index() {
  //   收货信息
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTablieData] = useState([]);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const getAll = async () => {
    const {
      data: { data },
    } = await getAllList();
    setTablieData(data);
  };
  useEffect(() => {
    (async function () {
      getAll();
    })();
  }, []);
  //   收货数据修改
  const handleOk = async () => {
    const fileds = await form.validateFields();
  fileds.id= formData.category_id;
    fileds.status = fileds.status ? 10 : 20;
console.log(fileds);
    try {
      
      const {
        data: { code },

      } = await PostUp({...fileds});
      console.log(code);
      if (code == 200) {
        message.success({
          content: "操作成功",
          key: "wind",
        });
      
        setIsOpenModal(false);
        form.setFieldsValue({
          id: "",
          name: "",
          sort: "",
          status: "",
        });
        getAll();
        setFormData({});
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const handleCancel = () => {
    form.setFieldsValue({
      id: "",
      name: "",
      sort: "",
      status: "",
    });
    setFormData({});
    console.log(form.getFieldsValue());
    setIsOpenModal(false);
    setLoading(false);
  };
  const receiving = [
    {
      title: "产品分类",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "排序",
      dataIndex: "sort",
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <Switch
              checkedChildren="显示"
              unCheckedChildren="隐藏"
              defaultChecked={text == 10 ? true : false}
              onChange={async (e) => {
                const up = { ...record };
                console.log(up);
                up.status = e ? 10 : 20;
                up.id=up.category_id;
                const {
                  data: { code, msg },
                } = await PostUp({...up});
                console.log(code);
                if (code == 200) {
                  message.success({
                    content: "操作成功",
                    key: "wind",
                  });
                  getAll();
                } else {
                  message.warning({ content: "操作失败", key: "wind" });
                }
              }}
            />
          </>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "edit",
      align: "center",
      width: 150,
      render: (text, record) => (
        <>
               {routerContant("/mall/index/a/goods.Categoryc/b/singleindex") ? (
          <Button
            type="primary"
            onClick={() => {
              handlerEidt(record);
            }}
          >
            修改
          </Button>
        ) : null}
         {routerContant("/mall/index/a/goods.Categoryc/b/del") ? (
          <Button
            onClick={() => {
              Modal.confirm({
                title: "确定删除吗?",
                okText: "确认",
                cancelText: "取消",
                onOk: () => {
                  handlerDelete(record.category_id);
                },
              });
            }}
          >
            删除
          </Button>
        ) : null}
        </>
      ),
    },
  ];
  const handlerEidt = async (record) => {
    console.log(record, "sdfsdf");
    const { data:{data} } = await getUp(record.category_id);
    setFormData(data);
    form.setFieldsValue({
      ...data})

    setIsOpenModal(true);
  };
  const handlerDelete = async (id) => {
    const {
      data: { code },
    } = await postDel(id);
    if (code == 200) {
      getAll();
    }
  };

  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>产品分类</Breadcrumb.Item>
        </Breadcrumb>
      </Card>
      <Card>
      {routerContant("/mall/index/a/goods.Categoryc/b/addedit") ? (
        <Button
          type="primary"
          onClick={() => {
            setIsOpenModal(true);
          }}
        >
          添加
        </Button>
        ) : null}
        {routerContant("/mall/index/a/goods.Categoryc/b/index") ? (
        <Table
          columns={receiving}
          scroll={{ x: 600 }}
          dataSource={tableData}
          pagination={{ hideOnSinglePage: false, showSizeChanger: true }}
        ></Table>
        ) : null}
      </Card>
      {isOpenModal ? (
        <Modal
          width={1200}
          title={formData.id ? "修改" : "新增"}
          open={isOpenModal}
          afterClose={() => form.resetFields()}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
            >
              确定
            </Button>,
          ]}
        >
          <Form
            form={form}
      
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              ...formData,
            }}
            autoComplete="off"
          >
            <Form.Item
              label="分类名"
              name="name"
              rules={[
                {
                  required: true,
                  message: "请输入产品分类",
                },
              ]}
            >
              <Input placeholder="请输入产品分类" />
            </Form.Item>
            <Form.Item label="分类状态" name="status">
              <Switch
                checkedChildren="显示"
                unCheckedChildren="隐藏"
                defaultChecked={formData.status == 10 ? true : false}
              />
            </Form.Item>
            <Form.Item
              label="排序"
              name="sort"
              rules={[
                {
                  required: true,
                  message: "请输入分类排序",
                  pattern: new RegExp(/^[+]{0,1}(\d+)$/, "g"), message: "请输入大于等于0的数字"
                },
              ]}
            >
              <InputNumber style={{width:200}} placeholder="请输入分类排序" />
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </div>
  );
}
