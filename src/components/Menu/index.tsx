import React, { useEffect, useState } from 'react'
import { Menu as IMenu } from 'antd'
import type { Menu } from '@/types/api'
import {
  DesktopOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons'
import styles from './index.module.less'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'
import store from '@/store'
import type { MenuProps } from 'antd'
import * as Icons from '@ant-design/icons'
export default function SideMenu() {
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const data = useRouteLoaderData('layout')
  const [selectedKeys, setSelectKeys] = useState<string[]>([])
  console.log(' data', data)
  const { pathname } = useLocation()

  type MenuItem = Required<MenuProps>['items'][number]
  const navigite = useNavigate()
  // 生成每一个菜单项
  function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      label,
      key,
      icon,
      children
    } as MenuItem
  }
  function createIcon(name?: string) {
    if (!name) return <></>
    const customerIcons: { [key: string]: any } = Icons
    const icon = customerIcons[name]
    if (!icon) return <></>
    return React.createElement(icon)
  }
  //递归生成菜单
  const getTreeMenu = (
    menuList: Menu.MenuItem[],
    treeList: MenuItem[] = []
  ) => {
    menuList.forEach((item, index) => {
      if (item.menuType === 1 && item.menuState === 1) {
        if (item.button) {
          return treeList.push(
            getItem(item.menuName, item.path || index, createIcon(item.icon))
          )
        }
        treeList.push(
          getItem(
            item.menuName,
            item.path || index,
            createIcon(item.icon),
            getTreeMenu(item.children || [])
          )
        )
      }
    })
    return treeList
  }
  useEffect(() => {
    const treeMenuList = getTreeMenu(data.menuList)
    setMenuList(treeMenuList)
    setSelectKeys([pathname])
  }, [])
  const handleClickLogo = () => {
    navigite('/welcome')
  }
  //点击跳转路由
  const handleClickMenu = ({ key }: { key: string }) => {
    setSelectKeys([key])
    navigite(key)
  }
  return (
    <div className={styles.navSide}>
      <div className={styles.logo} onClick={handleClickLogo}>
        <img className={styles.img} src='/images/logo.png' alt='' />
        <span>木木货运</span>
      </div>
      <IMenu
        mode='inline' //mode 模式设置的子导航打开方式 行内行外
        theme={store.isDark ? 'light' : 'dark'}
        items={menuList}
        style={{ height: 'calc(100vh - 50px)' }}
        selectedKeys={selectedKeys}
        onClick={handleClickMenu}
      />
    </div>
  )
}
