import  * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'
export const useCharts=():[
   React.RefObject<HTMLDivElement|null>,
   echarts.ECharts | undefined
]=>{
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartInstance,setChartInstance] = useState<echarts.EChartsType>()
  useEffect(()=>{
   const chart = echarts.init(chartRef.current as HTMLElement)
    setChartInstance(chart)
  },[])
  return [chartRef,chartInstance]
}
/*
  封装useChart 解决了 需要用document.getElementById()获取dom元素
  然后 const instance = new echarts.init(dom节点 as HTMLELement) 获取实例
  省了这两步
*/
