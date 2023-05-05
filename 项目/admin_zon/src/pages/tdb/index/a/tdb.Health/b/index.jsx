import React, { useState, useEffect } from "react";
import {
  Switch,
  Card,
  Breadcrumb,
  Button,
  Table,
  Space,
  Modal,
  Form,
  message,
  Input,
  Tag,
  Image,
  Upload,
  Select,
  InputNumber,
} from "antd";
import styles from "./index.module.scss";
import {
  getAllList,
  getUp,
  PostUp,
  PostAdd,
  PostDel,
  getAdd
} from "@/api/health";
import Editor from "@/components/Editor";
import { useRef } from "react";
import {
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import PreviewImage from "@/components/PreviewImage";
import routerContant from "@/utils/constant";
import { baseIMgURL } from "@/utils/request";

const { Column } = Table;
export default function Index() {
  // const { state: {id} } = useLocation()
  const [upLogin, setUpLogin] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState({ name: "", phone: "" });
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
  limit:10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const [formOption, setFormOption] = useState({
    group_id: { list: [], value: "" },
    status: { list: [], value: "" },
    class: { list: [], value: "" },
    ptype: { list: [], value: "" },
  });
  // 图片预览
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({
      page: page,
      limit: limit,
     ...search,
    }).then((res) => {
     console.log(res.data);
      if (res.data.code == 200) {
        setTableData(res.data.data);
        setPaginationPramas((preState) => ({
          ...preState,
          total: res.data.count,
        }));
      }
    });
    return true;
  };
  const formRef = useRef();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    img: "",
    id: "",
    url: "",
    ptype: "",
    source: "",
    rank:0,
  });
  const getAllRoleGroupData = async () => {
    setLoading(true);
    const {
      data
    } = await getAllList();
   console.log(data);
    setTableData(data.data);
    setPaginationPramas((preState) => ({ ...preState, total: data.count }));
    setLoading(false);
  };
  useEffect(() => {
    (async function () {
      getAllRoleGroupData();
      // console.log(formOption, "formOption");
      // console.log(formData, "formData");
      const opt = { ...formOption };
      const reqdata = await getAdd().then((res) => {
        return res.data.data.field;
      });
      for (let a in reqdata) {
        // console.log(reqdata[a]);
        if (reqdata[a].options) {
          // console.log(reqdata[a].field, "option");
          let key = reqdata[a].field;
          opt[key].list = reqdata[a].options;
          opt[key].value = reqdata[a].value;

          // console.log(opt, "opt");

          // setSearchOpt( (preState) => ({ ...preState, group_id: reqdata[a].option }));
        } else {
          // console.log(65465);
        }
        setFormOption(opt);
      }
    })();
  }, []);
  //  搜索管理员区
  const [form] = Form.useForm();
  const onFinish = async (value) => {
    // console.log(value, "sdfsf");
    for(let key in value){
      if(value[key] == undefined){
        value[key] = ''
      }
    }

    setSearch(value);
    const up = { title: value.title, class: value.class, page: 1, limit: 10 };
    // console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value);
    const { data } = await getAllList(up);
    // console.log(data);
    if (data.code === 200) {
      message.success("查询成功");
      setTableData(data.data);
      setPaginationPramas((preState) => ({
        ...preState,
        total: data.data.total,
      }));

    } else {
      message.warning(data.msg);
      return;
    }
  };
  const onReset = async () => {
    form.resetFields();
    setPaginationPramas((preState) => ({ ...preState, page: 1, limit: 10 }));
    const { data } = await getAllList();
    console.log(data);
    if (data.code === 200) {
      message.success("重置成功");
      setTableData(data.data);
      setPaginationPramas((preState) => ({
        ...preState,
        total: data.data.total,
      }));
    } else {
      message.warning(data.msg);
      return;
    }
  };
  // 表格区
  // 修改、添加
  const [fileList, setFileList] = useState([]);
  const handleOk = async (file) => {
    // let files = formRef.current.getFieldValue();
    // console.log(formData);
    // setUpLogin(true);
    try{
      if (formData.id) {
        const fileds = await formRef.current.validateFields();
        console.log(
          "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds",
          fileds,
          formData
        );
  
        PostUp(formData.id, {
          ...formData,
          name: fileds.name,
        }).then((res) => {
          // console.log(res, "修改");
          setUpLogin(false);
          if (res.data.code === 200) {
            getAllRoleGroupData();
            setIsOpenModal(false);
            message.success(res.data.msg);
            setFormData({
              title: "",
              content: "",
              img: "",
              id: "",
              url: "",
              source: "",
              rank:0,
            });
          } else {
            setIsOpenModal(false);
            message.warning(res.data.msg);
          }
        });
      } else {
        const fileds = await formRef.current.validateFields();
        console.log(
          "🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds",
          fileds,
          formData
        );
        const { data } = await PostAdd({
          ...fileds,
          url: formData.url,
          img: formData.img,
          group_id: formData.group_id,
        });
        setUpLogin(false);
        if (data.code === 400) {
          message.warning("新增失败");
          return;
        } else {
          message.success(data.msg);
          getAllRoleGroupData();
          setIsOpenModal(false);
        }
      }


    }catch{}
    console.log(fileList,"qqqqqqq");
    setUpLogin(false);
  
  };

  // 删除管理人员
  const handlerOk = async (id) => {
    PostDel(id).then((res) => {
      console.log(res, "删除");
      if (res.data.code === 200) {
        getAllRoleGroupData();
        message.success(res.data.msg);
      } else {
        message.warning(res.data.msg);
      }
    });
  };

  const handlerDel = (record) => {
    Modal.confirm({
      title: `确定删除${record.title}吗?`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: () => handlerOk(record.id),
    });
  };

  // 点击添加按钮显示弹窗
  const handlerAdd = async () => {
    setIsOpenModal(true);
    setFormData({
      title: "",
      content: "",
      img: "",
      id: "",
      url: "",
      rank: 0,
      source: "",
    });
    setFileList([]);
  };
  // 编辑操作
  const handlerEidt = async (record) => {
    const obj = { ...formData };
    const opt = { ...formOption };
    const reqdata = await getUp(record.id).then((res) => {
      return res.data.data.field;
    });
    for (let a in reqdata) {
      console.log(reqdata[a]);
      if (reqdata[a].options) {
        console.log(reqdata[a].field, "option");
        let key = reqdata[a].field;
        console.log(opt[key].list, "sdfsdfsdfoption");
        opt[key].list = reqdata[a].options;
        opt[key].value = reqdata[a].value;
        obj[key] = reqdata[a].value;
        console.log(opt, "opt");
        // setSearchOpt( (preState) => ({ ...preState, group_id: reqdata[a].option }));
      } else if (reqdata[a].field === "img") {
        console.log(reqdata[a].value, "sdfsdfsdfoption");
        obj[reqdata[a].field] = reqdata[a].value;
        setFileList([
          {
            uid: -1,
            name: "xx.png",
            status: "done",
            url: `${baseIMgURL}${reqdata[a].value}`,
          },
        ]);
      } else {
        let key = reqdata[a].field;
        obj[key] = reqdata[a].value;
        obj.id = record.id;
        //  console.log(obj);
      }
      setFormOption(opt);

      setFormData(obj);
      // setFileList(formData.img);
    }

    setIsOpenModal(true);
    setIsOpenModal(true);
  };
  // 显示图片
  const handlePreview = async (file) => {
    console.log(file);

    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewImage(file.url || `${baseIMgURL}${file.response.data.url}`);
  };
  // 取消预览
  const handlePicCancel = () => {
    setPreviewOpen(false);
  };
  // 弹窗取消逻辑
  const handleCancel = () => {
    setIsOpenModal(false);
    setUpLogin(false);
  };
  //   上传图片
  const onUpdataChange = ({ fileList: newFileList },name) => {
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
    formRef.current.setFieldsValue({
    img: newFileList,
    });
  };
  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item >健康信息</Breadcrumb.Item>
        </Breadcrumb>
        {routerContant("/tdb/index/a/tdb.Health/b/index") ? (
        <Card>
          <Form layout="inline" onFinish={onFinish} form={form}>
            <Form.Item label="标题" name="title">
              <Input
                placeholder="请输入搜索标题"
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
            <Form.Item label="分类" name="class">
            <Select
                  placeholder="请选择分类"
                  showArrow
                  value="formOption.class.value"
                  onChange={(item) => {
                    form.setFieldValue("class", item);
                  }}
                  allowClear
                >
                  {formOption.class.list.map((item, index) => (
                    <Select.Option value={item.value} key={item.value}>
                      {/* {console.log(item, "item")} */}
                      {item.label}
                    </Select.Option>
                    // console.log(item, "item")
                  ))}
                </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  搜索
                </Button>
                <Button
                  htmlType="button"
                  onClick={onReset}
                  icon={<ReloadOutlined />}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
        ) : null}
        
        <Card>
        {routerContant("/tdb/index/a/tdb.Health/b/index") ? (
          <Button type="primary" onClick={() => handlerAdd()}>
            添加
          </Button>
        ) : null}
          <Table
            scroll={{ x:1200 }}
            pagination={{  hideOnSinglePage: false,
              showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,current:paginationPramas.page,onChange:(page,pageSize)=>{
              handlePageChange(page,pageSize)
            }}}
            rowKey="id"
            dataSource={tableData}
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            {/* <Column
              align="center"
              title="id"
              dataIndex="id"
              key="id"
              fixed="left"
            /> */}
            <Column align="center" title="标题" dataIndex="title" key="title"    />

            <Column
              title="图片"
              dataIndex="img"
              width={100}
              key="img"
              render={(_, record) => (
                <Image
                  preview={{
                    imgVisible: false,
                  }}
                  src={`${baseIMgURL}${record.img}`}
                />
              )}
            />
            <Column
              align="center"
              title="分类"
              dataIndex="class"
              key="content"
            />
            <Column
              align="center"
              title="来源"
              dataIndex="source"

            />
            <Column
              align="center"
              title="创建时间"
              dataIndex="add_time"
              key="add_time"
            />
            <Column
              align="center"
              title="状态"
              dataIndex="status"
              key="status"
              render={(_, record) => (
                <>
                  {record.status === 1 ?<Tag color="#108ee9">正常</Tag>  :
                  <Tag color="red">异常</Tag>}
                </>
              )}
            />
             <Column
              align="center"
              title="推荐状态"
              dataIndex="recommended"
              render={(_, record) => (
                <>
                  {record.recommended === 1 ?<Tag color="green">已推荐</Tag>  :
                  <Tag color="blue">未推荐</Tag>}
                </>
              )}
            />
                <Column
              align="center"
              title="类型"
              dataIndex="ptype"
              render={(_, record) => (
                <>
                {record.ptype === 1 ?<Tag color="blue">图文</Tag>  :
                <Tag color="green">视频</Tag>}
              </>
              )}
            />
            <Column
              align="center"
              title="操作"
              key="operation"
  
              render={(_, record) => (
                <Space size="middle">
                  {routerContant("/tdb/index/a/tdb.Health/b/del") ? (
                    <Button type="link" onClick={() => handlerDel(record)}>
                      删除
                    </Button>
                  ) : null}
                  {routerContant("/tdb/index/a/tdb.Health/b/edit") ? (
                    <Button
                      type="link"
                      key="edit"
                      onClick={() => handlerEidt(record)}
                    >
                      编辑
                    </Button>
                  ) : null}
                </Space>
              )}
            />
          </Table>
        </Card>
        {isOpenModal ? (
          <Modal
            width={1200}
            title={formData.id ? "编辑" : "添加"}
            open={isOpenModal}
            zIndex={998}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={upLogin} onClick={handleOk}>
                确定
              </Button>,
            ]}
          >
            <Form
              ref={formRef}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                ...formData,
              }}
              autoComplete="off"
            >
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: "请输入您的标题" }]}
              >
                <Input
                  placeholder="请输入您的标题"
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      title: e.target.value,
                    }))
                  }
                />
              </Form.Item>
 
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
                    formRef.current.setFieldsValue({
                      img: "",
                    });
                    setFormData({
                      ...formData,
                      img: "",
                    });
                    setFileList([]);
                  }}
                  onChange={(info)=>onUpdataChange(info,"sdf")}
                >
                  {fileList.length < 1 && "+上传封面"}
                 
                </Upload>
                <span style={{color:"red"}}> 建议视频封面比例（16：9）图文封面（4:3）</span>
                </>
           
                
              </Form.Item>
         
              <Form.Item
                label="分类"
                name="class"
                rules={[{ required: true, message: "请选择您的分类" }]}
              >
                <Select
                  placeholder="请选择分类"
                  showArrow
                  value="formOption.class.value"
                  onChange={(item) => {
                    setFormData((preState) => ({
                      ...preState,
                      class: item,
                    }));
                  }}
                  allowClear
                >
                  {formOption.class.list.map((item, index) => (
                    <Select.Option value={item.value} key={item.value}>
                      {console.log(item, "item")}
                      {item.label}
                    </Select.Option>
                    // console.log(item, "item")
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="类型"
                name="ptype"
                rules={[{ required: true, message: "请选择您的类型" }]}
              >
                <Select
                  placeholder="请选择分类"
                  showArrow
                  value="formOption.ptype.value"
                  onChange={(item) => {
                    setFormData((preState) => ({
                      ...preState,
                      ptype: item,
                    }));
                  }}
                  allowClear
                >
                  {formOption.ptype.list.map((item, index) => (
                    <Select.Option value={item.value} key={item.value}>
                      {console.log(item, "item")}
                      {item.label}
                    </Select.Option>
                    // console.log(item, "item")
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="作品来源"
                name="source"
                rules={[{ required: true, message: "请输入您的作品的来源" }]}
              >
                <Input
                  placeholder="请输入您的作品的来源"
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      source: e.target.value,
                    }))
                  }
                />
              </Form.Item>
              <Form.Item
                label="内容"
                name="content"
                rules={[{ required: true, message: "请输入您的内容" }]}
              >
                <Editor
                  content={formData.content}
                  getContent={(content) => {
                    console.log(content, "sdfsdf");
                    setFormData((preState) => ({
                      ...preState,
                      content: content,
                    }));
                    formRef.current.setFieldsValue({ content: content });
                  }}
                />
              </Form.Item>
              <Form.Item label="第三方跳转链接"
               name="url"  
                rules={[{  message: "请输入您的第三方跳转链接" }]} 
                          >
                <Input
                  placeholder="转载请填写"
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      url: e.target.value,
                    }))
                  }
                />
              </Form.Item>
              <Form.Item
                label="是否推荐"
                name="recommended"
                // rules={[{ required: true, message: "请输入您的状态" }]}
              >
                <Switch
                  checked={formData.recommended == 1}
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      recommended: e ? 1 : 2,
                    }))
                  }
                />
              </Form.Item>
              {/* <Form.Item label="排序"
               name="rank"  
                rules={[{ required: true, message: "请输入作品排序" }]} 
                          >
                <InputNumber
                  placeholder="请输入第三方链接如果没有可不填"
                  onChange={(e) =>
                    setFormData((preState) => ({
                      ...preState,
                      rank: e
                    })
                    )
                  }
                />
              </Form.Item> */}
            </Form>
          </Modal>
        ) : null}
      </Card>
      {/* <Modal
        open={previewOpen}
        title="预览"
        footer={null}
        zIndex={999}
        onCancel={handlePicCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal> */}
      <PreviewImage preview={previewImage} key={previewOpen} previewOpen={previewOpen} handlePicCancel={handlePicCancel} />
    </div>
  );
}
