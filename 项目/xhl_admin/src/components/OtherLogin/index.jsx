import React from 'react'
import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';

import styles from './index.module.scss'

export default function OhterLoign() {
  return (
    <div className={styles.root}>
        其他登录方式: <AlipayCircleOutlined className='icon'/><TaobaoCircleOutlined className='icon'/><WeiboCircleOutlined className='icon'/>
    </div>
  )
}
