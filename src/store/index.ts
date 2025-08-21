import resso from 'resso'
import { create } from 'zustand'
import type { User } from '@/types/api'
import storage from '@/utils/storage'
//resso 状态管理有类型推导 直接token:''会认为是string
//resso 直接在resso({})对象中配置存的状态管理 赋值直接通过引入store对象直接.=赋值就可以了
//操作方法也可以直接写在resso中
const store = resso({
  token: '',
  userInfo: {
    create: 0,
    mobile: '',
    job: '',
    deptId: '',
    deptName: '',
    role: 0,
    roleList: '',
    state: 0,
    userEmail: '',
    userId: 0,
    userImg: '',
    userName: '',
    _id: ''
  },
  isDark: storage.get('isDark') || false,
  updateTheme(isDark: boolean) {
    store.isDark = isDark
  },
  updataUserInfo(userInfo: User.UserItem) {
    store.userInfo = userInfo
  },
  updataToken(token: string) {
    store.token = token
  }
})
export default store
//zustand 更新方法必须要用回调函数然后里面用set函数更新
export const useStore = create<{
  token: string
  userInfo: User.UserItem
  collapsed: boolean
  isDark: boolean
  updateToken: (token: string) => void
  updateUserInfo: (userInfo: User.UserItem) => void
  updateCollapsed: () => void
  updateTheme: (isDark: boolean) => void
}>(set => ({
  token: '',
  userInfo: {
    create: 0,
    mobile: '',
    job: '',
    deptId: '',
    deptName: '',
    role: 0,
    roleList: '',
    state: 0,
    userEmail: '',
    userId: 0,
    userImg: '',
    userName: '',
    _id: ''
  },
  collapsed: false,
  isDark: storage.get('isDark') || false,
  updateToken: token => set({ token }),
  updateTheme: isDark => set({ isDark }),
  updateUserInfo: (userInfo: User.UserItem) => set({ userInfo }),
  updateCollapsed: () =>
    set(state => {
      return {
        collapsed: !state.collapsed
      }
    })
}))
