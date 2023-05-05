import React from 'react'
import { Card, Breadcrumb, Button ,Table } from 'antd'

export default function PlactManager() {
    const dataSource = []
    const columns = []

    return (
        <div className={styles.root}>
            <Card className='card'>
                <Breadcrumb separator=">" routes>
                    <Breadcrumb.Item>财务管理</Breadcrumb.Item>
                    <Breadcrumb.Item href="/copyRightManager">平台结算列表</Breadcrumb.Item>
                </Breadcrumb>

                <Button type='primary' style={{margin: '10px 0'}}>平台新增</Button>

                <Table dataSource={dataSource} columns={columns} />
            </Card>
        </div>
    )
}
