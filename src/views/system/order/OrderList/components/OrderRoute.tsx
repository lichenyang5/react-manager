import type { IDetailProp } from '@/types/modal'
import { Modal } from 'antd'
import React, { useImperativeHandle, useState } from 'react'
import api from '@/api/orderApi'
import { message } from '@/utils/AntdGlobal'
import type { Order } from '@/types/api'
export default function OrderRoute(props: IDetailProp) {
  const [visible, setVisible] = useState(false)
  const [trackAni, setTrackAni] = useState<{
    cancel: () => void
  }>()
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  const open = async (orderId: string) => {
    const detail = await api.getOrderDetail(orderId)
    if (detail.route.length > 0) {
      setVisible(true)
      setTimeout(() => {
        renderMap(detail)
      })
    } else {
      message.info('请先去打点')
    }
  }
  const renderMap = (detail: Order.OrderItem) => {
    //创建地图实例对象
    const map = new window.BMapGL.Map('orderRouteMap')
    map.centerAndZoom(detail.cityName, 17) // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    const path = detail.route || []
    let point = []
    for (let i = 0; i < path.length; i++) {
      point.push(new window.BMapGL.Point(path[i].lng, path[i].lat))
    }
    const pl = new window.BMapGL.Polyline(point, {
      strokeWeight: '8', //px单位
      strokeOpacity: 0.8,
      strokeColor: 'skyblue'
    })
    setTimeout(start, 1000)
    function start() {
      const trackAni = new window.BMapGLLib.TrackAnimation(map, pl, {
        overallView: true,
        tilt: 30,
        duration: 20000,
        delay: 300
      })
      trackAni.start()
      setTrackAni(trackAni)
    }
  }
  const handleCancel = () => {
    setVisible(false)
    trackAni?.cancel()
  }
  return (
    <Modal
      title='地图打点'
      width={1100}
      open={visible}
      footer={false}
      onCancel={handleCancel}
    >
      <div id='orderRouteMap' style={{ height: 500 }}></div>
    </Modal>
  )
}
