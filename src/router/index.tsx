import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '@/views/login/Login'
import Welcome from '@/views/Welcome'
import Error403 from '@/views/Error403'
import Error404 from '@/views/Error404'
import Layout from '@/layout'
import AuthLoader from './AuthLoader'
import { lazyLoad } from './LazyLoad'

export const router = [
  {
    path: '/',
    element: <Navigate to='/welcome' />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    id: 'layout',
    element: <Layout />,
    loader: AuthLoader,
    children: [
      {
        path: '/welcome',
        element: <Welcome />
      },
      {
        path: '/dashboard',
        element: lazyLoad(React.lazy(() => import('@/views/dashboard')))
      },
      {
        path: '/userList',
        element: lazyLoad(React.lazy(() => import('@/views/system/user')))
      },
      {
        path: '/deptList',
        element: lazyLoad(React.lazy(() => import('@/views/system/dept')))
      },
      {
        path: '/menuList',
        element: lazyLoad(React.lazy(() => import('@/views/system/menu')))
      },
      {
        path: '/roleList',
        element: lazyLoad(React.lazy(() => import('@/views/system/role')))
      },
      {
        path: '/orderList',
        element: lazyLoad(
          React.lazy(() => import('@/views/system/order/OrderList'))
        )
      },
      {
        path: '/cluster',
        element: lazyLoad(
          React.lazy(
            () =>
              import(
                '@/views/system/order/OrderList/components/OrderCluster/index'
              )
          )
        )
      },
      {
        path: '/driverList',
        element: lazyLoad(
          React.lazy(() => import('@/views/system/order/DriverList/index'))
        )
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to='/404' />
  },
  {
    path: '/404',
    element: <Error404 />
  },
  {
    path: '/403',
    element: <Error403 />
  }
]

export default createBrowserRouter(router)
