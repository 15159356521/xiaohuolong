import React, {useState, useEffect } from 'react'
import { Switch, Card, Breadcrumb, Button, Table, Space, Image, Modal, Form, message, DatePicker, Input, Tag, Select, Upload, InputNumber } from 'antd'
import { getRoleBtn } from '../../api/role'
import { useLocation } from 'react-router-dom'
import styles from './index.module.scss'
import { useRef } from 'react'
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { baseIMgURL } from '../../utils/request'
import ImgCrop from 'antd-img-crop';
import { getBase64 } from '../../utils/index'
import { getOptions, addNewList, deleteNewListById, getAddMenu, getAllNewListData, getNewItemById, updateNewListById, searchNewList } from '../../api/newList'
import MyEditor from '../../components/Editor'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import routerContant from '../../utils/constant'

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const {Column} = Table
const { RangePicker } = DatePicker;
// 新闻列表
export default function NewList() {
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
    const [paginationPramas, setPaginationPramas] = useState({
        current: 1, //当前页码
        pageSize: 2, // 每页数据条数
        total: '', // 总条数
        onChange: (current, size) => handlePageChange(current, size), //改变页码的函数
        hideOnSinglePage: false,
        showSizeChanger: true,
    })
    const [formOption, setFormOption] = useState({
        news_class: []
    })
    const handlePageChange = (current, pageSize) => {
        setPaginationPramas(preState => ({...preState, current, pageSize,}))
    }
    const [formData, setFormData] = useState({
        class: '',
        content: '',
        img: '',
        rank: '',
        status: '',
        title: '',
        url: '',
    })
    const getNewListData = async () => {
        setLoading(true)
        const { code, resData, count } = await getAllNewListData()
        setTableData(resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }
    const [searchOpt, setSearchOpt] = useState([])
    const getOptionsFn = async () => {
        const res = await getOptions()
        console.log("🚀 ~ file: index.jsx ~ line 77 ~ getOptionsFn ~ res", res)
        setSearchOpt(res.resData.news_class)
    }
    useEffect(() => {
        (async function () {
            getNewListData()
            getOptionsFn()
            const { resData, msg, code } = await getRoleBtn(id)
            if(code === 401) {
                message.warning('用户未登录， 请登录后操作')
                return navigator('/login', { replace: false })
            }
            setRoleBtn(resData.btn_list)
        })();
    }, []);
   
    // 修改、添加
    const handleOk = async () => {
        if(formData.id) {
            const fileds = await formRef.current.validateFields()
            const {code, msg} = await updateNewListById(formData.id, {
                ...fileds,
                status: formData.status,
                img: formData.img,
                content: formData.content
            })
            
            if(code === 200) {
                getNewListData()
                setIsOpenModal(false)
                message.success(msg)
            }else {
                setIsOpenModal(false)
                message.warning(msg)
            }
        }else {
            const fileds = await formRef.current.validateFields(['title', 'rank', 'img', 'url', 'class'])
            console.log("🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds", fileds, formData)
            if(!formData.content) {
                console.log('asdf')
                return formRef.current.validateFields(['content'])
            }
            const {code, msg} = await addNewList({
                ...fileds, 
                img: formData.img, 
                status: formData.status?2:1,
                content: formData.content
            })
            if(code === 400) {
                message.warning(msg)
                return
            }else {
                message.success(msg)
                getNewListData()
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
            const res = await deleteNewListById(id)
            await getNewListData()
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
            class: '',
            content: '',
            img: '',
            rank: '',
            status: '',
            title: '',
            url: '',
        })
        setFileList([])
        const {msg, resData, code} = await getAddMenu()
        if(code === 200) {
            setFormOption({
                news_class: resData.news_class
            })
        }else {
            message.warning(msg)
        }
    }
    
    // 编辑操作
    const handlerEidt =async (record) => {
        try {
            const {msg, resData, code} = await getNewItemById(record.id)
            console.log("🚀 ~ file: index.jsx ~ line 166 ~ handlerEidt ~ resData", resData)
            if(code === 200) {
                setFormOption({
                    news_class: resData.news_class
                })
                setFormData(resData.info) 
                const filesList = []
                filesList.push({
                    name: resData.info.img.split('/')[resData.info.img.split('/').length - 1],
                    url: `${baseIMgURL}${resData.info.img}`
                })
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

    // 图片相关操作
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
        const {code, msg, resData} = await searchNewList({
            title: '',
            class: '',
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
        console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value)
        const {code, msg, resData} = await searchNewList(value)
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
        <div>
            <Card className={styles.root}>
                <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/newList">新闻列表</Breadcrumb.Item>
                </Breadcrumb>

                <Card>
                    <Form layout="inline" onFinish={onFinish} form={form}>
                        <Form.Item label="标题" name="title">
                            <Input placeholder="请输入搜索标题" prefix={<SearchOutlined />} allowClear/>
                        </Form.Item>
                        <Form.Item label="分类" name="class">
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
                    <Column title="图片" width={80} dataIndex="img" key="img" render={(_, record) => (
                        <Image
                            preview={{
                                imgVisible: false,
                            }}
                            src={baseIMgURL + record.img}
                        />
                    )}/>
                    <Column align='center' title="名称" dataIndex="title" key="title" />
                    <Column align='center' title="添加时间" dataIndex="add_time" key="add_time" />
                    <Column align='center' title="分类" dataIndex="class" key="class" />
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
                    <Modal width={1200} title={formData.id? '修改数据': '新增数据'} open={isOpenModal} onOk={handleOk} onCancel={handleCancel} okText="确定" cancelText="取消">
                        <Form ref={formRef} labelCol={{span: 5,}} wrapperCol={{span: 16,}} 
                            initialValues={{
                                ...formData, 
                            }}
                                autoComplete="off"
                            >
                            <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入您的标题',}]}>
                                <Input placeholder='请输入您的标题'/>
                            </Form.Item>
                            <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入您的内容',}]}>
                                {/* <Input placeholder='请输入内容'/> */}
                                <MyEditor content={formData.content} getContent={getContent}/>
                            </Form.Item> 
                            <Form.Item label="排序" name="rank" rules={[{ required: true, message: '请输入您的排序',}]}>
                                <InputNumber min={0} placeholder='请输入排序'/>
                            </Form.Item>
                            <Form.Item label="第三方链接" name="url" rules={[{ required: true, message: '请输入您的第三方链接',}]}>
                                <Input placeholder='请输入第三方链接'/>
                            </Form.Item>
                            <Form.Item  label="图片上传" name="img"
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
                            
                            <Form.Item label="类型" name="class"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择您的类型',
                                    },
                                ]}
                            >
                                <Select placeholder="请选择等级类型" showArrow
                                    value={formData.class} onChange={(item) => {setFormData(preState => ({...preState, class: item}))}} allowClear>
                                    {
                                        formOption.news_class.map((item, index) => (
                                            <Select.Option value={item} key={index}>{item}</Select.Option>
                                        ))
                                    }
                                </Select>

                            </Form.Item>

                            <Form.Item  label="状态" name="status" rules={[{ required: true, message: '请选择您的状态',}]}>
                                <Switch checked={formData.status===1} onChange={(flag) => setFormData(preState => ({...preState, status: flag? 1: 2}))} />
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
