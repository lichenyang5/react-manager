import React, { useEffect, useState } from 'react'
import styles from './index.module.less'
import { Button, Card, Descriptions } from 'antd'
import store, { useStore } from '@/store'
import { formatMoney, formatState } from '@/utils'
import api from '@/api/index'
import type { DashBoard } from '@/types/api'
import { useCharts } from '@/hook/useCharts'
/*
  创建好图表要用的容器div 节点设置id属性
  用线性图表首先安装 npm install echarts
*/
export default function DashBoard() {
  const userInfo = useStore(state => state.userInfo)
  const [report, setReport] = useState<DashBoard.ReportData>()
  //初始化折线图
  const [lineRef, lineChart] = useCharts()
  //饼图
  const [pieRef1, pieChart1] = useCharts()
  const [pieRef2, pieChart2] = useCharts()
  //雷达图
  const [radarRef, radarChart] = useCharts()
  useEffect(() => {
    //获取线图实例
    //配置线图
    renderLineChart()
    //获取饼图实例1
    renderPieChart1()
    //获取饼图实例2
    renderPieChart2()
    //获取雷达图
    renderRadarChart()
  }, [lineChart, pieChart1, pieChart2, radarChart])
  //加载折线图数据
  const renderLineChart = async () => {
    if (!lineChart) return
    const data = await api.getLineData()
    lineChart?.setOption({
      // title: {
      //   text: '订单和流水走势图'
      // },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['订单', '流水'],
        top: 30
      },
      grid: {
        left: 50,
        right: 50,
        bottom: 20
      },
      xAxis: {
        data: data.label
      },
      yAxis: {
        type: 'value' //数据轴
      },
      series: [
        {
          name: '订单',
          type: 'line',
          data: data.order
        },
        {
          name: '流水',
          type: 'line',
          data: data.money
        }
      ]
    })
  }
  //加载饼图数据1
  const renderPieChart1 = async () => {
    if (!pieChart1) return
    const data = await api.getPieCityData()
    pieChart1?.setOption({
      title: {
        text: '司机城市分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical', //垂直方向剧中
        left: 'left' //左
      },
      series: [
        {
          name: '城市分布',
          type: 'pie',
          radius: '50%',
          data: data
        }
      ]
    })
  }
  //加载饼图数据2
  const renderPieChart2 = async () => {
    if (!pieChart2) return
    const data = await api.getPieAgeData()
    pieChart2?.setOption({
      title: {
        text: '司机年龄分布',
        left: 'center',
        top: 0
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical', //垂直方向剧中
        left: 'left' //左
      },
      series: [
        {
          name: '年龄分布',
          type: 'pie',
          radius: [50, 180],
          roseType: 'radious',
          data: data
        }
      ]
    })
  }
  //加载雷达图
  const renderRadarChart = async () => {
    if (!radarChart) return
    const data = await api.getRadarData()
    radarChart?.setOption({
      // title: {
      //   text: '司机模型诊断',
      //   left: 'center'
      // },
      legend: {
        data: ['司机模型诊断']
      },
      radar: {
        indicator: data.indicator
      },
      series: [
        {
          name: '司机模型诊断',
          type: 'radar',
          data: data.data
        }
      ]
    })
  }
  useEffect(() => {
    getReportData()
  }, [])
  const getReportData = async () => {
    const data = await api.getReportData()
    //console.log('工作台数据data ', data)
    setReport(data)
  }
  //饼图刷新
  const handleRefresh = () => {
    ;(renderPieChart1(), renderPieChart2())
  }
  return (
    <div className={styles.dashboard}>
      <div className={styles.userInfo}>
        <img
          src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          alt=''
          className={styles.userImg}
        />
        <Descriptions title='欢迎新同学，每天都要起飞'>
          <Descriptions.Item label='用户ID'>
            {userInfo.userId}
          </Descriptions.Item>
          <Descriptions.Item label='邮箱'>
            {userInfo.userEmail}
          </Descriptions.Item>
          <Descriptions.Item label='状态'>
            {formatState(userInfo.state)}
          </Descriptions.Item>
          <Descriptions.Item label='手机号'>
            {userInfo.mobile}
          </Descriptions.Item>
          <Descriptions.Item label='岗位'>
            {store.userInfo.job}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.report}>
        <div className={styles.card}>
          <div className={styles.title}>司机数量</div>
          <div className={styles.data}>{report?.driverCount}个</div>
        </div>
        <div className={styles.card}>
          <div className={styles.title}>总流水</div>
          <div className={styles.data}>{formatMoney(report?.totalmoney)}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.tltle}>总订单</div>
          <div className={styles.data}>{report?.orderCount}单</div>
        </div>
        <div className={styles.card}>
          <div className={styles.title}>开通城市</div>
          <div className={styles.data}>{report?.cityNum}</div>
        </div>
      </div>
      <div className={styles.chart}>
        <Card
          title='订单流水走势图'
          extra={
            <Button type='primary' onClick={renderLineChart}>
              刷新
            </Button>
          }
        >
          <div ref={lineRef} className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title='司机分配'
          extra={
            <Button type='primary' onClick={handleRefresh}>
              刷新
            </Button>
          }
        >
          <div className={styles.pieChart}>
            <div ref={pieRef1} className={styles.itemChart}></div>
            <div ref={pieRef2} className={styles.itemChart}></div>
          </div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title='模型诊断'
          extra={
            <Button type='primary' onClick={renderRadarChart}>
              刷新
            </Button>
          }
        >
          <div ref={radarRef} className={styles.itemChart}></div>
        </Card>
      </div>
    </div>
  )
}
