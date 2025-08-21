import type { Menu, Role } from '@/types/api'
import type { IAction, ImodalProp } from '@/types/modal'
import { Form, Input, Modal, Tree } from 'antd'
import React, { useEffect, useState } from 'react'
import api from '@/api/index'
import roleApi from '@/api/roleApi'

import { useImperativeHandle } from 'react'
import { message } from '@/utils/AntdGlobal'
export default function SetPermission(props: ImodalProp<Role.RoleItem>) {
  const [roleInfo, setRoleInfo] = useState<Role.RoleItem>()
  const [permissionList, setPermissionList] = useState<Role.Permission>()
  const [visible, setVisible] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([])
  useEffect(() => {
    getMenuList()
  }, [])
  const getMenuList = async () => {
    const menuList = await api.getMenuList()
    setMenuList(menuList)
  }
  //暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  //调用弹窗显示方法
  const open = (type: IAction, data?: Role.RoleItem) => {
    setVisible(true)
    setRoleInfo(data)
    setCheckedKeys(data?.permissionList.checkedKeys || [])
  }
  //取消
  const handleCancel = () => {
    setVisible(false)
    setPermissionList(undefined)
  }
  const handleOk = async () => {
    if (permissionList) {
      await roleApi.updataPermission(permissionList)
      message.success('权限设置成功')
      handleCancel()
      props.update()
    }
  }
  const onCheck = (checkedKeysValue: any, item: any) => {
    setCheckedKeys(checkedKeysValue)
    const checkedKeys: string[] = []
    const parentKeys: string[] = []
    item.checkedNodes.map((node: Menu.MenuItem) => {
      if (node.menuType === 2) {
        checkedKeys.push(node._id)
      } else {
        parentKeys.push(node._id)
      }
    })
    setPermissionList({
      _id: roleInfo?._id || '',
      permissionList: {
        checkedKeys: checkedKeys,
        halfCheckedKeys: parentKeys.concat(item.halfCheckedKeys)
      }
    })
  }
  return (
    <Modal
      title='设置权限'
      width={600}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item label='角色名称'>{roleInfo?.roleName}</Form.Item>
        <Form.Item label='权限'>
          <Tree
            defaultExpandAll
            fieldNames={{
              title: 'menuName',
              key: '_id',
              children: 'children'
            }}
            checkable
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={menuList}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
