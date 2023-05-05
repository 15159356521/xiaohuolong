import {
  Button,
  Form,
  Table,
  Pagination,
  Input,
  Tabs,
  message,
  Card,
  Modal,
  Select,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  StoreDevicecApi,
  StoregroupDevicecApi,
  StoregroupdeviceselectApi,
  StoregrouplistxqdelApi,
  StoregroupselselApi,
  StoreaddgroupApi,
  StoreselectgroupApi,
  StoredelgroupApi,
  StoreupdategroupApi,
  StoregroupseltitleApi,
} from "../../../utils/api";
import { getstore_id } from "../../../utils/store_id";
const { Option } = Select;
const Equipmentlist = (props) => {
  const store_id = getstore_id();
  const [isModalOpenfenzulist, setIsModalOpenfenzulist] = useState(false);

  // 编辑id
  const [recodeid, setRecodeid] = useState();
  // 添加按钮Modal
  const [addmodal, setAddmodal] = useState(false);
  const showModal = () => {
    setIsModalOpenfenzulist(true);
  };
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    pageSize:10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const handleCancel = () => {
    setIsModalOpenfenzulist(false);
  };

  const columnsfenzu = [
    {
      title: "分组ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "统计数",
      dataIndex: "allserive",
      key: "allserive",
    },
    {
      title: "分组名称",
      dataIndex: "title",
      key: "title",
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
            <Button
              type="link"
              onClick={() => {
                console.log(recode.id);
                StoredelgroupApi({ id: recode.id }).then((res) => {
                  if (res.data.code === 1) {
                    message.success(res.data.msg);
                    StoreselectgroupApi({ store_id }).then((res) => {
                      setDataSourcefenzu(res.data.data);
                      StoreDevicecApi({ page, pageSize, store_id, num }).then(
                        (res) => {
                          setDataSource1(res.data.data);
                        }
                      );
                    });
                  } else {
                    message.error(res.data.msg);
                  }
                });
              }}
            >
              删除
            </Button>

            <Button
              type="link"
              onClick={(activeKey) => {
                showModal();
                console.log(recode.id);
                setRecodeid(recode.id);
              }}
            >
              编辑
            </Button>
            {/* </Link> */}
          </>
        );
      },
    },
  ];

  const onChangeKey = (e) => {
    console.log(e);
    if (e == "2") {
      StoreselectgroupApi({ store_id }).then((res) => {
        setDataSourcefenzu(res.data.data);
      });
    } else {
      StoreDevicecApi({ page, pageSize, store_id, num }).then((res) => {
        setSelarr(res.data.data[0].title);
        setDataSource1(res.data.data);
      });
    }
  };

  const num = 1;
  const [selarr, setSelarr] = useState([]);
  let page = 1;
  let pageSize = 10;
  useEffect(() => {
    StoreDevicecApi({ page, pageSize, store_id, num }).then((res) => {
      console.log("-------------------------", res.data.data[0].title);
      setSelarr(res.data.data[0].title);
      setPaginationPramas((preState) => ({
        ...preState,
        total: res.data.data.count,
      }));
      setDataSource1(res.data.data);
    });
  }, [page, pageSize, store_id]);
  const [dataSourcefenzu, setDataSourcefenzu] = useState([]);

  const [dataSource1, setDataSource1] = useState([]);
  const columns = [
    {
      title: "设备码",
      dataIndex: "device_code",
      key: "device_code",
    },
    {
      title: "迪文编码",
      dataIndex: "fullDeviceNum",
      key: "fullDeviceNum",
    },
    {
      title: "所属店家",
      dataIndex: "shop_name",
      key: "shop_name",
    },
    {
      title: "店家住址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "开机次数",
      dataIndex: "total_start_num",
      key: "total_start_num",
    },
    {
      title: "开机时长",
      dataIndex: "total_start_minute",
      key: "total_start_minute",
    },
    {
      title: "分组",
      dataIndex: "default",
      key: "default",
      render: (_, recode) => (
        <>
          <Select
            value={recode.default}
            style={{
              width: 120,
            }}
            onSelect={(_, v) => {
              StoregroupseltitleApi({ id: recode.id, title: v.value }).then(
                (res) => {
                  if (res.data.code === 1) {
                    message.success(res.data.msg);
                    // StoreselectgroupApi({ store_id }).then((res) => {
                    //   setDataSourcefenzu(res.data.data);
                    // });
                    StoreDevicecApi({ page, pageSize, store_id, num }).then(
                      (res) => {
                        setDataSource1(res.data.data);
                      }
                    );
                  } else {
                    message.error(res.data.msg);
                  }
                }
              );
              console.log(v);
            }}
          >
            {recode.title.map((item, index) => (
              <Option key={item} value={item}>
                <Tag color="#108ee9">{item}</Tag>
              </Option>
            ))}
            {/* <Option>{recode.title}</Option> */}
          </Select>
        </>
      ),
    },
    {
      title: "设备收益",
      dataIndex: "business_earnings",
      key: "business_earnings",
    },
  ];

  // 查询title
  const onFinishtitle = (values) => {
    let title = values.title;
    console.log(values);
    StoreselectgroupApi({ title }).then((res) => {
      setDataSourcefenzu(res.data.data);
    });
  };

  // 分页
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
  };

  // 添加 弹窗
  const handleOkadd = () => {
    setAddmodal(false);
  };

  const handleCanceladd = () => {
    setAddmodal(false);
  };

  // 添加设备分组
  const [isModalOpenmake, setIsModalOpenmake] = useState(false);
  const showModalmake = () => {
    setIsModalOpenmake(true);
  };

  const handleCancelmake = () => {
    setIsModalOpenmake(false);
  };

  const onFinishmake = (values) => {
    console.log(values);
    let title = values.title;
    StoreaddgroupApi({ title }).then((res) => {
      console.log(res);
      if (res.data.code === 1) {
        message.success(res.data.msg);
        StoregroupdeviceselectApi({ store_id }).then((res) => {
          setDataSourcefenzu(res.data.data);
        });
        StoreDevicecApi({ page, pageSize, store_id, num }).then((res) => {
          setDataSource1(res.data.data);
        });
        setIsModalOpenmake(false);
      } else {
        message.error(res.data.msg);
      }
    });
  };

  // 编辑修改分组名称
  const onFinishupdata = (values) => {
    console.log(values);
    let title = values.title;
    StoreupdategroupApi({ title, id: recodeid }).then((res) => {
      if (res.data.code === 1) {
        message.success(res.data.msg);
        StoreselectgroupApi({ store_id }).then((res) => {
          setDataSourcefenzu(res.data.data);
        });
        setIsModalOpenfenzulist(false);
      } else {
        message.error(res.data.msg);
      }
    });
  };
  const handleChangesel = (value) => {
    StoreDevicecApi({ page, pageSize, store_id, num, title: value }).then(
      (res) => {
        setDataSource1(res.data.data);
      }
    );
    console.log(value);
  };
  const onFinish = (value) => {
    let code = value.code;
    StoreDevicecApi({ page, pageSize, store_id, num, code }).then((res) => {
      setDataSource1(res.data.data);
    });
  };
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        onChange={onChangeKey}
        items={[
          {
            label: `设备列表`,
            key: "1",
            children: (
              <div style={{ height: "100vh" }}>
                <Card>
                  <Form onFinish={onFinish} layout="inline">
                    <Form.Item label="搜索分组">
                      {" "}
                      <Select
                        // defaultValue="未分组"
                        style={{ width: 120 }}
                        onChange={handleChangesel}
                      >
                        {selarr.map((item, index) => (
                          <Option key={item} value={item}>
                            <Tag color="#108ee9">{item}</Tag>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="查询设备码" name="code">
                      <Input />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
                <Card>
                  <Table
                    dataSource={dataSource1}
                    columns={columns}
                    scroll={{ x:1200 }}
                    rowKey="id"
                    pagination={{  hideOnSinglePage: false,
                      showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.pageSize,current:paginationPramas.page,onChange:(page,pageSize)=>{
                      handlePageChange(page,pageSize)
                    }}}
                  >
                    {" "}
                  </Table>
                </Card>
              </div>
            ),
          },
          {
            label: `分组列表`,
            key: "2",
            children: (
              <>
                <Card>
                  <Form
                    name="horizontal_login"
                    layout="inline"
                    onFinish={onFinishtitle}
                  >
                    <div style={{ float: "right" }}>
                      <Button type="primary" onClick={showModalmake}>
                        添加设备分组
                      </Button>
                    </div>
                  </Form>

                  <Modal
                    title="添加分组"
                    open={isModalOpenmake}
                    style={{ marginTop: "10%" }}
                    footer={
                      [] // 设置footer为空，去掉 取消 确定默认按钮
                    }
                    onCancel={handleCancelmake}
                    destroyOnClose={true}
                  >
                    <Form
                      name="horizontal_login"
                      layout="inline"
                      labelCol={{
                        span: 8,
                      }}
                      wrapperCol={{
                        span: 16,
                      }}
                      onFinish={onFinishmake}
                    >
                      <Form.Item name="title" label="设备分组名称">
                        <Input placeholder="请输入设备分组名称" />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          保存
                        </Button>
                      </Form.Item>
                    </Form>
                  </Modal>
                </Card>
                <Card>
                  <Table
                    rowKey="id"
                    
                    dataSource={dataSourcefenzu}
                    columns={columnsfenzu}
                  ></Table>
                </Card>
              </>
            ),
          },
        ]}
      />
      <Modal
        title="修改分组名称"
        open={isModalOpenfenzulist}
        style={{ marginTop: "10%" }}
        footer={
          [] // 设置footer为空，去掉 取消 确定默认按钮
        }
        onCancel={handleCancel}
        width={600}
      >
        <Form name="horizontal_login" layout="inline" onFinish={onFinishupdata}>
          <Form.Item name="title">
            <Input placeholder="请输入修改分组名称" />
          </Form.Item>
          <Form.Item shouldUpdate>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="设备分组添加"
        open={addmodal}
        onOk={handleOkadd}
        onCancel={handleCanceladd}
        width={1200}
      ></Modal>
    </>
  );
};
export default Equipmentlist;
