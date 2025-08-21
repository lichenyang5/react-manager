import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, message, Modal, Space, Table } from 'antd'
import { useForm } from 'antd/es/form/Form'
import api from '@/api'
import type { Dept } from '@/types/api'
import CreateDept from './CreateDept'
import type { TableColumnsType } from 'antd'
import type { IAction } from '@/types/modal'
import { toLocalDate } from '@/utils'
export default function DeptList() {
  const [form] = useForm()
  const deptRef = useRef<{
    open: (type: IAction, data?: Dept.EditParams | { parentId: string }) => void
  }>(null)
  const [data, setData] = useState<Dept.DeptItem[]>([])
  useEffect(() => {
    getDeptList()
  }, [])
  const getDeptList = async () => {
    const data = await api.getDeptList(form.getFieldsValue())
    setData(data)
  }
  //重置功能
  const handleReset = () => {
    form.resetFields()
  }
  //创建部门
  const handleCreate = () => {
    deptRef.current?.open('create')
  }
  //创建部门
  const handleSubCreate = (id: string) => {
    deptRef.current?.open('create', { parentId: id })
  }
  //编辑部门
  const handleEdit = (record: Dept.DeptItem) => {
    deptRef.current?.open('edit', record)
  }
  //删除部门
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除吗',
      content: '确认删除该部门吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        handleDelSubmit(id)
      }
    })
  }
  //删除提交
  const handleDelSubmit = async (id: string) => {
    await api.deleteDept({
      _id: id
    })
    message.success('删除成功')
    getDeptList()
  }
  const columns: TableColumnsType<Dept.DeptItem> = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 200
    },
    {
      title: '负责人',
      dataIndex: 'userName',
      key: 'userName',
      width: 150
    },
    {
      title: '更新事件',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(updateTime) {
        return toLocalDate(updateTime)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime) {
        return toLocalDate(createTime)
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      //新增的按钮没办法直接渲染 需要用render手动添加
      render(_, record) {
        return (
          <Space>
            <Button
              type='text'
              onClick={() => {
                handleSubCreate(record._id)
              }}
            >
              新增
            </Button>
            <Button
              type='text'
              onClick={() => {
                handleEdit(record)
              }}
            >
              编辑
            </Button>
            <Button
              type='text'
              onClick={() => {
                handleDelete(record._id)
              }}
              danger
            >
              删除
            </Button>
          </Space>
        )
      }
    }
  ]
  return (
    <div>
      <Form className='search-form' layout='inline' form={form}>
        <Form.Item label='部门名称' name='deptName'>
          <Input placeholder='部门名称' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' className='mr10' onClick={getDeptList}>
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type='default' onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>部门列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table
          bordered
          rowKey='_id'
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </div>
      <CreateDept mRef={deptRef} update={getDeptList} />
    </div>
  )
}
