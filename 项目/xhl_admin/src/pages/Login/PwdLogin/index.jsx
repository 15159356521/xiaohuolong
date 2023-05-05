import React, { useRef, useState } from 'react'
import { Button, Checkbox, Form, Input } from "antd";
import classnames from 'classnames'
import { UserOutlined, LockOutlined } from '@ant-design/icons';


import styles from './index.module.scss'
import OhterLoign from '../../../components/OtherLogin'
import { useNavigate } from 'react-router-dom';

export default function PwdLogin(props) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [autoLogin, setAutoLogin] = useState(true)

    const pwdForm = useRef()

    const onFinish = (values) => {
        const { pwdLogin } = props
        pwdForm.current.validateFields()
        pwdLogin(values)
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const autoLoginFn = () => {
        
    }

    return (
        <Form ref={pwdForm} className={classnames('form', styles.root)}  onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Form.Item
                name="phone"
                rules={[
                    {
                        required: true,
                        message: "手机号不能为空!",
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        message: "手机号格式不正确!",
                        pattern: /^\d{11}$/,
                        // pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ ,
                        trigger: 'blur'
                    }

                ]}
            >
                <Input placeholder="请输入手机号" prefix={<UserOutlined className="site-form-item-icon" />}/>
            </Form.Item>

            <Form.Item
                name="pwd"
                rules={[
                    {
                        required: true,
                        message: "密码长度不符合要求",
                        min: 6
                    },
                ]}
                >
                <Input.Password placeholder="请输入密码" prefix={<LockOutlined className="site-form-item-icon"/>}/>
            </Form.Item>

            <Form.Item className="autoLogin">
                <Checkbox checked={autoLogin} onChange={autoLoginFn}>自动登录</Checkbox>
                <a style={{float: 'right'}}>忘记密码？</a>
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit" loading={loading}>
                    登录
                </Button>
            </Form.Item>

            {/* <OhterLoign /> */}
        </Form>
    )
}
