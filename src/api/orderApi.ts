import request from '@/utils/request'
import type{ Order,  ResultData} from '@/types/api'
export default {
  // 获取订单列表
  getOrderList(params: Order.Params) {
    return request.get<ResultData<Order.OrderItem>>('/order/list', params)
  },
  //获取城市列表
  getCityList(){
    return request.get<Order.DictItem[]>('/order/citylist')
  },
  //获取车型列表
  getVehicleList(){
      return request.get<Order.DictItem[]>('/order/vehiclelist')
  },
  //创建订单
  createOrder(params:Order.CreateParams){
    return request.post('/order/create',params)
  },
  //获取订单详情
  getOrderDetail(orderId:string){
    return request.get<Order.OrderItem>(`/order/detail/${orderId}`)
  },
  //更新订单信息
  updateOrderInfo(params:Order.OrderRoute){
    return  request.post('/order/edit',params)
  },
  //删除订单
  delOrder(orderId:string){
    return request.post('/order/delete',{id:orderId})
  },
  //导出订单
  exportData(params:Order.SearchParams){
    return request.downloadFile('/order/export',params,'订单列表')
  },
  //获取城市数据
  getCityData(cityId:number){
    return request.get<Array<{ lng: string; lat: string }>>(`/order/cityData/${cityId}`)
  },
  //获取司机列表
  getDriverList(params:Order.DriverParams){
    return request.get<ResultData<Order.DriverItem>>('/order/driver/list',params)
  }
}
