import React, { useEffect } from 'react'
import { Layout, theme, Watermark } from 'antd'
import NavHeader from '@/components/NavHeader'
import SideMenu from '@/components/Menu'
import { router } from '@/router'
import {
  Navigate,
  Outlet,
  useLocation,
  useRouteLoaderData
} from 'react-router-dom'
import styles from './index.module.less'
import api from '@/api'
import store, { useStore } from '@/store'
import type { IAuthLoader } from '@/router/AuthLoader'
import { searchRoute } from '@/utils'
import TabsFC from '@/components/NavHeader/Tabs'
const { Sider } = Layout
const App: React.FC = () => {
  const { pathname } = useLocation()
  const state = useStore()
  useEffect(() => {
    getUserInfo()
  }, [])
  const getUserInfo = async () => {
    const data = await api.getUserInfo()
    store.updataUserInfo(data)
    state.updateUserInfo(data)
    console.log('gogoog ', data.userName)
  }
  const route = searchRoute(pathname, router)
  if (route && route.meta?.auth === false) {
    //继续执行
  } else {
    //权限判断
    const data = useRouteLoaderData('layout') as IAuthLoader
    const staticPath = ['/welcome', '/403', '/404']
    if (
      !data.menuPathList.includes(pathname) &&
      !staticPath.includes(pathname)
    ) {
      return <Navigate to='/403' />
    }
  }
  return (
    <Watermark content={store.userInfo.userName}>
      <Layout>
        <Sider>
          <SideMenu />
        </Sider>
        <Layout>
          {/* <Header style={{ padding: 0, background: colorBgContainer }}>
            <NavHeader />
          </Header> */}
          <NavHeader />
          <TabsFC />
          <div className={styles.content}>
            <div className={styles.wrapper}>
              <Outlet />
            </div>
          </div>
          {/* <div className={styles.wrapper}>
            <Outlet />
          </div>
          <NavFooter /> */}
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default App
