import React, {useState, useEffect } from 'react'
import { Switch, Card, Breadcrumb, Button, Table, Space, Image, Modal, Form, message, DatePicker, Input, Tag, Select, Upload, InputNumber, Tree } from 'antd'
import { addRole, deletRoleById, getAllRole, getPlatOption, getRoleBtn, getRoleById, updateRoleById } from '../../api/role'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { useRef } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { mapTree } from '../../utils/index'
import routerContant from '../../utils/constant'

const {Column} = Table
// 新闻列表
export default function RoleGroup() {
    // const { state: {id} } = useLocation()
    const location = useLocation()
    const navigator = useNavigate()
    const id = routerContant[location.pathname.split('/').pop()].split('-').pop()
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
        rule_list: []
    })
    const handlePageChange = (current, pageSize) => {
        setPaginationPramas(preState => ({...preState, current, pageSize,}))
    }
    const [formData, setFormData] = useState({
        name: '',
        rules: '',
        status: '',
    })
    const getNewListData = async () => {
        setLoading(true)
        const { code, resData, count } = await getAllRole()
        setTableData(resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }
    useEffect(() => {
        (async function () {
            getNewListData()
            const { code, resData, count } = await getRoleBtn(id)
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
            console.log("🚀 ~ file: index.jsx ~ line 68 ~ handleOk ~ fileds", fileds, formData)
            const {code, msg} = await updateRoleById(formData.id, {
                ...fileds,
                status: formData.state,
                rules: formData.rules
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
            const fileds = await formRef.current.validateFields(['name', 'status'])
            console.log("🚀 ~ file: index.jsx ~ line 95 ~ handleOk ~ fileds", fileds, formData)
            const {code, msg} = await addRole({
                ...fileds, 
                rules: formData.rules, 
                status: formData.status,
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

    // 删除
    const handlerOk = async (id) => {
        try{
            const res = await deletRoleById(id)
            await getNewListData()
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
            onOk: () => handlerOk(record.id)
        });
    }

    // 点击添加按钮显示弹窗
    const handlerAdd = async () => {
        setIsOpenModal(true)
        setFormData({
            name: '',
            rules: '',
            status: '',
        })
        const {msg, resData, code} = await getPlatOption()
        if(code === 200) {
            const new_list = resData.rule_list.map(org => mapTree(org))

            setFormOption({
                rule_list: new_list
            })
        }else {
            message.warning(msg)
        }
    }
    
    // 编辑操作
    const handlerEidt =async (record) => {
        try {
            const {msg, resData, code} = await getRoleById(record.id)
            if(code === 200) {
                const new_list = resData.rule_list.map(org => mapTree(org))
                console.log(new_list,'sdfsdf');
               console.log(resData.rule_list,'sdfdsfsdfsdf');
                setFormOption({
                    rule_list: new_list
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

    const onSelect = (selectedKeys, info) => {
        setFormData(preState => ({
            ...preState,
            rules: selectedKeys
        }))
    }
    
    const onCheck = (checkedKeys, info) => {
        setFormData(preState => ({
            ...preState,
            rules: checkedKeys
        }))
    }
    
    return (
        <div className={styles.root}>
            <Card>
                <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/newList">新闻列表</Breadcrumb.Item>
                </Breadcrumb>

                {
                    roleBtn.find(item => item.title === '添加') 
                        ? <Button type='primary' onClick={() => handlerAdd()}>添加</Button> : null
                }
                <Table scroll={{x: 1400,}} pagination={paginationPramas} rowKey="id" dataSource={tableData} loading={loading} style={{marginTop: '20px'}}>
                    <Column align='center' title="id" dataIndex="id" key="id" fixed="left"/>
                    <Column align='center' title="名称" dataIndex="name" key="name" />
                    <Column align='center' title="添加时间" dataIndex="createtime" key="createtime" />
                    <Column align='center' title="用户人数" dataIndex="people_num" key="people_num" />
                    <Column align='center' title="状态" dataIndex="status" key="status" render={(_, record) => (
                        <Tag color="#108ee9">{record.status}</Tag>
                    )} />
                    <Column align='center' title="操作" key="operation" fixed="right" render={(_, record) => (
                        <Space size="middle">
                        {
                            record.id === 1 ? <Tag color="#108ee9">系统保留</Tag> : <>
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
                            <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入您的姓名',}]}>
                                <Input placeholder='请输入您的姓名'/>
                            </Form.Item>
                            <Form.Item label="状态" name="status" rules={[{ required: true, message: '请输入您的状态',}]}>
                                <Switch checked={formData.status === '1'} onChange={(e) => setFormData(preState => ({...preState, status: e? '1': '2'}))}/>
                            </Form.Item>
                            <Form.Item label="菜单">
                                <Tree onCheck={onCheck} onSelect={onSelect} defaultExpandAll checkable checkedKeys={formData.rules} selectedKeys={formData.rules} treeData={formOption.rule_list}/>
                            </Form.Item>
                        </Form>
                    </Modal>: null
                }  
            </Card>
        </div>
       
    )
}
