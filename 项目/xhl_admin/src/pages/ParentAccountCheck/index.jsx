import React, { useCallback, useState, useEffect } from 'react'
import { Card, Breadcrumb, Button, Table, Space, Image, Modal, Form, message, DatePicker, Input, Tag, Select, Upload } from 'antd'
import { getRoleBtn } from '../../api/role'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { useRef } from 'react'
// import { baseURL } from '../../utils/request'
import ImgCrop from 'antd-img-crop';
import { getBase64 } from '../../utils/index'
import { getAllParentAccounChecktData, getParentAccountCheckById, updateParentAccountById } from '../../api/parentAccountCheck'
import { baseIMgURL } from '../../utils/request'
import routerContant from '../../utils/constant'
const {Column} = Table

export default function ParentAccountCheck() {
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
        subcontractor_status: []
    })
    const handlePageChange = (current, pageSize) => {
        setPaginationPramas(preState => ({...preState, current, pageSize,}))
    }
    const [formData, setFormData] = useState({
        add_package: '',
        avatar: '',
        business_license: '',
        card_id: '',
        corporate_name: '',
        credit_score: '',
        direction: '',
        level: '',
        name : '',
        names: '',
        nickname: '',
        often: '',
        phone: '',
        status: '',
        type: '',
    })
    const getParentAccountCheck= async () => {
        setLoading(true)
        const { code, resData, count } = await getAllParentAccounChecktData()
        setTableData(resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }
    useEffect(() => {
        (async function () {
            getParentAccountCheck()
            const { code, resData, count, msg } = await getRoleBtn(id)
            if(code === 200) {
                setRoleBtn(resData.btn_list)
            }else if(code === 401) {
                message.warning(msg)
                navigate('/login', {replace: false,state:{ id: id}})
            }
        })();
    }, []);

    const changePic = (errorInfo) => {
        return !formData.avatar ? Promise.reject('请选择一张图片'): Promise.resolve()
    }

    // 审查
    const handlerCheck = async (record) => {
        try {
            const {msg, resData, code} = await getParentAccountCheckById(record.id)
            if(code === 200) {
                setFormOption(resData)
                setFormData(resData.info) 
                const filesList = []
                filesList.push({
                    name: resData.info.avatar.split('/')[resData.info.avatar.split('/').length - 1],
                    url: `${resData.info.avatar}`
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

    const handleOk = useCallback(async () => {
        const fileds = await formRef.current.validateFields(['status'])
        const {code, msg} = await updateParentAccountById(formData.id, {...formData, status: fileds.status})
        if(code === 200) {
            message.success(msg)
            getParentAccountCheck()
            setIsOpenModal(false)
        }else {
            message.warning(msg)
        }
    }, [formData.id])
    
    // 弹窗取消逻辑
    const handleCancel = () => {
        setIsOpenModal(false)
    }

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
    
    return (
        <div className={styles.root}>
            <Card>
                <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/parentAccountCheck">母账号审核</Breadcrumb.Item>
                </Breadcrumb>

                <Table scroll={{x: 1400,}} pagination={paginationPramas} rowKey="id" dataSource={tableData} loading={loading} style={{marginTop: '20px'}}>
                    <Column align='center' title="id" dataIndex="id" key="id" fixed="left"/>
                    <Column title="头像" dataIndex="avatar" key="avatar"  fixed="left" render={(_, record) => (
                        <Image
                            preview={{
                                imgVisible: false,
                            }}
                            src={ baseIMgURL + record.avatar}
                        />
                    )}/>
                    <Column align='center' title="名称" dataIndex="name" key="name" />        
                    <Column align='center' title="手机号" dataIndex="phone" key="phone" />
                    <Column align='center' title="级别" dataIndex="level" key="level"/>
                    <Column align='center' title="信用分" dataIndex="credit_score" key="credit_score"/>
                    <Column align='center' title="未审核" dataIndex="status_text" key="status_text" />        
                    <Column align='center' title="操作" key="operation" fixed="right" render={(_, record) => (
                        <Space size="middle">
                            {
                                roleBtn.find(item => item.title === '审核') 
                                    ? <Button type='link' onClick={() => handlerCheck(record)} >审核</Button> : null
                            }
                        </Space>
                    )}/>
                </Table>

                {
                    isOpenModal ? 
                    <Modal width={1200} title='新增数据' open={isOpenModal} onOk={handleOk} onCancel={handleCancel} okText="确定" cancelText="取消">
                        <Form ref={formRef} labelCol={{span: 5,}} wrapperCol={{span: 16,}} 
                            initialValues={{...formData, }} autoComplete="off">
                                <Form.Item  label="名称" name="name" rules={[{ required: true, message: '请输入您的名称',}]}>
                                    <Input disabled placeholder='请输入您的名称'/>
                                </Form.Item>

                                <Form.Item label="手机" name="phone" rules={[{ required: true, message: '请输入您的手机',}]}>
                                    <Input disabled placeholder='请输入您的手机'/>
                                </Form.Item>

                                <Form.Item label="级别" name="level" rules={[{ required: true, message: '请输入您的级别',}]}>
                                    <Input disabled placeholder='请输入您的级别'/>
                                </Form.Item>

                                <Form.Item label="身份证号" name="card_id" rules={[{ required: true, message: '请输入您的身份证号',}]}>
                                    <Input disabled placeholder='请输入您的身份证号'/>
                                </Form.Item>

                                <Form.Item label="营业执照" name="business_license" rules={[{ required: true, message: '请输入您的营业执照',}]}>
                                    <Input disabled placeholder='请输入您的营业执照'/>
                                </Form.Item>

                                <Form.Item label="上传头像" name="avatar" rules={[{ validator: changePic}]}>
                                    <ImgCrop rotate>
                                        <Upload disabled beforeUpload={beforeUpload} action={'/admin/common.upload/uploadImage'}
                                            listType="picture-card" fileList={fileList} onChange={onUpdataChange}
                                            onPreview={onUpdataPreview}
                                        >
                                            {(fileList.length < 1 ) && '+ Upload'}
                                        </Upload>
                                    </ImgCrop>
                                </Form.Item>

                                <Form.Item label="视频方向" name="direction" rules={[{ required: true, message: '请输入您的视频方向',}]}>
                                    <Input disabled placeholder='请输入您的视频方向'/>
                                </Form.Item>

                                <Form.Item label="视频长度" name="often" rules={[{ required: true, message: '请输入您的视频长度',}]}>
                                    <Input disabled placeholder='请输入您的视频长度'/>
                                </Form.Item>

                                <Form.Item label="主体类型" name="type" rules={[{ required: true, message: '请输入您的主体类型',}]}>
                                    <Input disabled placeholder='请输入您的主体类型'/>
                                </Form.Item>

                                <Form.Item label="真实姓名" name="names" rules={[{ required: true, message: '请输入您的真实姓名',}]}>
                                    <Input disabled placeholder='请输入您的真实姓名'/>
                                </Form.Item>

                                <Form.Item label="个人简介" name="introduction" rules={[{ required: true, message: '请输入您的个人简介',}]}>
                                    <Input disabled placeholder='请输入您的个人简介'/>
                                </Form.Item>
                                
                                <Form.Item label="状态" name="status" rules={[{ required: true, message: '请输入您的状态',}]}>
                                    <Select placeholder="请选择您的状态" onChange={(id) => {setFormData(preState => ({...preState, status: id}))}} allowClear>
                                        {
                                            formOption.subcontractor_status && formOption.subcontractor_status.map((item, index) => (
                                                <Select.Option value={index} key={index}>{item}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                        </Form>
                    </Modal>: null
                }  
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
