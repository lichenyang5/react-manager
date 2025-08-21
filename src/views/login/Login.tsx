import React, { useState } from 'react'
import { Form, Input, Button, message, App } from 'antd'
import styles from './index.module.less'
import api from '@/api'
import type { Login } from '@/types/api'
import storage from '@/utils/storage'
import store from '@/store'
export default function Login() {
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const onFinish = async (value: Login.params) => {
    try {
      setLoading(true)
      const data = await api.login(value)
      setLoading(false)
      //request做了处理  data.data只包含token
      //console.log('data', data)
      storage.set('token', data.token)
      store.token = data.token
      message.success('登录成功')
      const params = new URLSearchParams(location.search)
      console.log('params', params)
      location.href = params.get('callback') || '/welcome'
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.loginWarpper}>
        <div className={styles.title}>系统登录</div>
        <Form
          name='basic'
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item
            name='userName'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='userPwd'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type='primary' htmlType='submit' block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
