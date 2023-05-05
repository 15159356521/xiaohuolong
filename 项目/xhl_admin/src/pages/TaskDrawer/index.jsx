import React, {useEffect, useState} from 'react'
import { Card, Breadcrumb, Button, Table, Space, Modal, Form, message, DatePicker, Input } from 'antd'
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import styles from './index.module.scss'
import { getRoleBtn } from '../../api/role'
import { addTask, deleteTaskById, getAllTaskDrawerData, getTaskDrawerById, updateTaskById } from '../../api/taskDrawer'
import { useLocation } from 'react-router-dom'
import { useRef } from 'react'
import MyEditor from '../../components/Editor';
import routerContant from '../../utils/constant';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const { Column } = Table
const { RangePicker } = DatePicker;
export default function TaskDrawer() {
    // const { state: {id} } = useLocation()
    const location = useLocation()
    const id = routerContant[location.pathname.split('/').pop()].split('-').pop()
    const [roleBtn, setRoleBtn] = useState([])
    const [loading, setLoading] = useState(false)
    const [roleTableData, setRoleTableData] = useState([])
    const formRef = useRef(null)
    const [formData, setFormData] = useState({
        content: '',
        end_time: '',
        rank: '',
        start_time: '',
        title: '',
    })
    // 分页操作
    const [paginationPramas, setPaginationPramas] = useState({
        current: 1, //当前页码
        pageSize: 2, // 每页数据条数
        total: '', // 总条数
        onChange: (current, size) => handlePageChange(current, size), //改变页码的函数
        hideOnSinglePage: false,
        showSizeChanger: true,
    })
    const [isOpenModal, setIsOpenModal] = useState(false)
    useEffect(() => {
        (async function () {
            getTaskDrawerData()
            const { resData, msg, code } = await getRoleBtn(id)
            if(code === 401) {
                message.warning('用户未登录， 请登录后操作')
                return navigator('/login', { replace: false })
            }
            setRoleBtn(resData.btn_list)
        })();
    }, []);

    // 获取table数据
    const getTaskDrawerData = async () => {
        setLoading(true)
        const { code, resData, count } = await getAllTaskDrawerData()
        setRoleTableData(resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }
    const handlePageChange = (current, pageSize) => {
        setPaginationPramas(preState => ({...preState, current, pageSize,}))
    }

    // 点击添加按钮显示弹窗
    const handlerAdd = async () => {
        setFormData({
            content: '',
            end_time: '',
            rank: '',
            start_time: '',
            title: '',
        })
        formRef.current.setFieldsValue({
            content: '',
            end_time: '',
            rank: '',
            start_time: '',
            title: '',
        });
        await setIsOpenModal(true)
        
    }

    const handlerOk = async (id) => {
        try{
            const res = await deleteTaskById(id)
            await getTaskDrawerData()
            message.success('删除成功')
        }catch(e) {
            message.warning('删除失败')
        }
    }

    // 点击删除按钮显示弹窗
    const handlerDel = (record) => {
        Modal.confirm({
            title: `确定删除${record.title}吗?`,
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => handlerOk(record.id)
        });
    }
    // 点击编辑按钮显示弹窗
    const handlerEidt =async (record) => {
        try {
            const {msg, resData, code} = await getTaskDrawerById(record.id)
            if(code === 200) {
                setFormData(resData.info)
                formRef.current.setFieldsValue(resData.info);
            }else {
                message.warning(msg)
                return
            }
        } catch (error) {
            message.warning(error)
        }
        setIsOpenModal(true)
    }
    const modalCancel = () => {
        setFormData({
            content: '',
            end_time: '',
            rank: '',
            start_time: '',
            title: '',
        })
        
        setIsOpenModal(false)
    }

    const onFinish = async (values) => {
        const taskTime = values['taskTime']
        const start_time = taskTime[0].format(dateFormat)
        const end_time = taskTime[1].format(dateFormat)
        delete values.taskTime
        if(formData.id) {
            try{
                const {msg, resData, code} = await updateTaskById(formData.id, {...values, start_time, end_time, content: formData.content})
                if(code === 200) {
                    message.success(msg)
                    getTaskDrawerData()
                }
            }catch(e) {
                message.warning('数据异常, 请稍后尝试')
            }finally {
                setIsOpenModal(false)
            }
        }else {
            try {
                const {msg, resData, code} = await addTask({...values, start_time, end_time, content: formData.content})           
                if(code === 200) {
                    message.success(msg)
                    getTaskDrawerData()
                }else {
                    message.warning(msg)
                }
            } catch (error) {
                message.warning('数据异常, 请稍后尝试')
            } finally {
                setIsOpenModal(false)
            }
            
        }   

    }

    const getContent = (content) => {
        console.log('getContent', content)

        setFormData(preState => ({...preState, content: content}))
        formRef.current.setFieldValue({content: content})
    }

    return (
        <div className={styles.root}>
            <Card>
                <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/taskDrawer">任务抽屉</Breadcrumb.Item>
                </Breadcrumb>

                {
                    roleBtn.find(item => item.title === '添加') 
                        ? <Button type='primary' onClick={() => handlerAdd()}>添加</Button> : null
                }
                <Table scroll={{x: 1400,}} pagination={paginationPramas} rowKey="id"  dataSource={roleTableData} loading={loading} style={{marginTop: '20px'}}>
                    <Column align='center' title="id" dataIndex="id" key="id" fixed="left"/>
                    <Column align='center' title="名称" dataIndex="title" key="title" fixed="left"/>
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
            </Card>

            <Modal width={1200} open={isOpenModal} title={formData.title?'修改数据': '新增数据'} footer={null} onCancel={modalCancel}>
                <Form ref={formRef} labelCol={{span: 5,}} wrapperCol={{span: 16,}} onFinish={onFinish}
                    initialValues={{
                        ...formData, 
                        taskTime: formData.id? [moment(formData.start_time, dateFormat), moment(formData.end_time, dateFormat)]: null}}
                        autoComplete="off"
                    >
                    <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入您的标题',}]}>
                        <Input placeholder='请输入标题'/>
                    </Form.Item>
                    <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入您的内容',}]}>
                        <MyEditor content={formData.content} getContent={getContent}/>
                    </Form.Item>
                    <Form.Item label="授权时间" name="taskTime" messageVariables 
                        rules={[{ required: true, message: '请选择您的授权时间',type: 'array',},]}>
                                <RangePicker style={{width: '435px'}} onChange={(date, dateString) => 
                                    {setFormData(preState => ({...preState, start_time: dateString[0], end_time: dateString[1]}))}} 
                                    showTime 
                                    format={dateFormat}
                                />
                            </Form.Item>
                    <Form.Item label="排序" name="rank" rules={[{ required: true, message: '请输入您的排序',}]}>
                        <Input style={{width: '200px'}} min={0} type="number" placeholder='请填写您的数据'/>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 16, span: 16,}}>
                        <Space>
                            <Button onClick={modalCancel}>
                                取消
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {formData.id?'修改':'新增'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

