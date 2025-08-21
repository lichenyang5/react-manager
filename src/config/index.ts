/*
  环境配置封装
*/
type ENV = 'stag' | 'prd' | 'dev'

const env = (document.documentElement.dataset.env as ENV) || 'stg'
const config = {
  dev: {
    baseApi: '/api',
    uploadApi: 'http://api-driver-dev.marsview.cc',
    cdn: 'http://xxx.aliyun.com',
    mock: false,
    mockApi: 'http://localhost:3000/mock'
  },
  stag: {
    baseApi: '/api',
    uploadApi: 'http://api-driver-dev.marsview.cc',
    cdn: 'http://xxx.aliyun.com',
    mock: true,
    mockApi: 'http://localhost:3000/mock'
  },
  prd: {
    baseApi: '/api',
    uploadApi: 'http://api-driver-dev.marsview.cc',
    cdn: 'http://xxx.aliyun.com',
    mock: true,
    mockApi: 'http://localhost:3000/mock'
  }
}
export default {
  env,
  ...config[env]
}
// let env :ENV ='dev'
// if(location.host==='localhost:8080'){
//   env='dev'
// }else if(location.host ==='driver-svg.marsview.cc'){
//   env='stag'
// }else{
//   env='prd'
// }
