import React, {useState, useEffect } from 'react'
import { Switch, Card, Breadcrumb, Button, Table, Space, Image, Modal, Form, message, DatePicker, Input, Tag, Select, Upload, InputNumber, Tree } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { useRef } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { addRoleGroup, getAllRoleGroup,getRoleBtn, getAllRoleGroupById, updateRoleGroupById, getPlatOption, deletRoleGroupById } from '../../api/manageSub'
import routerContant from '../../utils/constant'
const {Column} = Table
export default function ManageSub() {
    // const { state: {id} } = useLocation()
    const navigate = useNavigate()
    const location = useLocation()
    const id = routerContant[location.pathname.split('/').pop()].split('-').pop()
    console.log(id);
    const [roleBtn, setRoleBtn] = useState([])
    const [loading, setLoading]  = useState(false)
    const [tableData, setTableData] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
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
        group_list: []
    })
    const handlePageChange = (current, pageSize) => {
        setPaginationPramas(preState => ({...preState, current, pageSize,}))
    }
    const [formData, setFormData] = useState({
        group_id: '',
        name: '',
        phone: '',
        pwd: '',
        status: '',
    })
    const getAllRoleGroupData = async () => {
        setLoading(true)
        const { code, resData, count } = await getAllRoleGroup()
        setTableData(resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }
    useEffect(() => {
        (async function () {
            getAllRoleGroupData()
            const { resData, msg, code } = await getRoleBtn(id)
            if(code === 401) {
                message.warning('用户未登录， 请登录后操作')
                return navigate('/login', { replace: false })
            }
            setRoleBtn(resData.btn_list)
        })();
    }, []);
   
    // 修改、添加
    const handleOk = async () => {
        if(formData.id) {
            const fileds = await formRef.current.validateFields()
            console.log("🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds", fileds, formData)
            const {code, msg} = await updateRoleGroupById(formData.id, {
                ...formData,
                name: fileds.name,
            })
            
            if(code === 200) {
                getAllRoleGroupData()
                setIsOpenModal(false)
                message.success(msg)
            }else {
                setIsOpenModal(false)
                message.warning(msg)
            }
        }else {
            const fileds = await formRef.current.validateFields(['name', 'status', 'phone'])
            console.log("🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds", fileds, formData)
            const {code, msg} = await addRoleGroup({
                ...fileds, 
                pwd: formData.pwd, 
                status: formData.status,
                group_id: formData.group_id
            })
            if(code === 400) {
                message.warning(msg)
                return
            }else {
                message.success(msg)
                getAllRoleGroupData()
                setIsOpenModal(false)
            }
        }
    }

    // 删除
    const handlerOk = async (id) => {
        try{
            const res = await deletRoleGroupById(id)
            await getAllRoleGroupData()
            message.success('删除成功')
        }catch(e) {
            message.warning('删除失败')
        }
    }

    const handlerDel = (record) => {
        Modal.confirm({
            title: `确定删除${record.name}吗?`,
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => handlerOk(record.user_id)
        });
    }

    // 点击添加按钮显示弹窗
    const handlerAdd = async () => {
        setIsOpenModal(true)
        setFormData({
            group_id: '',
            name: '',
            phone: '',
            pwd: '',
            status: '',
        })
        const {msg, resData, code} = await getPlatOption()
        if(code === 200) {
            setFormOption({
                group_list: resData.group_list
            })
        }else {
            message.warning(msg)
        }
    }
    
    // 编辑操作
    const handlerEidt =async (record) => {
        try {
            const {msg, resData, code} = await getAllRoleGroupById(record.user_id)
            console.log("🚀 ~ file: index.jsx ~ line 136 ~ handlerEidt ~ resData", resData)
            if(code === 200) {
                setFormOption({
                    group_list: resData.group_list
                })
                setFormData(resData.info) 
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
    
    return (
        <div className={styles.root}>
            <Card>
                <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/manageSub">管理人员</Breadcrumb.Item>
                </Breadcrumb>

                {
                    roleBtn.find(item => item.title === '添加') 
                        ? <Button type='primary' onClick={() => handlerAdd()}>添加</Button> : null
                }
                <Table scroll={{x: 1400,}} pagination={paginationPramas}  rowKey="id" dataSource={tableData} loading={loading} style={{marginTop: '20px'}}>
                    <Column align='center' title="id" dataIndex="user_id" key="user_id" fixed="left"/>
                    <Column align='center' title="账号" dataIndex="name" key="name" />
                    <Column align='center' title="用户组" dataIndex="group_name" key="group_name" />
                    <Column align='center' title="登录时间" dataIndex="logintime" key="logintime" />
                    <Column align='center' title="状态" dataIndex="status" key="status" render={(_, record) => (
                        <Tag color="#108ee9">{record.status===1?'正常':'异常'}</Tag>
                    )} />
                    <Column align='center' title="操作" key="operation" fixed="right" render={(_, record) => (
                        <Space size="middle">
                            {
                                record.user_id === 1 ? <Tag color="#108ee9">系统保留</Tag> : <>
                                    {
                                        roleBtn.find(item => item.title === '删除') 
                                            ? <Button type='link' onClick={() => handlerDel(record)}>删除</Button> : null
                                    }
                                    {
                                        roleBtn.find(item => item.title === '编辑') 
                                            ? <Button type='link' onClick={() => handlerEidt(record)} >编辑</Button> : null
                                    }
                                </>
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
                            }}
                                autoComplete="off"
                            >
                            <Form.Item label="角色组" name="group_id" rules={[{ required: true, message: '请选择您的角色组',}]}>
                                <Select placeholder="请选择角色组" showArrow
                                        value={formData.group_id} onChange={(item) => {setFormData(preState => ({...preState, group_id: item}))}} allowClear>
                                        {
                                            formOption.group_list.map((item, index) => (
                                                <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                            ))
                                        }
                                </Select>
                            </Form.Item>
                            <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入您的姓名',}]}>
                                <Input placeholder='请输入您的姓名'/>
                            </Form.Item>
                            <Form.Item label="账号" name="phone" rules={[{ required: true, message: '请输入您的账号',}]}>
                                <Input placeholder='请输入您的账号'/>
                            </Form.Item>
                            <Form.Item label="密码">
                                <Input placeholder='不修改密码留空' onChange={(e) => setFormData(preState => ({...preState, pwd: e.target.value}))}/>
                            </Form.Item>
                            <Form.Item label="状态" name="status" rules={[{ required: true, message: '请输入您的状态',}]}>
                                <Switch checked={formData.status === 1} onChange={(e) => setFormData(preState => ({...preState, status: e? 1: 2}))}/>
                            </Form.Item>
                        </Form>
                    </Modal>: null
                }  
            </Card>
        </div>
       
    )
}
