import React, { useState, useEffect, useRef } from 'react'
import type { PageParams, User } from '@/types/api'
import type { TableColumnsType } from 'antd'
import { Button, Table, Form, Input, Select, Space, Modal, message } from 'antd'
import api from '@/api/index'
import { toLocalDate } from '@/utils'
import CreateUser from './CreateUser'
import type { IAction } from '@/types/modal'
import { useAntdTable } from 'ahooks'
import RoleList from '../role'
import AuthButton from '@/components/AuthButton/AuthButton'
import SearchForm from '@/components/SearchForm'
export default function UserList() {
  const userRef = useRef<{
    open: (type: IAction, data?: User.UserItem) => void
  }>(null)
  //获取表单对象 用里面的方法 getFieldsValue获取表单中填写的内容
  const [form] = Form.useForm()
  const [userIds, setUserIds] = useState<number[]>([])
  //创建
  const handleCreate = () => {
    userRef.current?.open('create')
  }
  //编辑
  const handleEdit = (recoad: User.UserItem) => {
    userRef.current?.open('edit', recoad)
  }
  //删除用户
  const handleDel = (userId: number) => {
    Modal.confirm({
      title: '删除确认',
      content: <span>确认删除改用户吗</span>,
      onOk: () => {
        handleUserDelSubmit([userId])
      }
    })
  }
  //批量删除确认
  const handlePatchConfirm = () => {
    if (userIds.length === 0) {
      message.error('请选择要删除掉用户')
      return
    }
    Modal.confirm({
      title: '删除确认',
      content: <span>确认删除改批量用户吗</span>,
      onOk: () => {
        handleUserDelSubmit(userIds)
      }
    })
  }
  //公共的删除接口
  const handleUserDelSubmit = async (ids: number[]) => {
    try {
      const data = await api.delUser({
        userId: ids
      })
      message.success('删除成功')
      setUserIds([])
      search.reset()
    } catch (e) {}
  }
  /*
    先写一个函数接口调用请求
对，这就是 getTableData，负责发请求并返回 Promise，且 resolve { total, list }。

把表单数据作为 Promise 实例返回
 对，formData 参数就是表单的值，useAntdTable 会帮你自动传进来。

钩子的第一个参数是接口函数，第二个参数是配置对象
对，配置对象里你用了 form（useForm 的表单对象）和 defaultPageSize。

form 绑定到表格中，配置项绑定分页和搜索
 对，传了 form 以后，表单和表格就能联动搜索了。

search.submit() 和 search.reset() 分别触发搜索和重置
 对，搜索和分页都是重新调用接口，只是参数不同。
  */
  const getTableData = (
    {
      current,
      pageSize
    }: {
      current: number
      pageSize: number
    },
    formData: User.Params
  ) => {
    return api
      .getUserList({
        ...formData,
        pageNum: current,
        pageSize: pageSize
      })
      .then(data => {
        console.log(' ', data)
        return {
          total: data.page.total,
          list: data.list
        }
      })
  }
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 5
  })
  const columns: TableColumnsType<User.UserItem> = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '用户邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail'
    },
    {
      title: '用户角色',
      dataIndex: 'roleList',
      key: 'roleList',
      render(roleList: number | string) {
        return {
          1: '管理员',
          2: '普通用户'
        }[roleList]
      }
    },
    {
      title: '用户状态',
      dataIndex: 'state',
      key: 'state',
      render(state: number) {
        return {
          1: '在职',
          2: '离职',
          3: '试用期'
        }[state]
      }
    },
    {
      title: '注册时间',
      dataIndex: 'create', // 你的字段是 create，不是 createTime
      key: 'create',
      render(createTime: string) {
        return toLocalDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'adress',
      render(record) {
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
            <Button type='text' danger onClick={() => handleDel(record.userId)}>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]
  return (
    <div className='user-list'>
      <SearchForm
        form={form}
        className='search-form'
        layout='inline'
        submit={search.submit}
        reset={search.reset}
        initialValues={{ state: 0 }}
      >
        <Form.Item name='userId' label='用户ID'>
          <Input placeholder='请输入用户ID' />
        </Form.Item>
        <Form.Item name='userName' label='用户名称'>
          <Input placeholder='请输入用户名称' />
        </Form.Item>
        <Form.Item name='state' label='状态'>
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>所有</Select.Option>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
        </Form.Item>
      </SearchForm>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>用户列表</div>
          <div className='action'>
            <AuthButton type='primary' onClick={handleCreate}>
              新增
            </AuthButton>
            <Button
              type='primary'
              danger
              onClick={() => {
                handlePatchConfirm()
              }}
            >
              批量删除
            </Button>
          </div>
        </div>
        <Table
          rowKey='userId' // 保证每行有唯一 key
          {...tableProps}
          bordered
          //rowSelection多选
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: userIds,
            onChange: (selecterRowKeys: React.Key[]) => {
              setUserIds(selecterRowKeys as number[])
            }
          }}
          columns={columns}
        />
      </div>
      <CreateUser
        mRef={userRef}
        update={() => {
          search.reset()
        }}
      />
    </div>
  )
}
