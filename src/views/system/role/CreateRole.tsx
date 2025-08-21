import type { Role } from '@/types/api'
import type { IAction, ImodalProp } from '@/types/modal'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useState } from 'react'
import api from '@/api/roleApi'
import { useImperativeHandle } from 'react'
import { message } from '@/utils/AntdGlobal'
export default function CreateRole(props: ImodalProp<Role.RoleItem>) {
  const [form] = useForm()
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  //暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  //调用弹窗显示方法
  const open = (type: IAction, data?: Role.RoleItem) => {
    setAction(type)
    setVisible(true)
    if (data) {
      form.setFieldsValue(data)
    }
  }
  const handleOk = async () => {
    const valid = await form.validateFields()
    if (valid) {
      const params = form.getFieldsValue()
      if (action === 'create') {
        await api.createRole(params)
      } else {
        await api.editRole(params)
      }
      message.success('操作成功')
      handleCancel()
      props.update()
    }
  }
  //取消
  const handleCancel = () => {
    form.resetFields()
    setVisible(false)
  }
  return (
    <Modal
      title={action === 'create' ? '新增角色' : '编辑角色'}
      width={600}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 4 }}>
        {/* 隐藏域 */}
        <Form.Item name='_id' hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name='roleName'
          label='角色名称'
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder='请输入角色名称' />
        </Form.Item>
        <Form.Item name='remark' label='备注'>
          <Input.TextArea placeholder='请输入备注' />
        </Form.Item>
      </Form>
    </Modal>
  )
}
