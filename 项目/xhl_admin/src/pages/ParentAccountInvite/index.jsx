import React, { useEffect, useState } from 'react'
import { Card, Breadcrumb, Table, Image, Modal, Button, message, Tag } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import styles from './index.module.scss'
import { getRoleBtn } from '../../api/role'
import { addInvitationList, getInvitationList } from '../../api/parentAccountInvite'
import routerContant from '../../utils/constant';
const {Column} = Table
export default function ParentAccountInvite() {
    // const { state: {id} } = useLocation()
    const location = useLocation()
    const id = routerContant[location.pathname.split('/').pop()].split('-').pop()
    const navigate = useNavigate()
    const handlePageChange = (current, pageSize) => {
        setPaginationPramas(preState => ({...preState, current, pageSize,}))
    }
    const [paginationPramas, setPaginationPramas] = useState({
        current: 1, //当前页码
        pageSize: 2, // 每页数据条数
        total: '', // 总条数
        onChange: (current, size) => handlePageChange(current, size), //改变页码的函数
        hideOnSinglePage: false,
        showSizeChanger: true,
    })
    const [loading, setLoading]  = useState(false)
    const [tableData, setTableData] = useState([])
    const [roleBtn, setRoleBtn] = useState([])
    const getParentAccountInvite = async () => {
        setLoading(true)
        const { code, resData, count } = await getInvitationList()
        setTableData(resData)
        console.log("🚀 ~ file: index.jsx ~ line 35 ~ getParentAccountInvite ~ resData", resData)
        setPaginationPramas(preState => ({...preState, total: count}))
        setLoading(false)
    }

    useEffect(() => {
        (async function () {
            getParentAccountInvite()
            const { code, resData, count, msg } = await getRoleBtn(id)
            if(code === 200) {
                setRoleBtn(resData.btn_list)
            }else if(code === 401) {
                message.warning(msg)
                navigate('/login', {replace: false,state:{ id: id}})
            }
        })();
    }, []);

    const roleAdd = () => {
        Modal.confirm({
            title: '确认生成子账号吗?',
            icon: <ExclamationCircleOutlined />,
            content: '该操作不可逆',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                addInvitationList().then(res => {
                    if(res.code !== 200) {
                        return message.warning(res.msg)
                    }else {
                        message.success(res.msg)
                        getParentAccountInvite()
                    }
                }).catch(error => {
                    message.warning(error.message)
                })
            }
        });
    }

    return (
        <div className={styles.root}>
            <Card>
                <Breadcrumb separator=">" routes style={{marginBottom: '20px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/parentAccountCheck">母账号</Breadcrumb.Item>
                </Breadcrumb>

                {
                    roleBtn.find(item => item.title === '添加') 
                        ? <Button type='primary' onClick={roleAdd}>添加</Button> : null
                }
                <Table scroll={{x: 1400,}} pagination={paginationPramas} rowKey="id" dataSource={tableData} loading={loading} style={{marginTop: '20px'}}>
                    <Column align='center' title="id" dataIndex="id" key="id" fixed="left"/>
                    <Column align='center' title="母账号id" dataIndex="subcontractor_id" key="avatar"  fixed="left" render={(_, record) => (
                        <Tag color="#2db7f5">{record.subcontractor_id?record.subcontractor_id: '初始创建为空'}</Tag>
                    )}/>
                    <Column align='center' title="邀请码" dataIndex="code" key="name" />        
                    {/* <Column align='center' title="操作" key="operation" fixed="right" render={(_, record) => (
                        <Space size="middle">
                            {
                                roleBtn.find(item => item.title === '审核') 
                                    ? <Button type='link' onClick={() => handlerCheck(record)} >审核</Button> : null
                            }
                        </Space>
                    )}/> */}
                </Table>
            </Card>


        </div>
    )
}
