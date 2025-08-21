//面包屑实现
//获取当前页面pathname ,然后去当前的菜单列表查找，而且查找的时候保留父元素的菜单名称 最后生成一个数组
import type { IAuthLoader } from '@/router/AuthLoader'
import { findTreeNode } from '@/utils'
import { Breadcrumb } from 'antd'
import React, { useEffect, useState, type ReactNode } from 'react'
import { useLocation, useRouteLoaderData } from 'react-router-dom'
import TabsFC from './Tabs'
export default function BreadCrumb() {
  const { pathname } = useLocation()
  const [breadList, setBreadList] = useState<(string | ReactNode)[]>([])
  const data = useRouteLoaderData('layout') as IAuthLoader
  const list = findTreeNode(data.menuList, pathname, [])
  useEffect(() => {
    setBreadList([<a href='/welcome'>首页</a>, ...list])
  }, [pathname])
  return (
    <>
      <Breadcrumb
        items={breadList.map(item => {
          return { title: item }
        })}
        style={{ marginLeft: '10px' }}
      />
    </>
  )
}
