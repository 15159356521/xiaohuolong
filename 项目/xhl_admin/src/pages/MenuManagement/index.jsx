import { Breadcrumb, Form, Card, Modal, Space, Table, Switch, Button, Tag, Input, Cascader, message } from 'antd'
import React, {useEffect, useRef, useState} from 'react'
import { deletRoleGroupById, getAllRule, updateRule } from '../../api/menuManagement';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import styles from './index.module.scss'

export default function MenuManagement() {
    const columns = [
        {
            title: '菜单名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '是否是菜单',
            dataIndex: 'is_menu',
            key: 'is_menu',
            render: (text) => <Space key='space'>
                {
                    text === 1 ? <Tag color="#2db7f5">菜单</Tag>: <Tag color="#f50">按钮</Tag>
                }
            </Space>
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => <Space key='space'>
                {record.is_menu === 1 ? <Button type='link' key='add' onClick={() =>handlerAdd(record)}>添加</Button>: null}
                <Button type='link' key='edit' onClick={() =>handlerEdit(record)}>编辑</Button>
                <Button type='link' key='delete' onClick={() =>handlerDel(record)}>删除</Button>
            </Space>,
        },
    ];
    const formRef = useRef(null)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const handlerAdd = (record) => {
        setFormData({
            pid: record.pid
        })
        // setFormData({})
        setIsOpenModal(true)
    }
    
    const [formData, setFormData] = useState([])
    // 编辑按钮
    const handlerEdit = async (record) => {

        setFormData(record)

        setIsOpenModal(true)
    }

    const handlerOk = async (id) => {
        try{
            const res = await deletRoleGroupById(id)
            await getAllRuleFn()
            message.success(res.msg)
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

    useEffect(() => {
        getAllRuleFn()
    }, [])

    const [tableDate, setTableDate] = useState([])
    const getAllRuleFn = async () => {
        const res = await getAllRule()
console.log(res.resData,'sdfsdf');
        setTableDate(res.resData)
    }

    const handleOk = async () => {
        if(formData.id) {
            console.log('编辑')
            const fileds = await formRef.current.validateFields()
            console.log(fileds, formData)
            const res = await updateRule({
                ...formData,
                pid: formData.pid_ary ? formData.pid_ary.pop() : formData.pid,
                title: fileds.title,
                weigh: fileds.weigh
            })
            if(res.code === 200) {
                message.success('操作成功')
                getAllRuleFn()
                setIsOpenModal(false)
            }else {
                message.warning('操作失败')
                setIsOpenModal(false)
            }
        }else {
            console.log('新增')
            const fileds = await formRef.current.validateFields()
            console.log(fileds, formData)
            
            const res = await updateRule({
                ...formData,
                pid: formData.pid_ary ? formData.pid_ary.pop() : formData.pid,
                title: fileds.title,
                weigh: fileds.weigh
            })
      
            if(res.code === 200) {
                message.success('操作成功')
                getAllRuleFn()
                setIsOpenModal(false)
            }else {
                message.warning('操作失败')
                setIsOpenModal(false)
            }
        }
    }

    const handleCancel = () => {
        setIsOpenModal(false)
    }

    const onCascaderChange = (value) => {
        console.log("🚀 ~ file: index.jsx ~ line 88 ~ onCascaderChange ~ value", value)
        setFormData(preState => ({...preState, pid_ary: value}))
    }

    return (
        <div className={styles.root}>
            <Card className='cardO'>
                <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/menuManagement">菜单管理</Breadcrumb.Item>
                </Breadcrumb>

                <Table rowKey="key" columns={columns} dataSource={tableDate}/>

                {
                    isOpenModal ? 
                    <Modal width={1200} title={formData.id?'修改数据':'添加数据'} open={isOpenModal} onOk={handleOk} onCancel={handleCancel} okText="确定" cancelText="取消">
                        <Form ref={formRef} labelCol={{span: 5,}} wrapperCol={{span: 16,}} 
                            initialValues={{...formData}}
                                autoComplete="off"
                            >
                            <Form.Item label="上级菜单">
                                <Cascader disabled={formData.pid === 0} value={formData.pid === 0 ? '' : formData.pid_ary} changeOnSelect 
                                    options={tableDate} onChange={onCascaderChange} placeholder="请选择上级" />
                            </Form.Item>
                            <Form.Item label="标题" name="title">
                                <Input placeholder='请输入您的标题'/>
                            </Form.Item>
                            <Form.Item label="权重" name="weigh">
                                <Input placeholder='请输入您的权重'/>
                            </Form.Item>
                            <Form.Item label="是否菜单" name="is_menu">
                                <Switch checked={formData.is_menu===1} onChange={(e) => setFormData(preState => ({...preState, is_menu: e?1:0}))}/>
                            </Form.Item>
                            <Form.Item label="是否可用" name="status">
                                <Switch checked={formData.status===1} onChange={(e) => setFormData(preState => ({...preState, status: e?1:0}))}/>
                            </Form.Item>

                        </Form>
                    </Modal>: null
                }  
                
            </Card>
        </div>
    )
}
