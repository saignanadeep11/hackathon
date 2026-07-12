<template>
  <div class="echart-container" style="width: 100%; height: 100%; min-height: 220px; overflow: hidden;">
    <v-chart class="chart" :option="chartOptions" autoresize />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';

// Register ECharts modules
use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);

const props = withDefaults(defineProps<{
  seriesData: number[];
  categories: string[];
  height?: string | number;
}>(), {
  height: 220
});

const chartOptions = computed(() => ({
  backgroundColor: 'transparent',
  grid: {
    top: '12%',
    left: '1%',
    right: '1%',
    bottom: '4%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: props.categories,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#64748b',
      fontSize: 12,
      fontFamily: 'Outfit, sans-serif',
      margin: 12,
    },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.06)',
        type: 'dashed',
      },
    },
    axisLabel: {
      color: '#64748b',
      fontSize: 12,
      fontFamily: 'Outfit, sans-serif',
    },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#1e293b',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textStyle: {
      color: '#fff',
      fontFamily: 'Outfit, sans-serif',
    },
    axisPointer: {
      type: 'shadow',
    },
    formatter: (params: unknown) => {
      const list = params as Array<{ name: string; value: number }>;
      if (!list || list.length === 0 || !list[0]) {
        return '';
      }
      const item = list[0];
      return `
        <div style="padding: 4px 8px; font-family: Outfit, sans-serif;">
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">${item.name}</div>
          <div style="font-weight: bold; font-size: 14px; color: #fff;">${item.value}%</div>
        </div>
      `;
    }
  },
  series: [
    {
      data: props.seriesData,
      type: 'bar',
      barWidth: '55%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#818cf8' },      // Start color (indigo)
            { offset: 1, color: 'rgba(59, 130, 246, 0.15)' } // End color (faded blue)
          ]
        }
      },
    },
  ],
}));
</script>

<style scoped>
.echart-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
