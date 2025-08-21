import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import {
  Navigate,
  useLocation,
  useNavigate,
  useRouteLoaderData
} from 'react-router-dom'
import type { IAuthLoader } from '@/router/AuthLoader'
import { searchRoute } from '@/utils'
interface TabsItem {
  key: string
  label: string
  closable: boolean
}
export default function TabsFC() {
  const { pathname } = useLocation()
  const [tabsList, setTabsList] = useState<TabsItem[]>([
    { key: '/welcome', label: '首页', closable: false }
  ])
  const [activeKey, setActiveKey] = useState('')
  const data = useRouteLoaderData('layout') as IAuthLoader
  const navigate = useNavigate()
  useEffect(() => {
    addTabs()
  }, [pathname])
  const addTabs = () => {
    const route = searchRoute(pathname, data.menuList)
    console.log('route', route)
    if (!tabsList.find(item => item.key === route.path)) {
      tabsList.push({
        key: route.path,
        label: route.menuName,
        closable: pathname !== 'welcome'
      })
    }
    setTabsList([...tabsList])
    setActiveKey(pathname)
  }
  const handleChange = (path: string) => {
    navigate(path)
  }
  const handleDel = (path: string) => {
    if (pathname === path) {
      tabsList.forEach((item, index: number) => {
        if (item.key !== pathname) return
        const nextTab = tabsList[index + 1] || tabsList[index - 1]
        if (!nextTab) return
        navigate(nextTab.key)
      })
    }
    setTabsList(tabsList.filter(item => item.key !== path))
  }
  return (
    <Tabs
      items={tabsList}
      activeKey={activeKey}
      tabBarStyle={{
        height: 40,
        marginBottom: 0,
        background: 'var(--dark-bg-color)'
      }}
      type='editable-card'
      hidden
      onChange={handleChange}
      onEdit={path => {
        handleDel(path as string)
      }}
    />
  )
}
