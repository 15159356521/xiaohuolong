import React, { useCallback, useState, useEffect } from 'react'
import { Card, Breadcrumb, Button, Table, Space, Image, Modal, Form, message, DatePicker, Input, Tag, Select, Upload, InputNumber } from 'antd'
import { addTaskItem, getAllTaskListData, getTaskListById, updateTaskListById, addTaskList, deleteTaskListById } from '../../api/taskList'
import { getRoleBtn } from '../../api/role'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { useRef } from 'react'
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { baseIMgURL } from '../../utils/request'
import ImgCrop from 'antd-img-crop';
import { getBase64 } from '../../utils/index'
import { getAllParentAccountData, getOptions, getParentAccountById, searchParentAccount, updateParentAccountById } from '../../api/parentAccount'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import routerContant from '../../utils/constant'

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const {Column} = Table
const { RangePicker } = DatePicker;

export default function ParentAccount() {
    // const { state: {id} } = useLocation()
    const location = useLocation()
    const id = routerContant[location.pathname.split('/').pop()].split('-').pop()
    const [roleBtn, setRoleBtn] = useState([])
    const [loading, setLoading]  = useState(false)
    const [tableData, setTableData] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const formRef = useRef()
    const navigate = useNavigate()
    const [paginationPramas, setPaginationPramas] = useState({
        current: 1, //当前页码
        pageSize: 2, // 每页数据条数
        total: '', // 总条数
        onChange: (current, size) => handlePageChange(current, size), //改变页码的函数
        hideOnSinglePage: false,
        showSizeChanger: true,
    })
    const [formOption, setFormOption] = useState({
        task_class: [],
        task_drawer_list: [],
        task_impose: [],
        task_status: []
    })
    const handlePageChange = (current, pageSize) => {
        setPaginationPramas(preState => ({...preState, current, pageSize,}))
    }
    const [formData, setFormData] = useState({
        add_package: '',
        avatar: '',
        business_license: '',
        card_id: '',
        corporate_name: '',
        credit_score: '',
        direction: '',
        introduction: '',
        level: '',
        name: '',
        names: '',
        often: '',
        phone: '',
        status: '',
        type: '',
        videodirection: ''
    })
    const getParentAccountData = async () => {
        setLoading(true)
        const { code, resData, count } = await getAllParentAccountData()
        setTableData(resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }
    const [searchOpt, setSearchOpt] = useState([])
    const getOptionsFn = async () => {
        const res = await getOptions()
        console.log("🚀 ~ file: index.jsx ~ line 77 ~ getOptionsFn ~ res", res)
        setSearchOpt(res.resData.subcontractor_grade)
    }

    useEffect(() => {
        (async function () {
            getOptionsFn()
            getParentAccountData()
            const { code, resData, count, msg } = await getRoleBtn(id)
            console.log("🚀 ~ file: index.jsx ~ line 71 ~ code, resData, count, msg", code, resData, count, msg)
            if(code === 200) {
                setRoleBtn(resData.btn_list)
            }else if(code === 401) {
                message.warning(msg)
                navigate('/login', {replace: false,state:{ id: id}})
            }
        })();
    }, []);
   
    // 修改、添加
    const handleOk = async () => {
        if(formData.id) {
            const fileds = await formRef.current.validateFields()
            console.log(fileds, formData)
            const {code, msg} = await updateParentAccountById(formData.id, {
                ...fileds,
                avatar: formData.img,
            })
          
            if(code === 200) {
                getParentAccountData()
                message.success(msg)
                setIsOpenModal(false)
            }else {
                setIsOpenModal(false)
                message.warning(msg)
            }
        }else {
            const fileds = await formRef.current.validateFields(['task_drawer_id','title', 'content', 'activeTime', 'img', 'bonus', 'impose', 'participate', 'class', 'status'])
            const {code, msg} = await addTaskList({
                ...fileds, 
                img: formData.img, 
                start_time: fileds['activeTime'][0].format(dateFormat), 
                end_time: fileds['activeTime'][1].format(dateFormat),
                status: formData.status,
                task_drawer_id: formData.task_drawer_id
            })
            if(code === 400) {
                message.warning(msg)
                return
            }else {
                message.success(msg)
                getParentAccountData()
                setIsOpenModal(false)
            }
        }
    }

    const changePic = (errorInfo) => {
        return !formData.img ? Promise.reject('请选择一张图片'): Promise.resolve()
    }

    // 删除
    const handlerOk = async (id) => {
        try{
            const res = await deleteTaskListById(id)
            await getParentAccountData()
            message.success('删除成功')
        }catch(e) {
            message.warning('删除失败')
        }
    }

    const handlerDel = (record) => {
        Modal.confirm({
            title: `确定删除${record.title}吗?`,
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => handlerOk(record.id)
        });
    }

    // 点击添加按钮显示弹窗
    const handlerAdd = async () => {
        setIsOpenModal(true)
        setFormData({
            add_package: '',
            avatar: '',
            business_license: '',
            card_id: '',
            corporate_name: '',
            credit_score: '',
            direction: '',
            introduction: '',
            level: '',
            name: '',
            names: '',
            often: '',
            phone: '',
            status: '',
            type: '',
            videodirection: ''
        })
        setFileList([])
        const {msg, resData, code} = await addTaskItem()
        if(code === 200) {
            setFormOption(resData)
        }else {
            message.warning(msg)
        }
    }
    
    // 编辑操作
    const handlerEidt =async (record) => {
        console.log("🚀 ~ file: index.jsx ~ line 192 ~ handlerEidt ~ record", record)
        try {
            const {msg, resData, code} = await getParentAccountById(record.id)
            console.log("🚀🚀🚀 ~ file: index.jsx ~ line 194 ~ handlerEidt ~ resData", resData)
            if(code === 200) {
                setFormOption(resData)
                setFormData(resData.info) 
                const filesList = []
                filesList.push({
                    name: resData.info.avatar.split('/')[resData.info.avatar.split('/').length - 1],
                    url: `${baseIMgURL}${resData.info.avatar}`
                })
                console.log("🚀 ~ file: index.jsx ~ line 203 ~ handlerEidt ~ filesList", filesList)
                setFileList(filesList)
                setIsOpenModal(true)
            }else {
                message.warning(msg)
                return
            }
        } catch (error) {
            message.warning(error)
        } 
        setIsOpenModal(true)
    }   

    // 弹窗取消逻辑
    const handleCancel = () => {
        setIsOpenModal(false)
    }

    const onUpdataChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        console.log(newFileList)
        if(newFileList[0]?.response?.code === 400) {
            message.warning(newFileList[0]?.response?.msg)
            setFormData(preState => ({...preState, img: null}))
            setFileList([])
            return
        }else {
            setFormData(preState => ({...preState, img: newFileList.length === 0 ? null : newFileList[0]?.response?.data?.url}))
        }
    };
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' ;
        if (!isJpgOrPng) {
          message.error('图片仅支持jpg,png,gif,jpeg');
        }
      
        const isLt2M = file.size / 1024 / 1024 < 5;
      
        if (!isLt2M) {
          message.error('图片大小为5MB');
        }
      
        return isJpgOrPng && isLt2M;
    }
    const onUpdataPreview = async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handlePicCancel = () => {
        setPreviewOpen(false);
    }
    // 搜索功能
    const [form] = Form.useForm();
    const onReset = async () => {
        form.resetFields();
        const {code, msg, resData} = await searchParentAccount({
            name: '',
            phone: '',
            level: ''
        })
        if(code === 200) {
            message.success('重置成功')
            setTableData(resData)
        }else {
            message.warning(msg)
            return
        }
    };
    const onFinish = async (value) => {
        const {code, msg, resData} = await searchParentAccount(value)
        if(code === 200) {
            message.success('查询成功')
            setTableData(resData)
            setPaginationPramas(preState => ({...preState, total: resData.total}))
        }else {
            message.warning(msg)
            return
        }
    }

    return (
        <div className={styles.root}>
            <Card>
                <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/parentAccount">母账号列表</Breadcrumb.Item>
                </Breadcrumb>

                <Card>
                    <Form layout="inline" onFinish={onFinish} form={form}>
                        <Form.Item label="名称" name="name">
                            <Input placeholder="请输入搜索名称" prefix={<SearchOutlined />} allowClear/>
                        </Form.Item>
                        <Form.Item label="手机号" name="phone">
                            <Input placeholder='请输入' allowClear/>
                        </Form.Item>
                        <Form.Item label="级别" name="level">
                            <Select
                                placeholder="请选择"
                                name="level"
                                allowClear
                                >
                                {
                                    searchOpt.map(item => (<Select.Option value={item} key={item}>{item}</Select.Option>))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                    搜索
                                </Button>
                                <Button htmlType="button" onClick={onReset} icon={<ReloadOutlined />}>
                                    重置
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
                
                <Card>
                {
                    roleBtn.find(item => item.title === '添加') 
                        ? <Button type='primary' onClick={() => handlerAdd()}>添加</Button> : null
                }
                <Table scroll={{x: 1400,}} pagination={paginationPramas}  rowKey="id" dataSource={tableData} loading={loading} style={{marginTop: '20px'}}>
                    <Column align='center' title="id" dataIndex="id" key="id" fixed="left"/>
                    <Column title="图片" dataIndex="avatar" key="avatar" fixed="left" render={(_, record) => (
                        <Image
                            preview={{
                                imgVisible: false,
                            }}
                            src={baseIMgURL + record.avatar}
                        />
                    )}/>
                    <Column align='center' title="名称" dataIndex="name" key="name" />
                    <Column align='center' title="手机号" dataIndex="phone" key="phone"/>
                    <Column align='center' title="级别" dataIndex="level" key="level"/>
                    <Column align='center' title="信用分" dataIndex="credit_score" key="credit_score"/>
                    <Column align='center' title="增包" dataIndex="add_package" key="add_package"/>
                    <Column align='center' title="子账号数量" dataIndex="sub_count" key="sub_count"/>                  
                    <Column align='center' title="操作" key="operation" fixed="right" render={(_, record) => (
                        <Space size="middle">
                            {
                                roleBtn.find(item => item.title === '删除') 
                                    ? <Button type='link' onClick={() => handlerDel(record)}>删除</Button> : null
                            }
                            {
                                roleBtn.find(item => item.title === '编辑') 
                                    ? <Button type='link' onClick={() => handlerEidt(record)} >编辑</Button> : null
                            }
                        </Space>
                    )}/>
                </Table>

                {
                    isOpenModal ? 
                    <Modal width={1200} title='新增数据' open={isOpenModal} onOk={handleOk} onCancel={handleCancel} okText="确定" cancelText="取消">
                        <Form ref={formRef} labelCol={{span: 5,}} wrapperCol={{span: 16,}} 
                            initialValues={{
                                ...formData, 
                                // status: formData.id? formData.status+'': '',
                                // activeTime: formData.id? [moment(formData.start_time, dateFormat), moment(formData.end_time, dateFormat)]: null
                            }}
                                autoComplete="off"
                            >
                            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入您的名称',}]}>
                                <Input placeholder='请输入名称'/>
                            </Form.Item>
                            <Form.Item label="手机" name="phone" rules={[{ required: true, message: '请输入您的手机',}]}>
                                <Input placeholder='请输入手机'/>
                            </Form.Item>

                            <Form.Item label="级别" name="level" rules={[{ required: true, message: '请输入您的级别',}]}>
                                <Select placeholder="请选择您的级别" value={formData.level} onChange={(id) => {setFormData(preState => ({...preState, level: id}))}} allowClear>
                                    {
                                        formOption.subcontractor_grade && formOption.subcontractor_grade.map((item, index) => (
                                            <Select.Option value={item} key={index}>{item}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item label="信用评分" name="credit_score" rules={[{ required: true, message: '请输入您的信用评分',}]}>
                                <InputNumber min={0} placeholder='请输入您的信用评分'/>
                            </Form.Item>

                            <Form.Item label="增包" name="add_package" rules={[{ required: true, message: '请输入您的增包',}]}>
                                <InputNumber min={0} placeholder='请输入您的增包'/>
                            </Form.Item>

                            <Form.Item label="身份证号" name="card_id" rules={[{ required: true, message: '请输入您的身份证号',}]}>
                                <Input placeholder='请输入您的身份证号'/>
                            </Form.Item>

                            <Form.Item label="公司名称" name="corporate_name" rules={[{ required: true, message: '请输入您的公司名称',}]}>
                                <Input placeholder='请输入您的公司名称'/>
                            </Form.Item>

                            <Form.Item label="营业执照" name="business_license" rules={[{ required: true, message: '请输入您的营业执照',}]}>
                                <Input placeholder='请输入您的营业执照'/>
                            </Form.Item>
                            
                            <Form.Item  label="上传头像" name="avatar"
                                rules={[
                                    {
                                        validator: changePic
                                    }
                                ]}    
                            >
                                <ImgCrop rotate>
                                    <Upload
                                        beforeUpload={beforeUpload}
                                        action={'/admin/common.upload/uploadImage'}
                                        listType="picture-card"
                                        fileList={fileList}
                                        onChange={onUpdataChange}
                                        onPreview={onUpdataPreview}
                                    >
                                        {(fileList.length < 1 ) && '+ Upload'}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>

                            <Form.Item label="视频方向" name="introduction" rules={[{ required: true, message: '请输入您的视频方向',}]}>
                                <Input placeholder='请输入您的视频方向'/>
                            </Form.Item>

                            <Form.Item label="视频长度" name="often" rules={[{ required: true, message: '请输入您的视频长度',}]}>
                                <Input placeholder='请输入您的视频长度'/>
                            </Form.Item>

                            <Form.Item label="主体类型" name="type" rules={[{ required: true, message: '请输入您的主体类型',}]}>
                                <Input placeholder='请输入您的主体类型'/>
                            </Form.Item>

                            <Form.Item label="真实姓名" name="names" rules={[{ required: true, message: '请输入您的真实姓名',}]}>
                                <Input placeholder='请输入您的真实姓名'/>
                            </Form.Item>

                            <Form.Item label="个人简介" name="videodirection" rules={[{ required: true, message: '请输入您的个人简介',}]}>
                                <Input placeholder='请输入您的个人简介'/>
                            </Form.Item>
                            
                            <Form.Item label="状态" name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择您的状态',
                                    },
                                ]}
                            >
                                <Select placeholder="请选择状态" showArrow
                                    value={formData.status} onChange={(status) => {setFormData(preState => ({...preState, status}))}} allowClear>
                                    {
                                        formOption.subcontractor_status.map((item, index) => (
                                            <Select.Option value={index} key={index}>{item}</Select.Option>
                                        ))
                                    }
                                </Select>

                            </Form.Item>
                        </Form>
                    </Modal>: null
                }  
                </Card>
                
            </Card>

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePicCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </div>
       
    )
}
