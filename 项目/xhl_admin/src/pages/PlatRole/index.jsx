import Card from "antd/lib/card/Card";
import React from "react";
import styles from "./index.module.scss";
import { getPlatRoleList, getPlatRoleById, updateRole, addRole, delRoleById, getOptions, searchRole } from "../../api/platRole";
import { useState } from "react";
import { useEffect } from "react";
import { Table, Breadcrumb, Space, Button, Modal, Form, Input, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoleBtn } from '../../api/role'
import { useRef } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import routerContant from "../../utils/constant";
const { Column } = Table

export default function PlatRole() {
    // const { state: {id} } = useLocation()
    const location = useLocation()
    const id = routerContant[location.pathname.split('/').pop()].split('-').pop()
    const [platRole, setPlatRole] = useState([]);
    const [ loading, setLoding ] = useState(false)
    const [ roleBtn, setRoleBtn ] = useState([])
    const navigate = useNavigate()
    // 获取table原始数据
    const getPlatRole = async () => {
        setLoding(true)
        const {resData} = await getPlatRoleList();
        setPlatRole(resData);
        setLoding(false)
    }
    const [paginationPramas, setPaginationPramas] = useState({
        current: 1, //当前页码
        pageSize: 2, // 每页数据条数
        total: '', // 总条数
        onChange: (current, size) => handlePageChange(current, size), //改变页码的函数
        hideOnSinglePage: false,
        showSizeChanger: true,
    })

    const handlePageChange = (current, pageSize) => {
        setPaginationPramas(preState => ({...preState, current, pageSize,}))
    }

    const [searchOpt, setSearchOpt] = useState([])
    const getOptionsFn = async () => {
        const res = await getOptions()
        console.log("🚀 ~ file: index.jsx ~ line 77 ~ getOptionsFn ~ res", res)
        setSearchOpt(res.resData)
    }

    // 获取初始值
    useEffect(() => {
        (async function () {
            getPlatRole()
            getOptionsFn()
            const { code, resData, count, msg } = await getRoleBtn(id)
            if(code === 200) {
                setRoleBtn(resData.btn_list)
                setPaginationPramas(preState => ({...preState, total: resData.total}))
            }else if(code === 401) {
                message.warning(msg)
                navigate('/login', {replace: false,state:{ id: id}})
            }
        })();
    }, []);


    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const formRef = useRef()
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        phone: ''
    })
    const handlerEidt = async (record) => {
        const {resData} = await getPlatRoleById(record.id)
        setFormData(resData.info)
        setIsModalOpen(true)
    }

    const handlerAdd = () => {
        setFormData({
            company: '',
            name: '',
            phone: ''
        })

        setIsModalOpen(true)
    }

    // 修改，添加
    const handleOk = async () => {
        if(formData.id) {
            const fileds = await formRef.current.validateFields()
            await updateRole(formData.id, fileds)
            getPlatRole()
            message.success('修改成功')
            setIsModalOpen(false)
        }else {
            const fileds = await formRef.current.validateFields()
            await addRole(fileds)
            message.success('添加成功')
            getPlatRole()
            setIsModalOpen(false)
        }
       
    }

    // 确认删除
    const handlerOk = async (id) => {
        await delRoleById(id)
        message.success('删除成功')
        getPlatRole()
    }

    // 删除弹窗
    const handlerDel = (record) => {
        Modal.confirm({
            title: `确定删除${record.name}吗?`,
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => handlerOk(record.id)
        });
        
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    // 搜索功能
    const [form] = Form.useForm();
    const onReset = async () => {
        form.resetFields();
        const {code, msg, resData} = await searchRole({
            name: '',
            company: '',
        })
        if(code === 200) {
            message.success('重置成功')
            setPlatRole(resData)
        }else {
            message.warning(msg)
            return
        }
    };
    const [params, setParams] = useState({

    })
    const onFinish = async (value) => {
        setParams(value)
        const {code, msg, resData} = await searchRole(value)
        if(code === 200) {
            message.success('查询成功')
            setPlatRole(resData)
            setPaginationPramas(preState => ({...preState, total: resData.total}))
        }else {
            message.warning(msg)
            return
        }
    }

    const [searchParams, setSearchParams] = useState({
        key: '',
    })

    useEffect(() => {
        console.log('useEffect')
        let timer = setTimeout(() => {
            searchByParams(searchParams)
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, [searchParams.value])

    const searchByParams = async (searchParams) => {
        console.log("🚀 ~ file: index.jsx ~ line 177 ~ searchByParams ~ searchParams", searchParams)
        try {
            if(searchParams.key.trim()) {
                console.log('a')
                const {code, msg, resData} = await searchRole({
                    ...params,
                    [searchParams.key]: searchParams.value
                })
                if(code === 200) {
                    message.success('查询成功')
                    setPlatRole(resData)
                    setPaginationPramas(preState => ({...preState, total: resData.total}))
                }else {
                    message.warning(msg)
                    return
                }
            }
        } catch (error) {
            message.warning(error.message)            
        }
    }

    const selectChange = async (key, e) => {
        const value = e.nativeEvent.target.value
        console.log("🚀 ~ file: index.jsx ~ line 196 ~ selectChange ~ value", value)
        setSearchParams({
            [key]: value
        })
    }

    return (
        <Card className={styles.root}>
            <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                <Breadcrumb.Item>首页</Breadcrumb.Item>
                <Breadcrumb.Item href="#/platRole">版权归属平台</Breadcrumb.Item>
            </Breadcrumb>

            <Card>
                <Form layout="inline" onFinish={onFinish} form={form}>
                    <Form.Item label="公司" name="company">
                        <Input placeholder="请输入搜索名称" prefix={<SearchOutlined />} allowClear
                            onChange={(e) => selectChange('company', e)}/>
                    </Form.Item>
                    <Form.Item label="姓名" name="name">
                        <Input placeholder='请输入' allowClear/>
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

            <Table pagination={paginationPramas} rowKey="id" dataSource={platRole} loading={loading} style={{marginTop: '20px'}}>
                <Column title="公司" dataIndex="company" key="company" />
                <Column title="姓名" dataIndex="name" key="name" />
                <Column title="电话" dataIndex="phone" key="phone" />
                <Column title="操作" key="operation" render={(_, record) => (
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
                isModalOpen ? <Modal width={800} title='新增数据' open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确定" cancelText="取消">
                    <Form
                        ref={formRef}
                        labelCol={{
                            span: 5,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        autoComplete="off"
                        initialValues={{...formData}}
                    >
                        <Form.Item
                            label="姓名"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的姓名',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="公司"
                            name="company"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入公司',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="电话"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "手机号格式不正确!",
                                    pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ 
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                    </Form>
                </Modal>: null
            }  
            </Card>
            
        </Card>
    );
}
