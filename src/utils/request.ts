//import { message } from 'antd'
import axios, { AxiosError } from 'axios'
import { hideLoading, showLoading } from './loading'
import storage from './storage'
import env from '@/config'
import type { Result } from '@/types/api'
import { message } from './AntdGlobal'
console.log('config', env)
console.log('import.meta.env', import.meta.env)
// 创建 Axios 实例，配置基础设置
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // 接口公共路径前缀
  timeout: 8000, // 请求超时时间 8 秒
  timeoutErrorMessage: '请求超时，请稍后再试',
  withCredentials: false // 是否携带 cookie
})

// 📥 请求拦截器：为每个请求统一加上 token（如果存在）
instance.interceptors.request.use(
  config => {
    // console.log('config', config)
    if (config.showLoading) {
      showLoading()
    }
    const token = storage.get('token')
    if (token) {
      config.headers.Authorization =  token
      config.headers.icode = 'lcy'
    }

    if (env.mock) {
      config.baseURL = env.mockApi
    } else {
      config.baseURL = env.baseApi
    }
    return { ...config }
  },
  (error: AxiosError) => {
    // 请求发送失败
    return Promise.reject(error)
  }
)

// 📤 响应拦截器：统一处理接口响应逻辑
instance.interceptors.response.use(
  response => {
    hideLoading()
    if(response.config.responseType==='blob') return response
    const data: Result = response.data
    //data不指定类型无法用 data. 去提示关键词
    if (data.code === 500001) {
      // 登录失效
      console.log(' sadaddw', data.msg)
      message.error(data.msg || '身份已过期，请重新登录')
      storage.remove('token')
      location.href = '/login?callback=' + encodeURIComponent(location.href)
      return Promise.reject(data)
    } else if (data.code !== 0) {
      if (response.config.showError === false) {
        return Promise.reject(data)
      } else {
        // 业务错误
        message.error(data.msg || '请求错误，请稍后重试')
        return Promise.reject(data)
      }
    }
    return data.data // 成功，返回真正业务数据
  },
  (error: AxiosError) => {
    // 网络错误 / 状态码非 2xx
    hideLoading()
    message.error(error.message || '服务器异常，请稍后重试')
    return Promise.reject(error)
  }
)
interface IConfig {
  showLoading?: boolean
  showError?: boolean
}
// 封装统一的 get/post 方法，并暴露
export default {
  get<T>(
    url: string,
    params?: object,
    options: IConfig = { showLoading: true, showError: true }
  ): Promise<T> {
    return instance.get(url, { params, ...options })
  },
  post<T>(
    url: string,
    params?: object,
    options: IConfig = { showLoading: true, showError: true }
  ): Promise<T> {
    return instance.post(url, params, options)
  },
  // 如果未来需要，可以继续添加 put、delete 等方法
  downloadFile(url: string, data: any, fileName = 'fileName.xlsx') {
    instance({
      url,
      data,
      method: 'post',
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data], {
        type: response.data.type
      })
      const name = (response.headers['file-name'] as string) || fileName
      const link = document.createElement('a')
      link.download = decodeURIComponent(name)
      link.href = URL.createObjectURL(blob)
      document.body.append(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    })
  }
}
