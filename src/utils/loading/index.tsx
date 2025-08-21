import ReactDom from 'react-dom/client'
import Loading from './Loading'
import './loading.less'
let count = 0
// export const showLoading = () => {
//   if (count === 0) {
//     const loading = document.createElement('div')
//     loading.setAttribute('id', 'loading')
//     ReactDom.createRoot(loading).render(<Loading />)
//   }
//   count++
// }
// export const hideLodaing = () => {
//   if (count <= 0) return
//   count--
//   if (count === 0) {
//     const el = document.getElementById('loading')
//     el && document.body.removeChild(el)
//   }
// }
export const showLoading = () => {
  if (count === 0) {
    const loading = document.getElementById('loading')
    loading?.style.setProperty('display', 'flex')
  }
  count++
}
export const hideLoading = () => {
  count--
  if (count === 0) {
    const loading = document.getElementById('loading')
    loading?.style.setProperty('display', 'none')
  }
}
