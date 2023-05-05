import React from 'react'
import { Card, Breadcrumb, Table, Button, Switch, Space } from 'antd'
import styles from './index.module.scss'
import { dataSource } from './json/index'

export default function CopyRightManager() {
    const addManage = () => {

    }

    const openChange = () => {

    }

    const editManage = () => {

    }

    const columns = [
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '标识',
            dataIndex: 'flag',
            key: 'flag',
        },
        {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: '开启',
            dataIndex: 'open',
            key: 'open',
            render: (text, record, index) => {
                return <Switch checked={record.open} onChange={() => openChange(record.id)}/>
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => [
                <Space key="index">
                    <Button type="primary" danger onClick={() => editManage(text, record, index)}>修改</Button>
                    <Button  type="primary">查看详情</Button>
                </Space>
            ]
        }
    ];

    return (
        <div className={styles.root}>
            <Card className='card'>
                <Breadcrumb separator=">" routes>
                    <Breadcrumb.Item>财务管理</Breadcrumb.Item>
                    <Breadcrumb.Item href="/copyRightManager">平台结算列表</Breadcrumb.Item>
                </Breadcrumb>

                <Button type='primary' style={{margin: '10px 0'}} onClick={addManage}>版权新增</Button>

                <Table dataSource={dataSource} columns={columns} />
            </Card>
        </div>
    )
}

