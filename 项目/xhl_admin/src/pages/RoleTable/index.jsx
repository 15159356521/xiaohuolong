import { Card, Breadcrumb, Modal, Form, Input, Table, Space, Button, Image, Tag, DatePicker, message, Radio, Switch, Select, Upload, Row, Col  } from 'antd'
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from './index.module.scss'
import { getRoleBtn } from '../../api/role'
import { useRef } from 'react';
import { deletePlatDataById,getOptions, getPlatData, getPlatDataById, updataPlatDataById, getPlatOption, addPlatData, searchPlatList } from '../../api/roleTable'
import moment from 'moment';
import ImgCrop from 'antd-img-crop';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { baseIMgURL} from '../../utils/request'
import { getBase64 } from '../../utils'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import routerContant from '../../utils/constant';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const { Column } = Table
const { RangePicker } = DatePicker;

export default function RoleTable() {
    // const { state: {id} } = useLocation()
    const location = useLocation()
    const id = routerContant[location.pathname.split('/').pop()].split('-').pop()
    const [ roleBtn, setRoleBtn ] = useState([])
    const [tableData, setTableData] = useState([])
    const getPlatTable = async () => {
        setLoading(true)
        const { code, resData, count } = await getPlatData()
        setTableData(resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }
    const [searchOpt, setSearchOpt] = useState({
        platform_list: [],
        copyright_type: [],
        copyright_years: [],
        copyright_region: [],
        copyright_make: {},
        copyright_status: {},
        copyright_grade: [],
    })
    const getOptionsFn = async () => {
        const res = await getOptions()
        console.log("🚀 ~ file: index.jsx ~ line 77 ~ getOptionsFn ~ res", res)
        setSearchOpt(res.resData)
    }

    useEffect(() => {
        (async function () {
            getPlatTable()
            getOptionsFn()
            const { resData, msg, code } = await getRoleBtn(id)
            if(code === 401) {
                message.warning('用户未登录， 请登录后操作')
                return navigator('/login', { replace: false })
            }
            setRoleBtn(resData.btn_list)
        })();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const formRef = useRef(null)
   
    // 修改、添加
    const handleOk = async () => {
        if(formData.id) {
            const fileds = await formRef.current.validateFields()
            const data = await formData.current?.validateFields('range-time-picker')
            const {code, msg} = await updataPlatDataById(formData.id, {
                ...formData,
                title: fileds.
                title, score: 
                fileds.score, file_url:
                fileds.file_url,
             })
            if(code === 200) {
                getPlatTable()
                setIsModalOpen(false)
                message.success(msg)
            }else {
                setIsModalOpen(false)
                message.warning(msg)
            }
        }else {
            const fileds = await formRef.current.validateFields(['file_url','img', 'status', 'authTime', 'title', 'copyright_platform_id', 'type', 'years', 'region', 'classify', 'level', 'make', 'score'])
            if(formData.status === '') {
                formData.status = 1
            }
            console.log(fileds, formData)

            const {code, msg} = await addPlatData({...formData, title: fileds.title, score: fileds.score, file_url: fileds.file_url})
            if(code === 400) {
                message.warning(msg)
                return
            }else {
                message.success(msg)
                getPlatTable()
                setIsModalOpen(false)
            }
        }
    }

    const changePic = (errorInfo) => {
        return !formData.img ? Promise.reject('请选择一张图片'): Promise.resolve()
    }

    // 删除
    const handlerOk = async (id) => {
        try{
            const res = await deletePlatDataById(id)
            await getPlatTable()
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
            copyright_platform_id: '',
            title: '',
            type: '',
            years: '',
            region: '',
            classify: '',
            level: '',
            make: '',
            score: '',
            img: '',
            auth_add_time: null,
            auth_end_time: null,
            status: '',
            file_url: '',
        })
        setFileList([])

        try {
            const res = await getPlatOption()
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
        copyright_platform_id: '',
        title: '',
        type: '',
        years: '',
        region: '',
        classify: '',
        level: '',
        make: '',
        score: '',
        img: '',
        auth_add_time: null ,
        auth_end_time: null ,
        status: '',
        file_url: '',
    })
    // 表单相关列表
    const [formOptData, setFormOptData] = useState({
        platform_list: [],      
        copyright_type: [],    
        copyright_years: [],    
        copyright_region: [],   
        copyright_classify: [],
        copyright_make: {},
        copyright_status: {},
        copyright_grade:[],           
    })

    // 编辑操作
    const handlerEidt =async (record) => {
        const res = await getPlatDataById(record.id)
        if(res.code === 200) {
            setFormData(res.resData.info)
            setFormOptData(res.resData)
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

    const [ selCompany, setSelCompany ] = useState('')
    useEffect(() => {
        const sel = formOptData.platform_list.find(item => item.id === formData.copyright_platform_id)
        setSelCompany(sel?.id)
    }, [formData, formOptData.platform_list.length])

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

    // 搜索功能
    const [form] = Form.useForm();
    const onReset = async () => {
        form.resetFields();
        const {code, msg, resData} = await searchPlatList({
            copyright_platform_id: '',
            level: '',
            make: '',
            name: '',
            region: '',
            score: '',
            type: '',
            years: '',
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
        console.log("🚀 ~ file: index.jsx ~ line 294 ~ onFinish ~ value", value)
        const {code, msg, resData} = await searchPlatList(value)
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
            <Card >
                <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/roleTable">版本表</Breadcrumb.Item>
                </Breadcrumb>

                <Card>
                    <Form labelCol={{ span: 2,}} wrapperCol={{ span: 16,}} layout="inline" onFinish={onFinish} 
                        form={form} style={{display: 'flex', flexDirection:'column'}}>
                        <Form.Item label="名称" name="name">
                            <Input placeholder="请输入搜索名称" prefix={<SearchOutlined />} allowClear/>
                        </Form.Item>
                        <Form.Item label="分数" name="score">
                            <Input placeholder='请输入' allowClear/>
                        </Form.Item>
                        <Form.Item label="平台列表" name="copyright_platform_id">
                            <Select
                                placeholder="请选择"
                                name="level"
                                allowClear
                                >
                                {
                                    searchOpt.platform_list.map(item => (<Select.Option value={item.id} key={item.id}>{item.company}</Select.Option>))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="类型" name="type">
                            <Select
                                placeholder="请选择"
                                name="level"
                                allowClear
                                >
                                {
                                    searchOpt.copyright_type.map(item => (<Select.Option value={item} key={item}>{item}</Select.Option>))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="年份" name="years">
                            <Select
                                placeholder="请选择"
                                name="level"
                                allowClear
                                >
                                {
                                    searchOpt.copyright_years.map(item => (<Select.Option value={item} key={item}>{item}</Select.Option>))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="地区" name="region">
                            <Select
                                placeholder="请选择"
                                name="level"
                                allowClear
                                >
                                {
                                    searchOpt.copyright_region.map(item => (<Select.Option value={item} key={item}>{item}</Select.Option>))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="等级" name="level">
                            <Select
                                placeholder="请选择"
                                name="level"
                                allowClear
                                >
                                {
                                    searchOpt.copyright_grade.map(item => (<Select.Option value={item} key={item}>{item}</Select.Option>))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="视频创造" name="make">
                            <Select
                                placeholder="请选择"
                                name="level"
                                allowClear
                                >
                                {
                                    Object.keys(searchOpt.copyright_make).map(item => 
                                        (<Select.Option value={item} key={item}>{searchOpt.copyright_make[item]}</Select.Option>)
                                    )
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
                                    Object.keys(searchOpt.copyright_status).map(item => 
                                        (<Select.Option value={item} key={item}>{searchOpt.copyright_status[item]}</Select.Option>)
                                    )
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item style={{marginLeft: '120px'}}>
                            <Space >
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
                    <Column title="归属平台ID" dataIndex="copyright_platform_id" key="copyright_platform_id" fixed="left"/>
                    <Column title="版权标题" dataIndex="title" key="title" fixed="left"/>
                    <Column title="类型" dataIndex="type" key="type" />
                    <Column title="年份" dataIndex="years" key="years" />
                    <Column title="地区" dataIndex="region" key="region" />
                    <Column title="等级" dataIndex="level" key="level" 
                        render={(_, record) => (
                            <>
                                {record.level==='S' && <Tag color="#f50">{record.level}</Tag>}
                                {record.level==='A' && <Tag color="#2db7f5">{record.level}</Tag>}
                                {record.level==='B' && <Tag color="#87d068">{record.level}</Tag>}
                                {record.level==='C' && <Tag color="#108ee9">{record.level}</Tag>}
                            </>
                        )} />
                    <Column title="视频类型" dataIndex="make" key="make"  render={(_, record) => (
                        <Space>
                            {   
                                record.make === '1' ?  <Tag color="#87d068">拆条</Tag> : <Tag color="#2db7f5">二创</Tag>
                            }
                        </Space>
                    )}/>
                    <Column title="评分" dataIndex="score" key="score" />
                    <Column title="图片" dataIndex="img" key="img" render={(_, record) => (
                        <Image
                            preview={{
                                imgVisible: false,
                            }}
                            src={baseIMgURL + record.img}
                        />
                    )}/>
                    <Column title="授权开始时间" dataIndex="auth_add_time" key="auth_add_time" width={200}/>
                    <Column title="授权结束时间" dataIndex="auth_end_time" key="auth_end_time" width={200}/>
                    <Column title="状态" dataIndex="status" key="status" render={(_, record) => (
                        <Space>
                            {
                                record.status === 1 ?  <Tag color="#87d068">上架</Tag> : <Tag color="#2db7f5">未上架</Tag>
                            }
                        </Space>
                    )} />
                    <Column title="文件地址" dataIndex="file_url" key="file_url" 
                        render={(_, record) => ( record.copyrightfile.src && <Tag color="#87d068">{record.copyrightfile.src}</Tag> )}/>
                    <Column title="操作" key="operation" fixed="right" render={(_, record) => (
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
                    isModalOpen ? 
                    <Modal width={1200} title='新增数据' open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确定" cancelText="取消">
                        <Form
                            validateStatus="error"
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
                                authTime: formData.id?  [moment(formData.auth_add_time, dateFormat), moment(formData.auth_end_time, dateFormat)]: null
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
                                label="文件地址"
                                name="file_url"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入文件地址',
                                    },
                                ]}
                            >
                                <Input placeholder='请输入标题'/>
                            </Form.Item>

                            {/* 分数 */}
                            <Form.Item
                                label="分数"
                                name="score"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入您的评分'
                                    },
                                ]}
                            >
                                <Input type='number' placeholder='请输入评分'/>
                            </Form.Item>

                            {/* 授权时间 */}
                            <Form.Item 
                                label="授权时间" 
                                name="authTime"
                                messageVariables 
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择您的授权时间',
                                        type: 'array',
                                    },
                                ]}>

                                <RangePicker onChange={(date, dateString) => 
                                    {setFormData(preState => ({...preState, auth_add_time: dateString[0], auth_end_time: dateString[1]}))}} 
                                    showTime 
                                    format={dateFormat}
                                />
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
                            
                            {/* 平台列表 */}
                            <Form.Item
                                label="平台列表"
                                name="copyright_platform_id"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择您的平台列表',
                                    },
                                ]}    
                            >

                                <Select placeholder="请选择平台" value={selCompany} onChange={(id) => setFormData(preState => ({...preState, copyright_platform_id: id}))} allowClear>
                                    {
                                        formOptData.platform_list.map(item =>  (
                                            <Select.Option value={item.id} key={item.id}>{item.company}</Select.Option>
                                        ))
                                    }
                                </Select>
                                
                            </Form.Item>

                            {/* 二创，拆条 */}
                            <Form.Item
                                label="视频创作"
                                name="make"
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择您的创作',
                                    },
                                ]}
                            >
                                <Radio.Group buttonStyle="solid" value={formData.make + ''} onChange={(e) => setFormData(preState => ({...preState, make: e.target.value}))}>
                                    <Space>
                                        {
                                            Object.keys(formOptData.copyright_make).map(item => {
                                                return <Radio.Button value={item} key={item}>{formOptData.copyright_make[item]}</Radio.Button>
                                            })
                                        }
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            {/* 地区 */}
                            <Form.Item
                                label="地区"
                                name="region"
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择您的地区',
                                    },
                                ]}
                            >
                                <Radio.Group buttonStyle="solid" value={formData.region} onChange={(e) => setFormData(preState => ({...preState, region: e.target.value}))}>
                                    <Space style={{display: 'flex', flexWrap: 'wrap', width: '100%'}}>
                                        {
                                            formOptData.copyright_region.map((item, index) => 
                                                <Radio.Button style={{maxWidth: '200px', display: 'flex'}} value={item} key={index}>{item}</Radio.Button>
                                            )
                                        }
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                label="类型"
                                name="type"
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择您的类型',
                                    },
                                ]}
                            >
                                <Radio.Group buttonStyle="solid" value={formData.type} onChange={(e) => setFormData(preState => ({...preState, type: e.target.value}))}>
                                    <Space style={{display: 'flex', flexWrap: 'wrap', width: '100%'}}>
                                        {
                                            formOptData.copyright_type.map((item, index) => 
                                                <Radio.Button style={{maxWidth: '200px', display: 'flex'}} value={item} key={index}>{item}</Radio.Button>
                                            )
                                        }
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            {/* 年份 */}
                            <Form.Item
                                label="年份"
                                name="years"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择您的年份',
                                    },
                                ]}
                            >
                                <Radio.Group buttonStyle="solid" value={formData.years} onChange={(e) => setFormData(preState => ({...preState, years: e.target.value}))}>
                                    <Space style={{display: 'flex', flexWrap: 'wrap', width: '100%'}}>
                                        {
                                            formOptData.copyright_years.map((item, index) => 
                                                <Radio.Button value={item} key={index}>{item}</Radio.Button>
                                            )
                                        }
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                            
                            {/* 是否上架 */}
                            <Form.Item
                                label="是否上架"
                                name="status"
                                valuePropName="checked"
                            >
                                { formData.status === 1 }
                                <Switch checked={formData.status === 1} onChange={(flag) => setFormData(preState => ({...preState, status: flag?1:2}))}/>
                            </Form.Item>

                            {/* 等级 */}
                            <Form.Item
                                label="等级"
                                name="level"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择您的等级',
                                    },
                                ]}
                            >
                                <Select placeholder="请选择等级" value={formData.level} onChange={(level) => {setFormData(preState => ({...preState, level}))}} allowClear>
                                    {
                                        formOptData.copyright_grade.map((item, index) => (
                                            <Select.Option value={item} key={index}>{item}</Select.Option>
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
