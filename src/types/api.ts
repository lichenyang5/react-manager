//接口类型定义
//接口很多 有用户角色部门 所以用命名空间的方式导出
/*
    ts 5.0+++新规范如果你只用到了类型而没有访问值
    强烈推荐你在 import 时加上 type，这样编译器可以更好地做类型擦除优化。
*/
//接口类型定义
//接口很多 有用户角色部门 所以用命名空间的方式导出
/*
    ts 5.0+++新规范如果你只用到了类型而没有访问值
    强烈推荐你在 import 时加上 type，这样编译器可以更好地做类型擦除优化。
*/
//import type { AxiosRequestConfig } from 'axios'

import type DashBoard from '@/views/dashboard'

//给请求拦截器config多配置一个属性 option可以局部控制加载Loading
declare module 'axios' {
  interface AxiosRequestConfig {
    showLoading?: boolean
    showError?: boolean
  }
}
//原理
// interface A {
//   name: string
// }
// interface A {
//   age: number
// }
// const user: A = {
//   name: 'jack',
//   age: 16
// }
//namespace 命名空间可以隔离里面的类型 名字不会重复
export interface Result<T = any> {
  code: number
  data: T
  msg: string
}
export interface ResultData<T = any> {
  list: T[]
  page: {
    pageNum: number
    pageSize: number
    total: number | 0
  }
}
export interface PageParams {
  pageNum: number
  pageSize?: number
}
export namespace Login {
  export interface LoginResponse {
    token: string
  }
  export interface params {
    userName: string
    userPwd: string
  }
}
export namespace User {
  export interface Params extends PageParams {
    userId?: number
    userName?: string
    state?: number
  }
  export interface UserItem {
    create: number
    deptId: string
    deptName: string
    role: number
    mobile: string
    job: string
    roleList: string
    state: number
    userEmail: string
    userId: number
    userImg: string
    userName: string
    _id: string
  }
  export interface CreateParams {
    userName: string
    userEmail: string
    mobile?: number
    deptId: string
    job?: string
    state?: string
    roleList: string[]
    userImg: string
  }
  export interface EditParams {
    userId: number
    userName: string
    userEmail: string
    mobile?: number
    deptId: string
    job?: string
    state?: string
    roleList: string[]
    userImg: string
  }
}
//部门管理
export namespace Dept {
  export interface CreateParams{
    deptName:string
    parentId?:string
    userName:string
  }
  export interface EditParams extends CreateParams{
    _id:string
  }
  export interface DelParams{
    _id:string
  }
  export interface Params {
    deptName?: string
  }
  export interface DeptItem {
    _id: string
    createTime: string
    updateTime: string
    deptName: string
    parentId: string
    userName: string
    children: DeptItem[]
  }
}
export namespace Menu{
  export interface Params{
      menuName:string
      menuState:number
  }
  export interface CreateParams{
    menuName:string//菜单名称
    icon?:string//菜单图标
    menuType:number //1:菜单2.按钮3.页面
    menuState:number//1.正常2.停用
    menuCode?:string//按钮权限标识
    parentId?:string//父级菜单ID
    path?:string//菜单路径
    component?:string//组件名称
    orderBy:number
  }
  export interface MenuItem extends CreateParams{
    _id:string
    createTime:string
    button?:MenuItem[]
    children:MenuItem[]
  }
  export interface EditParams extends CreateParams{
    _id:string
  }
  export interface DelParams{
    _id:string
  }
}
export namespace DashBoard {
  export interface ReportData {
    driverCount: number
    totalmoney: number
    orderCount: number
    cityNum: number
  }
  export interface LineData {
    label: string[]
    order: number[]
    money: number[]
  }
  export interface PieData {
    value: number
    name: string
  }
  export interface RadarData {
    indicator: Array<{ name: string; max: number }>
    data: {
      name: string
      value: number[]
    }
  }
}
export namespace Role{
  export interface Params extends PageParams{
    roleName?:string
  }
  export interface CreateParams {
    roleName: string
    remark?: string
  }
  export interface RoleItem extends CreateParams {
    _id: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
    updateTime: string
    createTime: string
  }
  export interface Permission{
     _id: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
  }
  export interface EditParams extends CreateParams{
    _id:string
  }
}
export namespace Order {
  export enum IState {
    doing = 1,
    done = 2,
    timeout = 3,
    cance = 4
  }

  export interface CreateParams {
    cityName: string
    userName: string
    mobile: number
    startAddress: string //下单开始地址
    endAddress: string //下单结束地址
    orderAmount: number //订单金额
    userPayAmount: number //支付金额
    driverAmount: number //支付金额
    // 1: 微信 2：支付宝
    payType: number //支付方式
    driverName: string //司机名称
    vehicleName: string //订单车型
    // 1: 进行中 2：已完成 3：超时 4：取消
    state: IState // 订单状态
    // 用车时间
    useTime: string
    // 订单结束时间
    endTime: string
  }

  export interface OrderItem extends CreateParams {
    _id: string
    orderId: string //订单ID
    route: Array<{ lng: string; lat: string }> //行驶轨迹
    createTime: string //创建时间
    remark: string //备注
  }

  export interface SearchParams {
    orderId?: string
    userName?: string
    state?: IState
  }
  export interface Params extends PageParams {
    orderId?: string
    userName?: string
    state?: IState
  }
  //字典城市列表
  export interface DictItem {
    id: string
    name: string
  }
  export interface OrderRoute {
    orderId: string //订单ID
    route: Array<{ lng: string; lat: string }>
  }
  export interface DriverParams {
    driverName?: string
    accountStatus?: number
  }
  export enum DriverStatus {
    auth = 0, // 待认证
    normal = 1, //正常
    temp = 2, // 暂时拉黑
    always = 3, // 永久拉黑
    stop = 4 //停止推送
  }
  export interface DriverItem {
    driverName: string // 司机名称
    driverId: number // 司机ID
    driverPhone: string // 司机手机号
    cityName: string // 城市名称
    grade: boolean // 会员等级
    driverLevel: number // 司机等级
    accountStatus: DriverStatus // 司机状态
    carNo: string // 车牌号
    vehicleBrand: string // 车辆品牌
    vehicleName: string // 车辆名称
    onlineTime: number // 昨日在线时长
    driverAmount: number // 昨日司机流水
    rating: number // 司机评分
    driverScore: number // 司机行为分
    pushOrderCount: number // 昨日推单数
    orderCompleteCount: number // 昨日完单数
    createTime: string // 创建时间
  }
}
