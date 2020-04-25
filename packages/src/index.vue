<!--
 * @Author: dengyue.wang
 * @Date: 2020-04-21 09:01:32
 * @LastEditors: dengyue.wang
 * @LastEditTime: 2020-04-22 15:44:04
 -->
<template>
  <div class="pulse-report-render" :style="calWebStyle">
    <!-- <remote-js src="./vue-grid-layout.umd.min.js"></remote-js> -->
    <grid-layout :layout.sync="calChartGridLayout" :col-num="48" :row-height="rowHeight" :is-draggable="false" :is-resizable="false" :is-mirrored="false" :vertical-compact="false" :margin="[0,0]" :use-css-transforms="true">
      <grid-item v-for="item in calReportData" :key="item.chartGrid.i" :x="item.chartGrid.x" :y="item.chartGrid.y" :w="item.chartGrid.w" :h="item.chartGrid.h" :i="item.chartGrid.i">
        <div class="vue-grid-item-wrap">
          <h3 class="chart-chapter" v-text="item.chart_chapter"></h3>
          <component :is="calChapterType(item)" :options="item.chart_option" :autoresize="true" :aspectRatio="item.chartAspectRatio" :style="calComponentStyle(item.chart_chapter)"></component>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout';

import PulseEcharts from '../components/PulseEcharts.vue'
import PulseTable from '../components/PulseTable.vue'
import PulseMarkdown from '../components/PulseMarkdown.vue'

export default {
  name: "ReportRender",
  props: {
    reportData: {
      type: Object,
      default: () => { }
    }
  },
  components: {

    // 'remote-js': {
    //   render (createElement) {
    //     return createElement('script', { attrs: { type: 'text/javascript', src: this.src } });
    //   },
    //   props: {
    //     src: { type: String, required: true },
    //   }
    // },
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    PulseEcharts,
    PulseTable,
    PulseMarkdown
  },
  data () {
    return {
      rowHeight: 10
    }
  },
  methods: {
    /**
     * @description: 画布样式
     * @param {type} 
     * @return: 
     */
    calWebStyle () {
      return {

      }
    },

    /**
     * @description: 组件样式
     * @param {chart_chapter} 标题
     * @return: 
     */
    calComponentStyle (chart_chapter) {
      let height = "100%"
      if (chart_chapter) {
        height = "calc(100% - 30px)"
      }
      return {
        height: height
      }
    },
    /**
       * @description: 组件类型
       * @param {item} 单个chart
       * @return: 
       */
    calChapterType (item) {
      const obj = {
        'table': 'PulseTable',//表格
        'markdown': 'PulseMarkdown', //markdown
        'echarts': 'PulseEcharts',  //echarts
        'tableau': 'PulseTableau',  //tableau
      }
      return obj[item.chart_type]
    },
    /**
   * @description: 窗口大小改变，重新渲染画布行高
   * @return: 
   */
    calcRowHeight () {
      const box = document.querySelector(".pulse-report-render")
      const viewLayoutHeight = this.calReportData && this.calReportData.viewLayout && this.calReportData.viewLayout.height || 675
      let rowHeight = 10
      if (box && box.clientHeight) {
        // console.log(box.clientHeight);
        rowHeight = 10 * box.clientHeight / viewLayoutHeight
      }
      this.rowHeight = rowHeight
    }
  },
  computed: {
    /**
     * @description: grid 布局样式
     * @return: 
     */
    calChartGridLayout () {
      return this.reportData && this.reportData.charts.map(i => i.chartGrid) || []
    },
    /**
     * @description: chart个数
     * @return: 
     */
    calReportData () {
      return this.reportData && this.reportData.charts || []
    }
  },
  created () {

  },
  updated () {

  },
  mounted () {
    this.calcRowHeight()
    window.addEventListener("resize", this.calcRowHeight);
  },
  destroyed () {
    window.removeEventListener("resize", this.calcRowHeight);
  },
  activated () {

  },
  watch: {
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.pulse-report-render {
  width: 100%;
  height: 100%;
  border: 1px solid #939799;
  overflow: auto;
  .vue-grid-layout {
    .vue-grid-item {
      .vue-grid-item-wrap {
        position: relative;
        height: 100%;
        border: 1px solid #939799;
        &.vue-grid-item-wrap--active {
          border-color: #00bcbc;
        }
        .chart-chapter {
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>