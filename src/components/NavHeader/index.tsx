import { MenuUnfoldOutlined } from '@ant-design/icons'
import { Breadcrumb, Dropdown, Switch } from 'antd'
import type { MenuProps } from 'antd'
import styles from './index.module.less'
import store, { useStore } from '@/store'
import storage from '@/utils/storage'
import BreadCrumb from './BreadCrumb'
import { useEffect } from 'react'
export default function NavHeader() {
  const userInfo = useStore(state => state.userInfo)
  useEffect(() => {
    handleSwitch(store.isDark)
  }, [])
  const items: MenuProps['items'] = [
    {
      key: 'emali',
      label: `邮箱:${store.userInfo.userEmail}`
    },
    {
      key: 'logout',
      label: `退出`
    }
  ]
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      storage.remove('token')
      //location.href = '/login?...' 表示重定向到登录页面，并把当前页面地址编码后作为参数传过去。
      location.href = '/login?callback=' + encodeURIComponent(location.href)
    }
  }
  const handleSwitch = (isDark: boolean) => {
    if (isDark) {
      // document.documentElement.dataset.theme = 'dark'
      document.documentElement.classList.add('dark')
    } else {
      // document.documentElement.dataset.theme = 'light'
      document.documentElement.classList.remove('dark')
    }
    storage.set('isDark', isDark)
    store.updateTheme(isDark)
  }
  return (
    <div className={styles.navHeader}>
      <div className={styles.left}>
        <MenuUnfoldOutlined />
        <BreadCrumb />
      </div>
      <div className='right'>
        <Switch
          checked={store.isDark}
          checkedChildren='暗黑'
          unCheckedChildren='默认'
          onChange={handleSwitch}
          style={{ marginRight: '10px' }}
        />
        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <span className={styles.nickName}>{userInfo.userName}</span>
        </Dropdown>
      </div>
    </div>
  )
}
