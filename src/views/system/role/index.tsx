import React, { useRef } from 'react'
import api from '@/api/roleApi'
import { useAntdTable } from 'ahooks'
import { Button, Form, Input, Modal, Space, Table } from 'antd'
import { useForm } from 'antd/es/form/Form'
import type { Role } from '@/types/api'
import { toLocalDate } from '@/utils'
import type { IAction } from '@/types/modal'
import CreateRole from './CreateRole'
import type { ColumnsType } from 'antd/es/table'
import { message } from '@/utils/AntdGlobal'
import SetPermission from './SetPermission'
export default function RoleList() {
  const roleRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>(null)
  const permissionRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>(null)
  const [form] = useForm()
  const getTableData = (
    {
      current,
      pageSize
    }: {
      current: number
      pageSize: number
    },
    formData: Role.Params
  ) => {
    return api
      .getRoleList({
        ...formData,
        pageNum: current,
        pageSize: pageSize
      })
      .then(data => {
        console.log(' ', data)
        return {
          total: data.list.length,
          list: data.list
        }
      })
  }
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 5
  })
  const columns: ColumnsType<Role.RoleItem> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(updataTime: string) {
        return toLocalDate(updataTime)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime: string) {
        return toLocalDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      render(_, record) {
        return (
          <Space>
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
                handleSetPerssion(record)
              }}
            >
              设置权限
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
  //创建角色
  const handleCreate = () => {
    roleRef.current?.open('create')
  }
  //编辑角色
  const handleEdit = (data: Role.RoleItem) => {
    roleRef.current?.open('edit', data)
  }
  //删除角色
  const handleDelete = (_id: string) => {
    Modal.confirm({
      title: '确认',
      content: <span>确认删除吗</span>,
      okText: '确认删除吗',
      cancelText: '取消',
      async onOk() {
        await api.delRole({ _id })
        message.success('删除成功')
        search.submit()
      }
    })
  }
  //设置权限
  const handleSetPerssion = (record: Role.RoleItem) => {
    permissionRef.current?.open('edit', record)
  }
  return (
    <div className='role-warp'>
      <Form form={form} className='search-form' layout='inline'>
        <Form.Item name='roleName' label='角色名称'>
          <Input placeholder='请输入角色名称' />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' onClick={search.submit}>
              搜索
            </Button>
            <Button type='default' onClick={search.reset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>角色列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table
          rowKey='_id' // 保证每行有唯一 key
          {...tableProps}
          bordered
          columns={columns}
        />
      </div>
      <CreateRole mRef={roleRef} update={search.submit} />
      <SetPermission mRef={permissionRef} update={search.submit} />
    </div>
  )
}
