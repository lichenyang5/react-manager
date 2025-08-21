axios.interceptors.request.use 是 Axios 提供的 API，用来设置请求发出前的统一处理逻辑。
它接收两个回调函数，第一个是处理请求体 config 的，我们通常在这里加上 token、显示 loading，处理完之后必须返回 config 否则请求会被中断。
第二个是请求配置阶段发生错误时的处理函数，比如拦截器中抛出异常，这个函数里我们一般把错误通过 Promise.reject 抛出去，供 .catch 捕获使用。
Axios 的响应拦截器也接收两个回调函数，第一个是响应成功时调用，它的参数是 response，从中我们可以提取 response.data，然后判断自定义的 code 字段，来决定是 token 过期、业务出错还是成功。如果 token 过期或失败，会弹出错误提示，并通过 Promise.reject 抛出错误。
第二个回调函数是响应失败（如网络错误、404、500）时触发的，我们可以统一显示“服务器异常”等提示，也用 Promise.reject 抛出错误，供组件用 .catch() 捕获。
后端返回的 data 结构通常如下：
{
"code": 0,
"msg": "成功",
"data": { "userInfo": { ... } }
}
/_
当我们从其他页面退出到登录页面，登录页面地址栏会拼callback参数 -会记住当前页面的地址 在此登录就会回到那个页面 -或者token失效跳转到登录页面 也会保存退出前当前的页面
为了记住那个参数 我们用location.search 可以获取到地址栏后面的拼接字符串（参数的值）
然后const params = new URLSearchParams(location.search) 就可以拿到一个路径
用 params.get('callback')获取到 退出前页面的地址
登录页的 URL 携带一个 callback 或 redirect 参数，登录成功后用它跳回原来的页面
_/
// const params = new URLSearchParams(location.search)
// location.href = params.get('callback') || '/welcome'
当我们之间使用antd中的message会报错。我们需要在跟组件App组件引入App as AntdApp 1.用App组件包裹
export default function App() {
return (
<ConfigProvider theme={{ token: { colorPrimary: 'red' } }}>
<AntdApp>
<RouterProvider router={router} />
</AntdApp>
</ConfigProvider>
)用AntdApp包裹2.子组件获取message对象 从App.useApp()中
const { message } = App.useApp()
然后 messafge.info(' shied')就可以使用提示框
---这里请求拦截器中的message也会报错但是它不是函数组件无法用上面的方法use.App()获取message对象
根据antd文档
创建一个AntdGloal文件里面粘贴
// Entry component
import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

export default () => {
const staticFunction = App.useApp();
message = staticFunction.message;
modal = staticFunction.modal;
notification = staticFunction.notification;
return null;
};

export { message, notification, modal };
然后在根组件调用一下
return (
<ConfigProvider theme={{ token: { colorPrimary: 'red' } }}>
<AntdApp>
<AntdGlobal />
<RouterProvider router={router} />
</AntdApp>
</ConfigProvider>
)
然后就可以在封装请求中引用
import { message } from './AntdGlobal' 然后不会报错
监听一个节点的属性变化以及复原
// useEffect(() => {
// const targetNode = document.getElementById('content') as HTMLDivElement
// const observer = new MutationObserver(function (mutationList, observer) {
// console.log(' ', mutationList, observer)
// console.log(' 发送变化 了')

// for (const mutation of mutationList) {
// if (mutation.type === 'childList') {
// const span = document.createElement('span')
// span.innerText = 'Hello React'
// targetNode.appendChild(span)
// }
// }
// })
// const config = {
// attributes: true,
// childList: true,
// subtree: true
// }
// observer.observe(targetNode, config)
// return () => {
// observer.disconnect()
// }
// }, [])
//退出之后返回到登录页面然后登录再次返回到登录页面原理
encodeURIComponent(location.href)
'http%3A%2F%2Flocalhost%3A8080%2Flogin%3Fcallback%3Dhttp%253A%252F%252Flocalhost%253A8080%252Fwelcome'
const a = '/login?callback='+encodeURIComponent(location.href)
undefined
a
'/login?callback=http%3A%2F%2Flocalhost%3A8080%2Flogin%3Fcallback%3Dhttp%253A%252F%252Flocalhost%253A8080%252Fwelcome'
location.search
'?callback=http%3A%2F%2Flocalhost%3A8080%2Fwelcome'
const b = new URLSearchParams(location.search)
undefined
b
URLSearchParams {size: 1}
const c = b.get('callback')
undefined
c
'http://localhost:8080/welcome'
location.href=c
