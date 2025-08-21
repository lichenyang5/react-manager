import {
  Form,
  Modal,
  Input,
  InputNumber,
  Select,
  Upload,
  Tree,
  TreeSelect
} from 'antd'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { UploadProps } from 'antd'
import storage from '@/utils/storage'
import { message } from '@/utils/AntdGlobal'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { IAction, ImodalProp } from '@/types/modal'
import type { Dept, Role, User } from '@/types/api'
import api from '@/api'
import roleApi from '@/api/roleApi'
export default function CreateUser(props: ImodalProp) {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(false)
  const [deptList, setDeptList] = useState<Dept.DeptItem[]>([])
  const [roleList, setRoleList] = useState<Role.RoleItem[]>([])
  useEffect(() => {
    getDeptList()
    getAllList()
  }, [])
  //获取部门列表
  const getDeptList = async () => {
    const list = await api.getDeptList()
    setDeptList(list)
  }
  //获取角色列表
  const getAllList = async () => {
    const roleList = await roleApi.getAllRoleList()
    console.log('gogogoogogo ', roleList)
    setRoleList(roleList)
  }
  //暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  //调用弹窗显示方法
  const open = (type: IAction, data?: User.UserItem) => {
    setAction(type)
    setVisible(true)
    if (type === 'edit' && data) {
      form.setFieldsValue(data)
      setImg(data.userImg)
    }
  }
  const handleSubmit = async () => {
    //检查是否
    const vaild = await form.validateFields()
    if (vaild) {
      const params = {
        ...form.getFieldsValue(),

        userImg: `${img}`
      }
      if (action === 'create') {
        await api.createUser(params)
        message.success('创建成功')
      } else {
        await api.editUser(params)
        message.success('修改成功')
        handleCancel()
      }
      handleCancel()
      props.update()
    }
  }
  const handleCancel = () => {
    setVisible(false)
    setImg('')
    form.resetFields()
  }
  //上传之前接口处理以及上传之后图片处理
  const submit: UploadProps = {
    beforeUpload: file => {
      const isPNG = file.type === 'image/png' || file.type === 'image/jpeg'
      if (!isPNG) {
        message.error(`只能上传png或者jpeg格式的图片`)
      }
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isLt2M) {
        message.error('图片不能超过500k')
      }
      return isPNG || Upload.LIST_IGNORE
    },

    onChange: info => {
      if (info.file.status === 'uploading') {
        setLoading(true)
        return
      }
      if (info.file.status === 'done') {
        setLoading(false)
        const { code, url, msg } = info.file.response
        console.log(' ', info)
        if (code === 0) {
          console.log(url)
          setImg(url)
        } else {
          message.error(msg)
        }
      } else if (info.file.status === 'error') {
        message.error('服务器异常 请稍后重试')
      }
    }
  }

  return (
    <Modal
      title={action === 'create' ? '创建用户' : '编辑用户'}
      okText='确定'
      cancelText='取消'
      width={800}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      {/* 隐藏域用来传userId 后端需要这个知道你要改谁但是用户不能改这个 */}
      <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
        <Form.Item name='userId' hidden>
          <Input></Input>
        </Form.Item>
        <Form.Item
          label='用户名称'
          name='userName'
          rules={[
            { required: true, message: '请输入用户名称' },
            { min: 5, max: 12, message: '用户名称最小5个字符 最大12个字符' }
          ]}
        >
          <Input placeholder='请输入用户名称'></Input>
        </Form.Item>
        <Form.Item
          label='用户邮箱'
          name='userEmail'
          rules={[
            { required: true, message: '请输入用户邮箱' },
            { type: 'email', message: '请输入正确的邮箱' }
          ]}
        >
          <Input
            placeholder='请输入用户邮箱'
            disabled={action === 'edit'}
          ></Input>
        </Form.Item>
        <Form.Item
          label='手机号'
          name='mobile'
          rules={[
            { len: 11, message: '手机号长度必须为11位' },
            { pattern: /1[1-9]\d{9}/, message: '请输入1-9开头的11位手机号' }
          ]}
        >
          <Input type='number' placeholder='请输入手机号'></Input>
        </Form.Item>
        <Form.Item
          label='部门'
          name='deptId'
          rules={[
            {
              required: true,
              message: '请选择部门'
            }
          ]}
        >
          <TreeSelect
            placeholder='请选择部门'
            allowClear
            treeDefaultExpandAll
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            fieldNames={{
              label: 'deptName',
              value: '_id'
            }}
            treeData={deptList}
          />
        </Form.Item>
        <Form.Item label='岗位' name='job'>
          <Input placeholder='请输入岗位'></Input>
        </Form.Item>
        <Form.Item label='状态' name='state'>
          <Select>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='用户角色' name='roleList'>
          <Select placeholder='请选择角色'>
            {roleList.map(item => {
              return (
                <Select.Option value={item._id} key={item._id}>
                  {item.roleName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label='用户头像'>
          <Upload
            name='file'
            listType='picture-card'
            showUploadList={false}
            headers={{ Authorization: `${storage.get('token')}` }}
            action='/api/users/upload'
            {...submit}
          >
            {img ? (
              <img
                src={`${img}`}
                style={{ width: '100%', borderRadius: '100%' }}
              />
            ) : (
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: '10px' }}>上传头像</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
