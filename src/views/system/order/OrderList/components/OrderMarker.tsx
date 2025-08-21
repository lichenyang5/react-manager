import { Modal } from 'antd'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import api from '@/api/orderApi'
import { Order } from '@/types/api'
import { message } from '@/utils/AntdGlobal'
import type { IDetailProp } from '@/types/modal'
export default function OrderMarker(props: IDetailProp) {
  const [visble, setVisible] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [map, setMap] = useState<BMapGL.Map>()

  //markers状态保存你的经纬度以及当前设置id给每一个按钮
  const [markers, setMarkers] = useState<
    { lng: string; lat: string; id: number }[]
  >([])

  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  // 弹框
  const open = async (orderId: string) => {
    setOrderId(orderId)
    setVisible(true)
    const detail = await api.getOrderDetail(orderId)
    renderMap(detail)
    // setTimeout(() => {
    //   renderMap(detail)
    // })
  }

  // 渲染地图
  const renderMap = (detail: Order.OrderItem) => {
    //首先初始化地图 通过容器 new BMapGL.Map('markerMap')
    const map = new window.BMapGL.Map('markerMap')
    setMap(map)
    //设置城市中心点 也可以是一个坐标 12缩放等级
    map.centerAndZoom(detail.cityName, 12)
    //地图控件 比如 比例尺
    const scaleCtrl = new window.BMapGL.ScaleControl() // 添加比例尺控件
    map.addControl(scaleCtrl)
    //缩放比例尺
    const zoomCtrl = new window.BMapGL.ZoomControl() // 添加缩放控件
    //启用滚轮缩放 通过enableScrollwheelzoom
    map.enableScrollWheelZoom()
    map.addControl(zoomCtrl)
    detail.route?.map(item => {
      createMarker(map, item.lng, item.lat)
    })
    // 绑定事件
    //点击事件发生的时候e就是点击事件发生的对象元素，里面有经纬度
    map.addEventListener('click', function (e: any) {
      createMarker(map, e.latlng.lng, e.latlng.lat)
    })
  }

  // 创建marker覆盖物
  //生成覆盖物需要经纬度 宽和线
  const createMarker = (map: any, lng: string, lat: string) => {
    const id = Math.random()
    const marker = new window.BMapGL.Marker(new window.BMapGL.Point(lng, lat))
    markers.push({ lng, lat, id })
    marker.id = id
    const markerMenu = new window.BMapGL.ContextMenu()
    markerMenu.addItem(
      new window.BMapGL.MenuItem('删除', function () {
        map.removeOverlay(marker)
        const index = markers.findIndex(item => item.id === marker.id)
        markers.splice(index, 1)
        setMarkers([...markers])
      })
    )
    setMarkers([...markers])
    marker.addContextMenu(markerMenu)
    map.addOverlay(marker)
  }
  // 更新打点
  const handleOk = async () => {
    await api.updateOrderInfo({
      orderId,
      route: markers
    })
    message.success('打点成功')
    handleCancel()
  }
  // 关闭弹框
  const handleCancel = () => {
    map?.clearOverlays()
    setVisible(false)
    setMarkers([])
  }
  return (
    <Modal
      title='地图打点'
      width={1100}
      open={visble}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div id='markerMap' style={{ height: 500 }}></div>
    </Modal>
  )
}
/*
  首先初始化地图 通过容器 new BMapGL.Map('markerMap')
    然后第二步设置中心点
*/
