import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, message, Modal, Select, Space, Table } from 'antd'
import { useForm } from 'antd/es/form/Form'
import api from '@/api'
import type { Menu } from '@/types/api'
import type { TableColumnsType } from 'antd'
import type { IAction } from '@/types/modal'
import { toLocalDate } from '@/utils'
import CreateMenu from './CreateMenu'
export default function MenuList() {
  const [form] = useForm()
  const menuRef = useRef<{
    open: (
      type: IAction,
      data?: Menu.EditParams | { parentId?: string; orderBy?: number }
    ) => void
  }>(null)
  const [data, setData] = useState<Menu.MenuItem[]>([])
  useEffect(() => {
    getMenuList()
  }, [])
  const getMenuList = async () => {
    const data = await api.getMenuList(form.getFieldsValue())
    setData(data)
  }
  //重置功能
  const handleReset = () => {
    form.resetFields()
  }
  //创建部门
  const handleCreate = () => {
    menuRef.current?.open('create', {
      orderBy: data.length
    })
  }
  //创建部门
  const handleSubCreate = (recode: Menu.MenuItem) => {
    menuRef.current?.open('create', {
      parentId: recode._id,
      orderBy: recode.children?.length
    })
  }
  //编辑部门
  const handleEdit = (record: Menu.MenuItem) => {
    menuRef.current?.open('edit', record)
  }
  //删除部门
  const handleDelete = (record: Menu.MenuItem) => {
    let text = ' '
    if (record.menuType === 1) text = '菜单'
    if (record.menuType === 2) text = '按钮'
    if (record.menuType === 3) text = '页面'
    Modal.confirm({
      title: '确认删除吗',
      content: `确认删除该${text}吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        handleDelSubmit(record._id)
      }
    })
  }
  //删除提交
  const handleDelSubmit = async (id: string) => {
    await api.deleteMenu({
      _id: id
    })
    message.success('删除成功')
    getMenuList()
  }
  const columns: TableColumnsType<Menu.MenuItem> = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName'
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      key: 'icon'
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      render(menuType: number) {
        return {
          1: '菜单',
          2: '按钮',
          3: '页面'
        }[menuType]
      }
    },
    {
      title: '权限标识',
      dataIndex: 'menuCode',
      key: 'menuCode'
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: '组件名称',
      dataIndex: 'component',
      key: 'component'
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
                handleSubCreate(record)
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
                handleDelete(record)
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
        <Form.Item label='菜单名称' name='menuName'>
          <Input placeholder='菜单名称' />
        </Form.Item>
        <Form.Item label='菜单状态' name='menuState'>
          <Select style={{ width: '100px' }}>
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={2}>停用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type='primary' className='mr10' onClick={getMenuList}>
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
          <div className='title'>菜单列表</div>
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
      <CreateMenu mRef={menuRef} update={getMenuList} />
    </div>
  )
}
