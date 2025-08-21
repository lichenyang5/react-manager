import type { Dept, User } from '@/types/api'
import type { IAction, ImodalProp } from '@/types/modal'
import { Form, Input, message, Modal, Select, TreeSelect } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useImperativeHandle } from 'react'
import api from '@/api'
import { useState } from 'react'
export default function CreateDept(props: ImodalProp) {
  const [form] = useForm()
  const [action, setAction] = useState<IAction>('create')
  const [visible, setVisible] = useState(false)
  const [userList, setUserList] = useState<User.UserItem[]>([])
  const [deptList, setDeptList] = useState<Dept.DeptItem[]>([])
  useEffect(() => {
    getDeptList()
    getAllUserList()
  }, [])
  const getDeptList = async () => {
    const data = await api.getDeptList()
    setDeptList(data)
  }
  const getAllUserList = async () => {
    const data = await api.getAllUserList()
    setUserList(data)
  }
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  //打开弹框函数
  const open = async (
    type: IAction,
    data?: Dept.EditParams | { parentId: string }
  ) => {
    setAction(type)
    setVisible(true)
    const deptData = await api.getDeptList()
    setDeptList(deptData)
    if (data) {
      form.setFieldsValue(data)
    } else {
      form.resetFields()
    }
  }
  //部门提交
  const handleSubmit = async () => {
    const valid = await form.validateFields()
    if (valid) {
      if (action === 'create') {
        await api.createDept(form.getFieldsValue())
      } else {
        await api.editDept(form.getFieldsValue())
      }
      message.success('操作成功')
      handleCancel()
      props.update()
    }
  }
  //关闭和重置弹框表单
  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  }
  return (
    <Modal
      title={action === 'create' ? '创建部门' : '编辑部门'}
      width={800}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 4 }}>
        {/* 隐藏域 */}
        <Form.Item name='_id' hidden>
          <Input />
        </Form.Item>
        <Form.Item label='上级部门' name='parentId'>
          <TreeSelect
            placeholder='请选择上级部门'
            allowClear
            treeDefaultExpandAll
            //映射
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={deptList}
          />
        </Form.Item>
        <Form.Item
          label='部门名称'
          name='deptName'
          rules={[{ required: true, message: '请输入部门名称' }]}
        >
          <Input placeholder='请输入部门名称' />
        </Form.Item>
        <Form.Item
          label='负责人'
          name='userName'
          rules={[{ required: true, message: '请选择负责人' }]}
        >
          <Select>
            {userList.map(item => {
              return (
                <Select.Option value={item.userName} key={item.userId}>
                  {item.userName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
