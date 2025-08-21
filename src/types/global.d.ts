
import type { AxiosRequestConfig } from 'axios'

//导入模块不然会覆盖掉之前的Axios 拦截器会丢失
//给请求拦截器config多配置一个属性 option可以局部控制加载Loading
declare module 'axios' {
  interface AxiosRequestConfig {
    showLoading?: boolean
    showError?: boolean
  }
}
// /*
//   类型声明declare的使用
//     给没有类型定义的模块 变量添加声明类型 一般用xxx.d.ts定义文件建议在src
//     下面创建声明文件
//   .d.ts与.ts区别
//     .ts需要导入 局部声明的类型定义
//     .d.ts是全局的不需要导入
// */
// //例子 给Window对象扩展字段
// declare global {
//   interface Window {
//     app: string
//   }
// }

