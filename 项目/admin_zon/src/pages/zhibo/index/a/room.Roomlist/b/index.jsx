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
  Upload,
  Image,
  TimePicker,
  DatePicker,Tag
} from "antd";
import styles from "./index.module.scss";
import PreviewImage from "@/components/PreviewImage";
import { getAllList, getUp, postAdd,PostUp, postDel } from "@/api/live.js";
import routerContant from "@/utils/constant";
import { baseIMgURL } from "@/utils/request";
import moment from "moment";
export default function Index() {
  //   收货信息
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({});
  const [tableData, setTablieData] = useState([]);
  const [formData, setFormData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handlePageChange = async (page, limit) => {
    setLoading(true);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    const {
      data: { data,count },
    } = await getAllList({
      page: page,
      limit: limit,
      ...search,
    });
    setTablieData(data);
    console.log(data);
    setPaginationPramas((preState) => ({ ...preState, total: count }));
    setLoading(false);
  };
  const getAll = async () => {
    const {
      data: { data,count },
    } = await getAllList();
    setTablieData(data);
    setPaginationPramas((preState) => ({ ...preState, total: count }));
  };
  useEffect(() => {
    (async function () {
      getAll();
    })();
  }, []);
  //   收货数据修改
  const handleOk = async () => {
    const fileds = await form.validateFields();
    console.log(fileds);
    // fileds.live_time= fileds.live_time.map((item)=>item.format('YYYY-MM-DD HH:mm:ss')).join('-')
    fileds.start_time=fileds.live_time[0].format('YYYY-MM-DD HH:mm:ss')
    fileds.end_time=fileds.live_time[1].format('YYYY-MM-DD HH:mm:ss')
    fileds.status =fileds.status ? 2 : 1;
    console.log(fileds);
    try {
      if(formData.id){
        const {
          data: { code },
        } = await PostUp({id:formData.id, ...fileds });
        console.log(code);
        if (code == 200) {
          message.success({
            content: "操作成功",
            key: "wind",
          });
  
          setIsOpenModal(false);
          form.resetFields();
          setFileList([]);
          getAll();
          setFormData({});
        }
      }else{
        const {
          data: { code },
        } = await postAdd({ ...fileds });
        console.log(code);
        if (code == 200) {
          message.success({
            content: "操作成功",
            key: "wind",
          });
  
          setIsOpenModal(false);
          form.resetFields();
          setFileList([]);
          getAll();
          setFormData({});
        }
      }
      

    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const handleCancel = () => {
    form.setFieldsValue({
    });
    setFormData({});
    console.log(form.getFieldsValue());
    setIsOpenModal(false);
    setLoading(false);
  };
  const receiving = [
    {
      title: "直播封面",
      dataIndex: "img",
      align: "center",
      render: (text, record) => {
        return (
          <Image
            preview={{
              imgVisible: false,
            }}
            src={`${baseIMgURL}${record.img}`}
          />
        );
      },
    },
    {
      title: "名称",
      dataIndex: "title",
      align: "center",
    },
    {
      title: "主播",
      dataIndex: "anchor",
      align: "center",
    },
    {
      title: "直播时间",
      dataIndex: "live_time",
      align: "center",
      render: (text, record) => {
        return (
          <div>
            {record.start_time}-{record.end_time}
          </div>
        );
      }
    },
    {
      title: "直播简介",
      dataIndex: "introduce",
      align: "center",
    },
    {
      title: "开播地址",
      dataIndex: "anchor_url",
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "'status",
      align: "center",
      render: (text, record) => {
        return <div>{record.status == 2 ? 
          <Tag color="green"> 开播</Tag> :          <Tag color="red"> 未开播</Tag>}</div>;
      }
    },
    {
      title: "操作",
      dataIndex: "action",
      align: "center",
      render: (text, record) => {
        return (
          <div>
            <Button
              type="primary"
              onClick={() => {
                setFormData(record);
                setIsOpenModal(true);
                handlerEidt(record);
              }}
            >
              修改
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                Modal.confirm({
                  title: `确定删除${record.title}吗?`,
                  okText: "确认",
                  cancelText: "取消",
                  onOk: () => handlerDelete(record.id),
                });
              }}
            >
              删除
            </Button>
          </div>
        );
      }
    }
  ];
  const onUpdataChange = ({ fileList: newFileList }) => {
    // console.log(newFileList,name, "sdfdfsfsd");

    if (newFileList[0]?.response?.code === 400) {
      message.warning(newFileList[0]?.response?.msg);
      setFormData((preState) => ({ ...preState, img: null }));
      setFileList([]);
      return;
    } else {
      setFileList(newFileList);
      setFormData((preState) => ({
        ...preState,
        img:
          newFileList.length === 0 ? null : newFileList[0]?.response?.data?.url,
      }));
    }
    form.setFieldsValue({
      img:newFileList[0]?.response?.data?.url,
    });
  };
  const handlePreview = async (file) => {
    console.log(file);

    setPreviewOpen(true);
    setPreviewImage(file.url || `${baseIMgURL}${file.response.data.url}`);
  };
  const handlerEidt = async (record) => {
    console.log(record, "sdfsdf");
    const {
      data: { data },
    } = await getUp(record.id);
    let arr=[]
    arr[0] = moment(data.start_time, "YYYY-MM-DD hh:mm:ss");
arr[1] = moment(data.end_time, "YYYY-MM-DD hh:mm:ss");
data.live_time = arr;
    setFormData(data);
    form.setFieldsValue({
      ...data,
    });
    console.log(data,"eeee");
    if(data.img){
      console.log(data.img);
      setFileList([
        {
          uid: -1,
          name: "xx.png",
          status: "done",
          url: `${baseIMgURL}${data.img}`,
        },
      ]);}

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
  const handlePicCancel = () => {
    setPreviewOpen(false);
  };
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>直播列表</Breadcrumb.Item>
        </Breadcrumb>
      </Card>
      <Card>
        {routerContant("/zhibo/index/a/room.Roomlist/b/add") ? (
          <Button
            type="primary"
            onClick={() => {
              setIsOpenModal(true);
            }}
          >
            添加
          </Button>
        ) : null}
        {routerContant("/zhibo/index/a/room.Roomlist/b/index") ? (
          <Table
            columns={receiving}
            scroll={{ x: 600 }}
            dataSource={tableData}
            pagination={{
              hideOnSinglePage: true,
              showSizeChanger: true,
              total: paginationPramas.total,
              pageSize: paginationPramas.limit,
              current: paginationPramas.page,
              onChange: (page, pageSize) => {
                handlePageChange(page, pageSize);
              },
            }}
          ></Table>
        ) : null}
      </Card>
      {isOpenModal ? (
        <Modal
          width={1200}
          title={formData.id ? "修改" : "新增"}
          open={isOpenModal}
          
          
zIndex={998}
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
            </Button>
            // 打印button

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
              label="封面(请上传横图)"
              name="img"
              rules={[{ required: true, message: "请选择您的封面" }]}
            >
              <>
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onRemove={(file) => {
                    console.log(file);
                    form.setFieldsValue({
                      img: "",
                    });
                    setFormData({
                      ...formData,
                      img: "",
                    });
                    setFileList([]);
                  }}
                  onChange={(info) => onUpdataChange(info, "sdf")}
                >
                  {fileList.length < 1 && "+上传封面"}
                </Upload>
              </>
            </Form.Item>
            <Form.Item
              label="主播"
              name="anchor"
              rules={[{required: true, message: "请输入主播" }]}
            >
              <Input
                placeholder="请输入主播"
              />
            </Form.Item>
            <Form.Item
              label="直播标题"
              name="title"
              rules={[{ required: true,message: "请输入直播标题" }]}
            >
              <Input
                placeholder="请输入直播标题"
              />
            </Form.Item>
            <Form.Item
              label="第三方跳转链接"
              name="anchor_url"
              rules={[{ message: "请输入您的第三方跳转链接" }]}
            >
              <Input
                placeholder="直播介绍url没有则不填"
              />
            </Form.Item>
            <Form.Item
              label="直播简介"
              name="introduce"
              rules={[{required: true, message: "请输入直播简介" }]}
            >
              <Input
                placeholder="请输入直播简介"
              />
            </Form.Item>
            <Form.Item
            label="直播时间"
            name="live_time"
            rules={[
              {
                required: true,
                message: "请输入直播时间",
              
              },
            ]}
          >
              <RangePicker showTime   format="YYYY-MM-DD HH:mm:ss" />
            {/* <TimePicker 
                   format="HH:mm"
                    /> */}
            {/* <Input placeholder="请输入营业开始时间XX:XX" /> */}
          </Form.Item>
            <Form.Item
              label="直播状态"
              name="status"
              // rules={[{ required: true, message: "请输入您的状态" }]}
            >
              <Switch
                      checkedChildren="开播"
                      unCheckedChildren="未开播"
                checked={formData.status == 2}
                onChange={(e) =>
                  setFormData((preState) => ({
                    ...preState,
                    status: e ? 2 : 1,
                  }))
                }
                
              />
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
        <PreviewImage preview={previewImage} key={previewOpen} previewOpen={previewOpen} handlePicCancel={handlePicCancel} />
    </div>
  );
}
