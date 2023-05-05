import { Layout, Drawer } from 'antd';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'

import styles from './index.module.scss'
import Aside from './Aside'
import Haeder from './Header'

const { Sider, Content } = Layout;

const LayoutComponent = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('left');

    const openDialog = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onChange = (e) => {
        setPlacement(e.target.value);
    };

    return (
        <Layout className={styles.root}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Drawer
                    placement={placement}
                    closable={false}
                    onClose={onClose}
                    open={open}
                    key={placement}
                    width="177px"
                    id="drawerWrapper"
                    contentWrapperStyle={{padding: 0}}
                >
                    <Aside style={{ height: '94vh',position: 'fixed',maxWidth: '176px',zIndex: '1000', top: '0px', left:'0px',overflow:'auto'}}></Aside>
               </Drawer>

                <Aside style={{ height: '94vh',position: 'fixed',maxWidth: '200px',top:'70px',zIndex: '1000',overflow:'auto'}}></Aside>
            </Sider>

            <Layout className="site-layout">
                <Haeder openDialog={openDialog}></Haeder>
                <Content
                    className="site-layout-background contentWrapper"
                    style={{
                        margin: '70px 16px',
                        paddingLeft: 204,
                        minHeight: 280,
                        backgroundColor: '#f0f2f5',
                        height: '100vh',
                        color: '#000'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutComponent;