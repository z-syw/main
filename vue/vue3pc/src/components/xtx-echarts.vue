<template>
  <div id="main" style="width: 600px;height:400px;"></div>
</template>

<script setup>
import {
  GridComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { onMounted } from 'vue'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

onMounted(() => {
  const chartDom = document.getElementById('main')
  const myChart = echarts.init(chartDom)
  const option = {
    // 标题
    title: {
      text: '标题',
      textStyle: {
        color: 'red',
        fontSize: 20
      }
    },
    // 提示框
    tooltip: {
      trigger: 'axis' // 触发方式
    },
    // 图例
    legend: {
      // data中的数据标识，最好和数据项series对应
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    // 绘图网格
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true // 绘图网格是否包含网格
    },
    // 工具盒子
    toolbox: {
      feature: {
        saveAsImage: {} // 是否保存成图片
      }
    },
    // x轴
    xAxis: {
      type: 'category', // 离散型刻度
      boundaryGap: true,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    // y轴
    yAxis: {
      type: 'value' // 值类型刻度
    },
    color: ['red', 'pink', 'orange', 'skyblue', 'hotpink'],
    // 数据项
    series: [
      {
        name: 'Email',
        type: 'bar', // 通过type控制图表
        // stack: 'Total', // 数据是否堆叠
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'bar',
        // stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'bar',
        // stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        type: 'bar',
        // stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        // stack: 'Total',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  }
  myChart.setOption(option)
})
</script>
