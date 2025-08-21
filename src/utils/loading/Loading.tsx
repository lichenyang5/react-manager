import { Spin } from 'antd'
import React from 'react'
import './loading.less'
export default function Loading({ tip = 'Loading' }: { tip?: string }) {
  return (
    <div className='request-loading'>
      <Spin tip={tip} size='large'>
        <div style={{ display: 'none' }}></div>
      </Spin>
    </div>
  )
}
