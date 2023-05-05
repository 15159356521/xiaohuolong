import React, { useEffect } from 'react'
import { Button } from 'antd'

import styles from './index.module.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const [time, setTime] = useState(5)
    const navigate = useNavigate()
    useEffect(() => {
        const timer = setInterval(() => {
           
            console.log(time)
            
            if(time === 0) {
                console.log('afdas')
                navigate('/login', {replace: true})
            }
            setTime(preState => preState - 1)
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [time])
    return (
        <div className={styles.root}>
            <div className='warin'>404, 页面走丢了</div>
            <div className='time'><span className='title'>{time}</span>s后回到主页</div>
            <Button type='primary' onClick={() => navigate('/login', {replace: false})}>立即返回主页</Button>
        </div>
    )
}
