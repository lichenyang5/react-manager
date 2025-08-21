import { BrowserRouter, RouterProvider } from 'react-router-dom'
import router from './router/index'
import { ConfigProvider } from 'antd'
import { App as AntdApp, theme } from 'antd'
import store from './store'
import AntdGlobal from './utils/AntdGlobal'
import './styles/theme.less'
import './App.less'
export default function App() {
  const isDark = store.isDark
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#ed6c00' },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <AntdApp>
        <AntdGlobal />
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  )
  // return (
  //   <BrowserRouter>
  //     <Router />
  //   </BrowserRouter>
  // )
}
