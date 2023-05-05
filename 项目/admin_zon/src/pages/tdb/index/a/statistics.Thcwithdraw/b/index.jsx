import React, { useState, useEffect } from "react";
import {
  Card,
  Breadcrumb,
  Button,
  Table,
  Select,
  Modal,
  Form,
  message,
  Input,
  Tag,
  Upload,
  Radio
} from "antd";

import moment from "moment";
import styles from "./index.module.scss";
import { getAllList, PostAud, PostDis, PostTic } from "@/api/Thcwithdraw";

import { useRef } from "react";
import routerContant from "@/utils/constant";
const { Column } = Table;
const { Option } = Select;
export default function Index() {
  // const { state: {id} } = useLocation()
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const[butList,setButList]=useState([])
  const [status, setStatus] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
    limit: 10, // 每页数据条数
    total: "", // 总条数
    // onChange: (page, pageSize) => handlePageChange(page, pageSize), //改变页码的函数
  });
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    getAllList({
      page: page,
      limit: limit,
      apply_status: status,
    }).then((res) => {
      // console.log(res.data.code);
      if (res.data.code == 200) {
        setTableData(res.data.data);

        setPaginationPramas((preState) => ({
          ...preState,
          total: res.data.count,
        }));
        const arr = []
for (const key in res.data.reqdata) {
  arr.push(res.data.reqdata[key])
} 
setButList(arr)
      }
    });
    return true;
  };
  const formRef = useRef();
  const [formData, setFormData] = useState({
    id: null,
    errimg:null,
    remark: null,
    apply_status: null,
    ticket: null,
  });
  useEffect(() => {
    (async function () {
      handlePageChange(paginationPramas.page, paginationPramas.limit);
    })();
  }, []);
  //  搜索管理员区
  function but(value) {
    
  console.log(value);
    setTableData([]);
    let up = { page: 1, limit: 10, apply_status: value };
    getAllList(up).then((res) => {
      setTableData(res.data.data);
      setPaginationPramas((preState) => ({
        ...preState,
        total: res.data.count,
      }));
      });
      }
      function btus() {
     
          return (
            <div className="filter" >
              <Radio.Group
                onChange={(e) => {
                  but(e.target.value);
                }}
                className="filRight"
               defaultValue={0}
                buttonStyle="solid"
              >
              {butList.map((item,index) => {
                return(
                    <Radio.Button key={index} value={item.app_status}>
                      {item.value} <span style={{color:"red"}}>({item.key})</span>
                    </Radio.Button>
                )
              })}
                  
              
              </Radio.Group>
            </div>
          );
    
      }
  // 表格区
  // 修改、添加

  const [fileList, setFileList] = useState({
    errimg: [],
    ticket: [],
  });
  const handleOk = async (file) => {
    const keyFormFields = await formRef.current.validateFields();
    console.log(
      "🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ keyFormFields",
      keyFormFields
    );
   let data=null
    if(status==0){
      data  = await PostAud( {
       ...formData,
     }).then((res) => {
       return res.data;
   });
     }else if(status==1){
   data  = await PostDis(formData.id, {
           ...formData,
         }).then((res) => {
           return res.data;
       });;
   }else if(status==3){
       data  = await PostTic(formData.id).then((res) => {
               return res.data;
           });;
       }
       if (data.code === 200) {
        handlePageChange(paginationPramas.page, paginationPramas.limit);

        setFormData({id: null,
          errimg:null,
          remark: null,
          apply_status: null,
          ticket: null,})
          setFileList({
            errimg: [],
            ticket: [],
          })
        setIsOpenModal(false);
        message.success(data.msg);
      } else {
        setIsOpenModal(false);
        message.warning(data.msg);
      }

  };

  // 编辑操作
  const handlerEidt = async (record) => {
    console.log(record, "record");
    setFormData({...formData,id:record.id})
    setStatus(record.apply_status);
    setIsOpenModal(true);
  };
  // 弹窗取消逻辑
  const handleCancel = () => {
    setFormData({id: null,
      errimg:null,
      remark: null,
      apply_status: null,
      ticket: null,})
      setFileList({
        errimg: [],
        ticket: [],
      })
    setIsOpenModal(false);
  };
  // 上传图片
  const onUpdataChange  = ({ fileList: newFileList }, name) => {
    console.log(newFileList, name);
    setFileList({ ...fileList, [name]: newFileList });
    if (newFileList[0]?.response?.code === 200) {
      setFormData((preState) => ({
        ...preState,
        [name]: newFileList[0].response.data.url,
      }));
    }

    // setFormData((preState) => ({ ...preState, [name]: file.fileList }));
    console.log(formData);
  };
  function Change(){

    if(status==0){

        return <>
             { console.log("sdfsdf")}
         <Form.Item
                label="审核状态"
                name="apply_status"
                rules={[{ required: true, message: "请选择审核状态" }]}
              >
                <Select
                  placeholder="请选择审核状态"
                  onChange={(value) => {
                    console.log(value);
                    setFormData({
                      ...formData,
                      apply_status: value,
                    });
                  }}
                >
                  <Option value="1">审核通过</Option>
                  <Option value="2">审核未通过</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="备注"
                name="remark"
                rules={[{ required: true, message: "请输入备注" }]}
              >
                <Input
                  placeholder="请输入备注或审核不通过的原因"
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      remark: value.target.value,
                    });
                  }}
                />
              </Form.Item>
        </>
    }else if(status==1){
        return <>
          <Form.Item
                label="审核状态"
                name="apply_status"
                rules={[{ required: true, message: "请选择审核状态" }]}
              >
                <Select
                  placeholder="请选择审核状态"
                  onChange={(value) => {
                    console.log(value);
                    setFormData({
                      ...formData,
                      apply_status: value,
                    });
                  }}
                >
                  <Option value="3">出款成功</Option>
                  <Option value="4">出款失败</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="备注"
                name="remark"
                rules={[{ required: true, message: "请输入备注" }]}
              >
                <Input
                  placeholder="请输入备注或审核不通过的原因"
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      remark: value.target.value,
                    });
                  }}
                />
              </Form.Item>
        </>
    }
   
}
 

  return (
    <div className={styles.root}>
      <Card>
        <Breadcrumb separator=">" routes style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>提现记录</Breadcrumb.Item>
        </Breadcrumb>
        {routerContant("/tdb/index/a/statistics.Thcwithdraw/b/audit") ? (
        <Card>
        <Form layout="inline" >
              {/* 选择器 */}
              <Form.Item label="提现状态" name="status">
                {btus()}
             
              </Form.Item>
            </Form>
          </Card>
            ): null}
            {routerContant("/tdb/index/a/statistics.Thcwithdraw/b/audit") ? (
        <Card>
        
          <Table
      
      pagination={{  hideOnSinglePage: false,
        showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,page:paginationPramas.page,onChange:(page,pageSize)=>{
        handlePageChange(page,pageSize)
      }}}
      scroll={{ x: 1400 }}
            rowKey="id"
            dataSource={tableData}
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            {/* <Column align="center" title="用户id" dataIndex="id" fixed="left" /> */}
            <Column
              align="center"
              title="类型"
              dataIndex="type"
              key="status"
           
              render={(_, record) => (
                <Tag color="#108ee9">
                  {record.type === 0 ? "服务商" : "店家"}
                </Tag>
              )}
            />
            <Column align="center" title="银行卡ID" dataIndex="bank_id" />
            <Column align="center" title="提现人" dataIndex="withdraw_name" />
            <Column align="center" title="银行卡号" dataIndex="bank_no" />
            <Column align="center" title="提现金额" dataIndex="amount" />
            <Column
              align="center"
              title="实际到账金额"
              dataIndex="actual_amount"
            />
            <Column
              align="center"
              title="提现审核"
              dataIndex="apply_status"
              render={(_, record) => (
                <>
                  <Tag color="#108ee9">
                  {record.apply_status === 0
                    ? "未审核"
                    : record.apply_status === 1
                    ? "已经审核"
                    : record.apply_status === 3
                    ? "出款成功"
                    : "出款失败"}
                     </Tag>
                </>
              
               
              )}
            />
            <Column
              align="center"
              title="审核时间"
              dataIndex="apply_time"
              render={(_, record) => (
                <>{moment(record.apply_time).format("YYYY-MM-DD HH:mm:ss")}</>
              )}
            />
        {routerContant("/tdb/index/a/statistics.Thcwithdraw/b/disbursements") ? (
            <Column
              align="center"
              title="操作"
              key="operation"
       
              render={(_, record) => (
                <>
                  {record.apply_status === 0 ? (
                    <Button onClick={() => handlerEidt(record)}>审核 </Button>
                  ) : record.apply_status === 1 ? (
                    <Button onClick={() => handlerEidt(record)}>出款 </Button>
                  ) : record.apply_status === 3 ? (
                    <Button onClick={() => handlerEidt(record)}>
                      出款成功{" "}
                    </Button>
                  ) : (
                    <Button onClick={() => handlerEidt(record)}>
                      出款失败{" "}
                    </Button>
                  )}
                </>
              )}
            />
            ): null}
          </Table>

        </Card>
            ): null}
        {isOpenModal ? (
          <Modal
            width={500}
            title="编辑"
            open={isOpenModal}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="确定"
            cancelText="取消"
          >
            <Form
              ref={formRef}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 14 }}
              initialValues={{
                ...formData,
              }}
              autoComplete="off"
            >
              {status==3?<>
                <Form.Item
                label="上传发票"
                name="ticket"
                rules={[{ required: true, message: "上传失败" }]}
              >
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList.ticket}
                  onRemove={(file) => {
                    console.log(file);
                    setFormData({
                      ...formData,
                      ticket: null,
                    });
                    setFileList({ticket:[]});
                  }}
        
                  onChange={(info) =>
                    onUpdataChange(info, "ticket")
                  }
                >
                  {fileList.ticket.length < 1 && "+上传图片"}
                </Upload>
              </Form.Item>
              </>:<>
              <Form.Item
                label="审核失败或出款失败"
                name="errimg"
               
              >
                <Upload
                  accept="image/*"
                  action={"/common.upload/uploadImage"}
                  listType="picture-card"
                  fileList={fileList.errimg}
                  onRemove={(file) => {
                    console.log(file);
                    setFormData({
                      ...formData,
                      errimg: null,
                    });
                    setFileList({errimg:[]});
                  }}
                  onChange={(info) =>
                    onUpdataChange(info, "errimg")
                  }
                >
                  {fileList.errimg.length < 1 && "+上传图片"}
                </Upload>
              </Form.Item>
             {Change()}
              
              </>}
         
        
            </Form>
          </Modal>
        ) : null}
      </Card>
    </div>
  );
}
