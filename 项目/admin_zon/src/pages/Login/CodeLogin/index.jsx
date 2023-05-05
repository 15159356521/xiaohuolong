import React, { useState, useNavigate, useRef, useEffect } from 'react'
import classnames from 'classnames'
import { Button, Checkbox, Form, Input, message, Row } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import OhterLoign from '../../../components/OtherLogin'
import styles from './index.module.scss'


export default function CodeLogin(props) {
    const [autoLogin, setAutoLogin] = useState(true)
    const codeForm = useRef(null)
    
    // 发送验证码的state
    const [ssmLoading, setSsmLoading] = useState(false)
    const [sendText, setSendText] = useState('发送验证码')
    const btnRef = useRef(null)

    // 登录
    const onFinish = (values) => {
        // 没有发送验证码
        if(!ssmLoading) {
            return message.warning('请获取验证码')
        }

        const { codeLogin } = props
        console.log(codeForm.current)
        codeForm.current.validateFields();
        console.log('Success:', values);
        codeLogin(values)
    };


    // 发送验证码
    const sendCode = async () => {
        // 清除上一次遍历器
        clearInterval(btnRef.current.active)
        const fileds = await codeForm.current.validateFields(['phone'])
        setSendText('5s')

        setSsmLoading(true)

        btnRef.current.active = setInterval(() => {
            setSendText(preState => {
                preState = parseInt(preState)
                if(preState <= 1) {
                    setSsmLoading(false)
                    clearInterval(btnRef.current.active)
                    return '发送验证码'
                }
                return preState - 1 + 's'
            })
        }, 1000)

    }

    return (
        <Form ref={codeForm} onFinish={onFinish} className={classnames('form', styles.root)}>
            <Form.Item
                name="phone"
                rules={[
                    {
                        required: true,
                        message: "手机号格式不正确!",
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ 
                    }
                ]}
            >
                <Input placeholder="请输入手机号！" prefix={<UserOutlined className="site-form-item-icon" />}/>
            </Form.Item>

            <Form.Item
                name="code"
                rules={[
                    {
                        required: true,
                        message: "请输入验证码！",
                    },
                   
                ]}
                >
                    <Row className="codeRow">
                        <Input className="codeInput" placeholder="请输入验证码" prefix={<LockOutlined className="site-form-item-icon"/>}/>
                        <Button className="codeBtn" onClick={sendCode} loading={ssmLoading} ref={btnRef}>{sendText}</Button>
                    </Row>
            </Form.Item>

            <Form.Item className="autoLogin">
                <Checkbox checked={autoLogin}>自动登录</Checkbox>
                <a style={{float: 'right'}}>忘记密码？</a>
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    登录
                </Button>
            </Form.Item>

            <OhterLoign />
        </Form>
    )
}
