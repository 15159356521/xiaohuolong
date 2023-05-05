import React, { useCallback, useState, useEffect } from 'react'
import { Card, Breadcrumb, Button, Table, Space, Image, Modal, Form, message, DatePicker, Input, Tag, Select, Upload } from 'antd'
import { addTaskItem, getOptions, getAllTaskListData, getTaskListById, updateTaskListById, addTaskList, deleteTaskListById, searchTaskList } from '../../api/taskList'
import { getRoleBtn } from '../../api/role'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { useRef } from 'react'
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { getBase64 } from '../../utils/index'
import {baseIMgURL} from '../../utils/request'
import 'quill/dist/quill.snow.css'; // 主题样式
import 'quill/dist/quill.bubble.css'; // 主题样式
import axios from 'axios'
import Editor from '../../components/Editor'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import routerContant from '../../utils/constant'

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const {Column} = Table
const { RangePicker } = DatePicker;

export default function TaskList() {
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
        task_drawer_id: '',
        title: '',
        content: '',
        img: '',
        bonus: '',
        impose: [],
        participate: '',
        start_time: '',
        end_time: '',
        class: '',
        status: '',
    })
    const getTaskListData = async () => {
        setLoading(true)
        const { code, resData, count } = await getAllTaskListData()
        setTableData(resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }
    const [searchOpt, setSearchOpt] = useState({
        task_drawer_list: [],
        task_class: [],
        task_status: {}
    })
    const getOptionsFn = async () => {
        const res = await getOptions()
        console.log("🚀 ~ file: index.jsx ~ line 77 ~ getOptionsFn ~ res", res)
        setSearchOpt(res.resData)
    }
    useEffect(() => {
        (async function () {
            getTaskListData()
            getOptionsFn()
            const { code, resData, count, msg } = await getRoleBtn(id)
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

            const {code, msg} = await updateTaskListById(formData.id, {
                ...fileds,
                img: formData.img,
                start_time: fileds['activeTime'][0].format(dateFormat), 
                end_time: fileds['activeTime'][1].format(dateFormat),
                content: formData.content
            })
            
            if(code === 200) {
                getTaskListData()
                setIsOpenModal(false)
                message.success(msg)
            }else {
                setIsOpenModal(false)
                message.warning(msg)
            }
        }else {
            const fileds = await formRef.current.validateFields(['task_drawer_id','title', 'activeTime', 'img', 'bonus', 'impose', 'participate', 'class', 'status'])
            if(!formData.content) {
                return formRef.current.validateFields(['contetn'])
            }
            const {code, msg} = await addTaskList({
                ...fileds, 
                img: formData.img, 
                start_time: fileds['activeTime'][0].format(dateFormat), 
                end_time: fileds['activeTime'][1].format(dateFormat),
                status: formData.status,
                task_drawer_id: formData.task_drawer_id,
                content: formData.content
            })
            if(code === 400) {
                message.warning(msg)
                return
            }else {
                message.success(msg)
                getTaskListData()
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
            await getTaskListData()
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
            task_drawer_id: '',
            title: '',
            content: '',
            img: '',
            bonus: '',
            impose: [],
            participate: '',
            start_time: '',
            end_time: '',
            class: '',
            status: '',
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
        try {
            const {msg, resData, code} = await getTaskListById(record.id)
            if(code === 200) {
                setFormOption(resData)
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

    const onUpdataChange = ({ fileList: newFileList }) => {
        console.log(fileList,'sdfdfsfsd');
        setFileList(newFileList);
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

    const content = useRef(null)

    const reactQuillRef = useRef(null)
    const handleChange = (value) => {
        console.log(value)
        content.current = value
        // setFormData(preState=> ({...preState, content: value}))
    }

    const handlerImg = (value) => {
        if(value) {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.setAttribute('multiple', 'multiple');
            input.click();
            input.onchange = async () => {
                Array.from(input.files).forEach(async (item) => {
                    const formData = new FormData();
                    formData.append('file', item);
                    // 上传图片
                    const {data: {code, data, msg}} = await axios({
                        url:'/admin/common.upload/uploadImage',
                        method: 'post',
                        data: formData
                    })
                    if(code === 200) {
                        console.log(reactQuillRef)
                        let quill = reactQuillRef.current.editor
                        const cursorPosition = quill.getSelection().index;//获取当前光标位置
                        const link = data.url;
                        quill.insertEmbed(cursorPosition, "image", link);//插入图片
                        quill.setSelection(cursorPosition + 1);//光标位置加1
                    }

                });
            };
        }else {

        }
    }

    const getContent = (content) => {
        console.log('getContent', content)

        setFormData(preState => ({...preState, content: content}))
        formRef.current.setFieldValue({content: content})
    }

    const [form] = Form.useForm();
    const onReset = async () => {
        form.resetFields();
        const {code, msg, resData} = await searchTaskList({
            title: '',
            class: '',
            status: '',
            task_drawer_id: '',
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
        console.log("🚀 ~ file: index.jsx ~ line 267 ~ onFinish ~ value", value)
        const {code, msg, resData} = await searchTaskList(value)
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
                    <Breadcrumb.Item href="#/taskList">任务列表</Breadcrumb.Item>
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
                                    searchOpt.task_class.map(item => (<Select.Option value={item} key={item}>{item}</Select.Option>))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="状态" name="status">
                            <Select
                                placeholder="请选择"
                                name="level"
                                allowClear
                                >
                                {
                                    Object.keys(searchOpt.task_status).map(item => {
                                        return <Select.Option value={item} key={item}>{searchOpt.task_status[item]}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="状态" name="task_drawer_id" >
                            <Select
                                style={{width: '250px'}}
                                placeholder="请选择"
                                name="level"
                                allowClear
                                >
                                {
                                    searchOpt.task_drawer_list.map(item => (<Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>))
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
                <Table scroll={{x: 1400,}} pagination={paginationPramas} rowKey="id"  dataSource={tableData} loading={loading} style={{marginTop: '20px'}}>
                    <Column align='center' title="id" dataIndex="id" key="id" fixed="left"/>
                    <Column align='center' title="任务抽屉" dataIndex="taskdrawer" key="taskdrawer" render={(_, record) => (
                        record.taskdrawer.title
                    )}/>
                    <Column align='center' title="名称" dataIndex="title" key="title" />
                    <Column align='center' title="奖金" dataIndex="bonus" key="bonus"/>
                    <Column title="图片" dataIndex="img" key="img" render={(_, record) => (
                        <Image
                            preview={{
                                imgVisible: false,
                            }}
                            src={baseIMgURL + record.img}
                        />
                    )}/>
                    <Column width={200} align='center' title="参加限制" dataIndex="impose" key="impose" render={(_, record) => (
                        <Space size="small">
                            {
                                record.impose.map(item => <Tag key={item}>{item}</Tag>)
                            }
                        </Space>
                    )} />
                    <Column align='center' title="参加人数" dataIndex="participate" key="participate" />
                    <Column align='center' title="类型" dataIndex="class" key="class" />
                    <Column align='center' title="状态" dataIndex="status_text" key="status_text" />
                    <Column align='center' title="开始时间" dataIndex="start_time" key="start_time" />
                    <Column align='center' title="最终时间" dataIndex="end_time" key="end_time" />                   
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
                                status: formData.id? formData.status+'': '',
                                activeTime: formData.id? [moment(formData.start_time, dateFormat), moment(formData.end_time, dateFormat)]: null
                            }}
                                autoComplete="off"
                            >
                            <Form.Item label="任务抽屉" name="task_drawer_id" rules={[{ required: true, message: '请输入您的标题',}]}>
                                <Select placeholder="请选择您的任务抽屉" value={formData.task_drawer_id} onChange={(id) => {setFormData(preState => ({...preState, task_drawer_id: id}))}} allowClear>
                                    {
                                        formOption.task_drawer_list && formOption.task_drawer_list.map((item, index) => (
                                            <Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入您的标题',}]}>
                                <Input placeholder='请输入标题'/>
                            </Form.Item>

                            <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入您的内容',}]}>
                                <Editor content={formData.content} getContent={getContent}/>
                            </Form.Item>

                            <Form.Item label="图片上传" name="img"
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
                            <Form.Item label="奖金" name="bonus" rules={[{ required: true, message: '请输入您的奖金',}]}>
                                <Input type="number" placeholder='请输入内容'/>
                            </Form.Item>
                            
                            <Form.Item label="等级限制" name="impose"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择您的等级',
                                    },
                                ]}
                            >
                                <Select placeholder="请选择等级限制" mode="multiple" showArrow
                                    value={formData.grade} onChange={(grade) => {setFormData(preState => ({...preState, grade}))}} allowClear>
                                    {
                                        formOption.task_impose.map((item, index) => (
                                            <Select.Option value={item} key={index}>{item}</Select.Option>
                                        ))
                                    }
                                </Select>

                            </Form.Item>

                            <Form.Item label="参加人数" name="participate" rules={[{ required: true, message: '请输入您的参加人数',}]}>
                                <Input type="number" min={0}  placeholder='请输入参加人数'/>
                            </Form.Item>

                            <Form.Item label="活动时间" name="activeTime" messageVariables 
                                rules={[{ required: true, message: '请选择您的授权时间',type: 'array',},]}>
                                        <RangePicker style={{width: '435px'}} onChange={(date, dateString) => 
                                            {setFormData(preState => ({...preState, start_time: dateString[0], end_time: dateString[1]}))}} 
                                            showTime 
                                            format={dateFormat}
                                        />
                            </Form.Item>
                            <Form.Item label="类型" name="class" rules={[{ required: true, message: '请输入您的排序',}]}>
                                <Select placeholder="请选择类型" value={formData.class} onChange={(item) => {setFormData(preState => ({...preState, class: item}))}} allowClear>
                                        {
                                            formOption.task_class.map((item, index) => (
                                                <Select.Option value={item} key={index}>{item}</Select.Option>
                                            ))
                                        }
                                </Select>
                            </Form.Item>
                            <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择您的状态',}]}>
                                <Select placeholder="请选择您的状态" value={formData.status} onChange={(item) => {setFormData(preState => ({...preState, status: item}))}} allowClear>
                                    {
                                        Object.keys(formOption.task_status).map(item => {
                                            return <Select.Option value={item} key={item}>{formOption.task_status[item]}</Select.Option>
                                        })
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
