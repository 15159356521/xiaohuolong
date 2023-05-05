import { Card, Breadcrumb, Modal, Form, Input, Table, Space, Button, Image, Tag, DatePicker, message, Radio, Switch, Select, Upload, InputNumber  } from 'antd'
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './index.module.scss'
import { getRoleBtn } from '../../api/role'
import { useRef } from 'react';
import moment from 'moment';
import ImgCrop from 'antd-img-crop';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import {baseURL} from '../../utils/request'
import { getBase64 } from '../../utils'
import { addActiveItem, deleteActiveItemById, getAciveDataById, getActiveAllData, getActiveMenu, searchActive, updateActiveDataById } from '../../api/activeList';
import { baseIMgURL } from '../../utils/request'
import Editor from '../../components/Editor'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import routerContant from '../../utils/constant'
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const { Column } = Table
const { RangePicker } = DatePicker;

export default function ActiveList() {
    // const { state: {id} } = useLocation()
    const location = useLocation()
    const id = routerContant[location.pathname.split('/').pop()].split('-').pop()
    const [roleBtn, setRoleBtn] = useState([])
    const [tableData, setTableData] = useState([])
    const navigator = useNavigate()
    const getActiveList = async () => {
        setLoading(true)
        const { code, resData, count } = await getActiveAllData()
        console.log("🚀 ~ file: index.jsx ~ line 26 ~ getActiveList ~ resData", resData)
        setTableData(resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }
    useEffect(() => {
        (async function () {
            getActiveList()
            const { resData, msg, code } = await getRoleBtn(id)
            if(code === 401) {
                message.warning('用户未登录， 请登录后操作')
                return navigator('/login', { replace: false })
            }
            setRoleBtn(resData.btn_list)
        })();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const formRef = useRef(null)
   
    // 修改、添加
    const handleOk = async () => {
        if(formData.id) {
            const fileds = await formRef.current.validateFields()
            const {code, msg} = await updateActiveDataById(formData.id, {
                ...fileds, 
                start_time: fileds['activeTime'][0].format(dateFormat), 
                end_time: fileds['activeTime'][1].format(dateFormat),
                img: formData.img,
                content: formData.content
            })
            if(code === 200) {
                getActiveList()
                setIsModalOpen(false)
                message.success(msg)
            }else {
                setIsModalOpen(false)
                message.warning(msg)
            }
        }else {
            const fileds = await formRef.current.validateFields(['class', 'activeTime', 'img', 'impose', 'money', 'rank', 'status', 'title', 'url'])
            if(!formData.content) {
                return formRef.current.validateFields(['contetn'])
            }
            if(formData.status === '') {
                formData.status = 1
            }
            console.log(fileds, formData)

            const {code, msg} = await addActiveItem({
                ...fileds, 
                img: formData.img, 
                start_time: fileds['activeTime'][0].format(dateFormat), 
                end_time: fileds['activeTime'][1].format(dateFormat),
                content: formData.content
            })
            if(code === 400) {
                message.warning(msg)
                return
            }else {
                message.success(msg)
                getActiveList()
                setIsModalOpen(false)
            }
        }
    }

    const changePic = (errorInfo) => {
        return !formData.img ? Promise.reject('请选择一张图片'): Promise.resolve()
    }

    // 删除
    const handlerOk = async (id) => {
        console.log("🚀 ~ file: index.jsx ~ line 86 ~ handlerOk ~ id", id)
        try{
            const res = await deleteActiveItemById(id)
            await getActiveList()
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
        setIsModalOpen(true)
        setFormData({
            class: '',
            content: '',
            end_time: '',
            img: '',
            impose: [],
            money: '',
            rank: '',
            start_time: '',
            status: '',
            title: '',
            url: '',
        })
        setFileList([])

        try {
            const res = await getActiveMenu()
            console.log("🚀 ~ file: index.jsx ~ line 120 ~ handlerAdd ~ res", res)
            if(res.code === 200) {
                setFormOptData(res.resData)
            }else {
                message.warning('获取数据失败')
            }
        }catch(e) {
            message.warning(e)
        }
        
    }
    
    // 表单数据
    const [formData, setFormData] = useState({
        class: '',
        content: '',
        end_time: '',
        img: '',
        impose: [],
        money: '',
        rank: '',
        start_time: '',
        status: '',
        title: '',
        url: '',
    })

    // 表单相关列表
    const [formOptData, setFormOptData] = useState({
        task_class:[],
        task_impose: [],
        task_status: [],
    })

    // 编辑操作
    const handlerEidt =async (record) => {
        const res = await getAciveDataById(record.id)
        if(res.code === 200) {
            setFormData(res.resData.info)
            setFormOptData({
                task_class: res.resData.task_class,
                task_impose: res.resData.task_impose,
                task_status: res.resData.task_status,
            })
            const filesList = []
            filesList.push({
                name: res.resData.info.img.split('/')[res.resData.info.img.split('/').length - 1],
                url: `${baseIMgURL}/${res.resData.info.img}`
            })
            setFileList(filesList)
        }else {
            message.warning(res.msg)
        }
        setIsModalOpen(true)
    }   

    // 弹窗取消逻辑
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    // 改变当前页码
    const handlePageChange = (current, pageSize) => {
        setPaginationPramas(preState => ({...preState, current, pageSize,}))
    }
    // 分页器
    const [paginationPramas, setPaginationPramas] = useState({
        current: 1, //当前页码
        pageSize: 2, // 每页数据条数
        total: '', // 总条数
        onChange: (current, size) => handlePageChange(current, size), //改变页码的函数
        hideOnSinglePage: false,
        showSizeChanger: true,
    })

    // 上传图片
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
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

    const getContent = (content) => {
        console.log('getContent', content)

        setFormData(preState => ({...preState, content: content}))
        formRef.current.setFieldValue({content: content})
    }

    // 搜索功能
    const [form] = Form.useForm();
    const onReset = async () => {
        form.resetFields();
        const {code, msg, resData} = await searchActive({
            title: '',
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
        const {code, msg, resData} = await searchActive(value)
        if(code === 200) {
            message.success('查询成功')
            setTableData(resData)
        }else {
            message.warning(msg)
            return
        }
    }
    
    return (
        <div>
            <Card className={styles.root}>
                <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/activeList">活动列表</Breadcrumb.Item>
                </Breadcrumb>

                <Card>
                    <Form layout="inline" onFinish={onFinish} form={form}>
                        <Form.Item label="标题" name="title">
                            <Input placeholder="请输入搜索名称" prefix={<SearchOutlined />} allowClear/>
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
                            ? <Button type='primary' onClick={handlerAdd}>添加</Button> : null
                    }

                    <Table scroll={{x: 1400,}} pagination={paginationPramas} rowKey="id" dataSource={tableData} loading={loading} style={{marginTop: '20px'}}>
                        <Column align='center'  title="图片" dataIndex="img" key="img" fixed="left" render={(_, record) => (
                            <Image
                                preview={{
                                    imgVisible: false,
                                }}
                                src={baseIMgURL + record.img}
                            />
                        )}/>
                        <Column align='center' title="名称" dataIndex="title" key="title" fixed="left"/>
                        <Column align='center' title="奖金" dataIndex="money" key="money" />
                        <Column width={500} align='center' title="参加限制" dataIndex="impose" key="impose" render={(_, record) => (
                            <>
                                {
                                    record.impose.map((item, index) => <Tag key={index} color="#f50">{item}</Tag>)
                                }
                            </>
                        )}/>
                        <Column align='center' title="开始时间" dataIndex="start_time" key="start_time" width={200}/>
                        <Column align='center' title="结束时间" dataIndex="end_time" key="end_time" width={200}/>
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
                        isModalOpen ? <Modal width={1200} title={formData.id? '修改数据':'新增数据'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确定" cancelText="取消">
                            <Form
                                ref={formRef}
                                labelCol={{
                                    span: 5,
                                }}
                                wrapperCol={{
                                    span: 16,
                                }}
                                autoComplete="off"
                                initialValues={{
                                    ...formData, 
                                    status: formData.id? formData.status+'': '',
                                    activeTime: formData.id? [moment(formData.start_time, dateFormat), moment(formData.end_time, dateFormat)]: null
                                }}
                            >
                                {/* 标题 */}
                                <Form.Item
                                    label="标题"
                                    name="title"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入您的标题',
                                        },
                                    ]}
                                >
                                    <Input placeholder='请输入标题'/>
                                </Form.Item>

                                <Form.Item
                                    label="内容"
                                    name="content"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入您的内容',
                                        },
                                    ]}
                                >
                                <Editor content={formData.content} getContent={getContent}/>
                                </Form.Item>
                                
                                {/* 图片上传 */}
                                <Form.Item 
                                    label="图片上传"
                                    name="img"
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

                                <Form.Item
                                    label="三方跳转外链"
                                    name="url"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入三方跳转外链',
                                        },
                                    ]}
                                >
                                    <Input placeholder='请输入三方跳转外链'/>
                                </Form.Item>

                                {/* 奖金 */}
                                <Form.Item label="奖金" name="money" rules={[{ required: true,message: '请输入您的奖金'},]}>
                                    <InputNumber decimalSeparator="." style={{width: '414px'}} prefix="￥" min={0} placeholder='请输入奖金'/>
                                </Form.Item>

                                <Form.Item label="等级限制" name="impose" rules={[{ required: true, message: '请选择您的等级',},]}>
                                    <Select placeholder="请选择等级限制" mode="multiple" showArrow
                                        value={formData.impose} onChange={(impose) => {setFormData(preState => ({...preState, impose}))}} allowClear>
                                        {
                                            formOptData.task_impose.map((item, index) => (
                                                <Select.Option value={item} key={index}>{item}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>

                                {/* 授权时间 */}
                                <Form.Item label="授权时间" name="activeTime" messageVariables rules={[{required: true,message: '请选择您的授权时间'}]}>
                                    <RangePicker onChange={(date, dateString) => 
                                        {setFormData(preState => ({...preState, auth_add_time: dateString[0], auth_end_time: dateString[1]}))}} 
                                        showTime 
                                        format={dateFormat}
                                    />
                                </Form.Item>
                                
                                {/* 平台列表 */}
                                <Form.Item label="类型" name="class" rules={[{ required: true, message: '请输入您的排序',}]}>
                                    <Select placeholder="请选择类型" value={formData.id? formData.class : ''} onChange={(item) => {setFormData(preState => ({...preState, class: item}))}} allowClear>
                                            {
                                                formOptData.task_class.map((item, index) => (
                                                    <Select.Option value={item} key={index}>{item}</Select.Option>
                                                ))
                                            }
                                    </Select>
                                </Form.Item>

                                {/* 状态 */}
                                <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择您的状态',}]}>
                                    <Select placeholder="请选择您的状态" value={formData.status} onChange={(item) => {setFormData(preState => ({...preState, status: item}))}} allowClear>
                                        {
                                            Object.keys(formOptData.task_status).map(item => {
                                                return <Select.Option value={item} key={item}>{formOptData.task_status[item]}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>

                                {/* 排序 */}
                                <Form.Item label="排序" name="rank" rules={[{ required: true, message: '请选择您的地区',},]}>
                                    <Input type='number' min={0} placeholder='请输入奖金'/>
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
