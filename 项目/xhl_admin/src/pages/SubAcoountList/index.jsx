import React, { useCallback, useState, useEffect } from 'react'
import { Card, Breadcrumb, Button, Table, Space, Image, Modal, Form, message, DatePicker, Input, Tag, Select, Upload } from 'antd'
import { getRoleBtn } from '../../api/role'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { useRef } from 'react'
import { baseURL } from '../../utils/request'
import { getBase64 } from '../../utils/index'
import { getAllSubAccounListData, getSubAccountListById, updateSubAccountListById } from '../../api/subAcoountList'
import routerContant from '../../utils/constant'
const {Column} = Table

export default function SubAcoountList() {
    // const { state: {id} } = useLocation()
    const location = useLocation()
    const id = routerContant[location.pathname.split('/').pop()].split('-').pop()
    const [roleBtn, setRoleBtn] = useState([])
    const [loading, setLoading]  = useState(false)
    const [tableData, setTableData] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
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
        subcontractor_sub_grade: [],
        subcontractor_sub_impose: [],
        status_ary: [],
    })
    const handlePageChange = (current, pageSize) => {
        setPaginationPramas(preState => ({...preState, current, pageSize,}))
    }
    const [formData, setFormData] = useState({
        business_license: '',
        card_id: '',
        grade: '',
        level: '',
        name: '',
        nickname: '',
        phone: '',
        status: '',
        type: '',
    })
    const getAllSubAccountData = async () => {
        setLoading(true)
        const { code, resData, count } = await getAllSubAccounListData()
        setTableData(resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }
    useEffect(() => {
        (async function () {
            getAllSubAccountData()
            const { code, resData, count, msg } = await getRoleBtn(id)
            if(code === 200) {
                setRoleBtn(resData.btn_list)
            }else if(code === 401) {
                console.log('adbc')
                message.warning(msg)
                navigate('/login', {replace: false,state:{ id: id}})
            }
        })();
    }, []);
   
    // 修改、添加
    const handleOk = async () => {
        if(formData.id) {
            const fileds = await formRef.current.validateFields()
            const {code, msg} = await updateSubAccountListById(formData.id, fileds)
            if(code === 200) {
                getAllSubAccountData()
                message.success(msg)
                setIsOpenModal(false)
            }else {
                message.warning(msg)
                setIsOpenModal(false)
            }
        }
    }

    const handlerAdd = () => {

    }

    const handlerDel = () => {

    }
    
    // 编辑操作
    const handlerCheck =async (record) => {
        try {
            const {msg, resData, code} = await getSubAccountListById(record.id)
            if(code === 200) {
                setFormOption(resData)
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
                    <Breadcrumb.Item href="#/subAccountCheck">子账号审核</Breadcrumb.Item>
                </Breadcrumb>

                {
                    roleBtn.find(item => item.title === '添加') 
                        ? <Button type='primary' onClick={() => handlerAdd()}>添加</Button> : null
                }
                <Table scroll={{x: 1400,}} pagination={paginationPramas} rowKey="id" dataSource={tableData} loading={loading} style={{marginTop: '20px'}}>
                    <Column align='center' title="母公司账号" dataIndex="id" key="id" fixed="left" render={(_, record) => (
                        record.subcontractor.name
                    )}/>
                    <Column align='center' title="名称" dataIndex="name" key="name" fixed="left"/>
                    <Column align='center' title="手机号" dataIndex="phone" key="phone" />
                    <Column align='center' title="级别" dataIndex="level" key="level" />
                    <Column align='center' title="身份证号" dataIndex="card_id" key="card_id" />
                    <Column align='center' title="营业执照" dataIndex="business_license" key="business_license" />
                    <Column align='center' title="昵称" dataIndex="nickname" key="nickname" />
                    <Column align='center' title="等级" dataIndex="grade" key="grade" />
                    <Column align='center' title="状态" dataIndex="status_text" key="gstatus_textrade" />
                    <Column align='center' title="操作" key="operation" fixed="right" render={(_, record) => (
                        <Space size="middle">
                            {
                                roleBtn.find(item => item.title === '删除') 
                                    ? <Button type='link' onClick={() => handlerDel(record)}>删除</Button> : null
                            }
                            {
                                roleBtn.find(item => item.title === '编辑') 
                                    ? <Button type='link' onClick={() => handlerCheck(record)} >编辑</Button> : null
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

                            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入您的名称',}]}>
                                <Input placeholder='请输入您的名称'/>
                            </Form.Item>
                            <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入您的手机',}]}>
                                <Input placeholder='请输入您的手机'/>
                            </Form.Item>
                            <Form.Item label="级别" name="level" rules={[{ required: true, message: '请选择您的级别',}]}>
                            <Select placeholder="请选择您的级别"  onChange={(item) => {setFormData(preState => ({...preState, level: item}))}} allowClear>
                                    {
                                        formOption.subcontractor_sub_impose.map((item, index) => <Select.Option value={item} key={index}>
                                            {item}
                                        </Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="身份证号" name="card_id" rules={[{ required: true, message: '请输入您的身份证号',}]}>
                                <Input placeholder='请输入您的身份证号'/>
                            </Form.Item>
                            <Form.Item label="营业执照" name="business_license" rules={[{ required: true, message: '请输入您的营业执照',}]}>
                                <Input placeholder='请输入您的营业执照'/>
                            </Form.Item>
                            <Form.Item label="主体类型" name="type" rules={[{ required: true, message: '请输入您的主体类型',}]}>
                                <Input placeholder='请输入您的主体类型'/>
                            </Form.Item>
                            <Form.Item label="真实姓名" name="nickname" rules={[{ required: true, message: '请输入您的真实姓名',}]}>
                                <Input placeholder='请输入您的真实姓名'/>
                            </Form.Item>

                            <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择您的状态',}]}>
                                <Select placeholder="请选择您的状态"  onChange={(item) => {setFormData(preState => ({...preState, status: item}))}} allowClear>
                                    {
                                        formOption.status_ary.map((item, index) => <Select.Option value={index} key={index}>
                                            {item}
                                        </Select.Option>)
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item label="等级" name="grade" rules={[{ required: true, message: '请选择您的等级',}]}>
                                <Select placeholder="请选择您的等级"  onChange={(item) => {setFormData(preState => ({...preState, grade: item}))}} allowClear>
                                    {
                                        // console.log(formData.status && typeof formData.status)
                                        formOption.subcontractor_sub_grade.map((item, index) => <Select.Option value={item} key={index}>
                                            {item}
                                        </Select.Option>)
                                    }
                                </Select>
                            </Form.Item>

                            
                        </Form>
                    </Modal>: null
                }  
            </Card>
        </div>
       
    )
}
