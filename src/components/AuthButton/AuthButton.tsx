import type { IAuthLoader } from '@/router/AuthLoader'
import { Button } from 'antd'
import { useRouteLoaderData } from 'react-router-dom'
import store from '@/store'

export default function AuthButton(props: any) {
  const data = useRouteLoaderData('layout') as IAuthLoader
  if (!props.auth) {
    return <Button {...props}>{props.children}</Button>
  }
  if (data.buttonList.includes(props.auth) || store.userInfo.role === 1) {
    return <Button {...props}>{props.children}</Button>
  }
  return <></>
}
