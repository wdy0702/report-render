<!--
 * @Author: dengyue.wang
 * @Date: 2020-04-21 09:01:32
 * @LastEditors: dengyue.wang
 * @LastEditTime: 2020-05-13 15:26:40
 -->
<template>
  <div id="pulse-report-render" class="pulse-report-render" :style="calWebStyle">
    <grid-layout :layout.sync="calChartGridLayout" :col-num="48" :row-height="10" :is-draggable="false" :is-resizable="false" :is-mirrored="false" :vertical-compact="false" :margin="[3,3]" :use-css-transforms="true">
      <grid-item v-for="item in calReportData" :key="item.chartGrid.i" :x="item.chartGrid.x" :y="item.chartGrid.y" :w="item.chartGrid.w" :h="item.chartGrid.h" :i="item.chartGrid.i">
        <div class="vue-grid-item-wrap">
          <h3 class="chart-chapter" v-text="item.chart_chapter"></h3>

          <component v-if="item.chart_sub_type && !Array.isArray(item.child)" :is="calChapterType(item)" :options="item.chart_option" :styleObj="item.style" :autoresize="true" :aspectRatio="item.chart_aspect_ratio" :style="calComponentStyle(item.chart_chapter)"></component>
          <!-- 选项卡组件 -->
          <div class="tab" :style="calComponentStyle(item.child[0].chart_chapter)" v-if="item.chart_sub_type && Array.isArray(item.child) && item.child.length > 0">
            <!-- 选项卡-标题-->
            <ul class="tab-header">
              <li v-for="(unit,idx) in item.child" :key="`${idx}_${unit.chart_index}`" class="tab-header__item" :class="{'tab-header__item--active':unit.active}">
                <h4 class="item-title" v-text="unit.chart_sub_title" @click="toogleTab(item.child,unit)"></h4>
              </li>
            </ul>
            <!-- 选项卡-body -->
            <div class="tab-body">
              <div class="chapter-inner">
                <div v-for="(unit,idx) in calTabsBody(item.child)" :key="`${idx}_${unit.chart_index}`" v-show="unit.active" class="chart-wrap">
                  <!-- chart -->
                  <component :is="calChapterType(unit)" :options="unit.chart_option" :styleObj="unit.style" :autoresize="true" :aspectRatio="unit.chart_aspect_ratio" @legendselectchanged="handleToggleLegend"></component>
                </div>
              </div>
            </div>
          </div>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout';
import watermark from 'watermark-dom'
import PulseEcharts from '../components/PulseEcharts.vue'
import PulseTable from '../components/PulseTable.vue'
import PulseMarkdown from '../components/PulseMarkdown.vue'

export default {
  name: "ReportRender",
  props: {
    reportData: {
      type: Object,
      default: () => ({})
    },
    watermarkData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    PulseEcharts,
    PulseTable,
    PulseMarkdown
  },
  data () {
    return {
      rowHeight: 10,
      chapterList: []
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
   * @description: 切换tab
   * @return: 
   */
    toogleTab (tabs, item) {
      event.stopPropagation()

      tabs.forEach(i => i.active = false)
      item.active = true
      this.$forceUpdate()
    },
    /**
    * @description: 真实的chart才显示
    * @return: 
    */
    calTabsBody (tabs) {
      return tabs.filter(i => i.chart_sub_type)
    },
    handleToggleLegend () {
      event.stopPropagation()
    },
    /**
* @description: 初始化水印
* @return: 
*/
    initWatermark () {
      if (this.watermarkData && this.watermarkData.watermark_show && this.watermarkData.watermark_txt) {
        console.log(`当前水印内容%c:${this.watermarkData.watermark_txt}`, "color:#00bcbc;font-weight:bold;");

        watermark.init(Object.assign({}, {
          watermark_txt: "",
          watermark_id: 'report-render-watermark',           //水印的内容
          watermark_x: 0,                //水印起始位置x轴坐标
          watermark_y: 0,                //水印起始位置Y轴坐标
          watermark_x_space: 0,          //水印x轴间隔
          watermark_y_space: 0,          //水印y轴间隔
          watermark_font: "Blue Sky Standard Regular,Noto Sans CJK SC Regular,Noto Sans SC Regular,sans-serif",   //水印字体
          watermark_color: '#54585a',    //水印字体颜色
          watermark_fontsize: '14px',    //水印字体大小
          watermark_alpha: 0.15,         //水印透明度，要求设置在大于等于0.005
          watermark_width: 300,          //水印宽度
          watermark_height: 200,         //水印长度
          watermark_angle: 30,            //水印倾斜度数
          watermark_parent_node: "pulse-report-render",
          monitor: false
        }, this.watermarkData))
      }
    },
    /**
    * @description: 移除水印
    * @return: 
    */
    removeWatermark () {
      if (!document.querySelector("#report-render-watermark")) {
        return
      }
      watermark.remove()
    }
  },
  computed: {
    /**
     * @description: grid 布局样式
     * @return: 
     */
    calChartGridLayout () {
      return this.calReportData && this.calReportData.map(i => i.chartGrid) || []
    },
    /**
    * @description: charts
    * @return: 
    */
    calReportData () {
      let charts = this.reportData && Array.isArray(this.reportData.charts) && this.reportData.charts.filter(i => i.chart_sub_type) || []
      let result = []
      charts.forEach(item => {
        let cur = result.find(i => i.chart_chapter_index === item.chart_chapter_index)

        if (cur) {
          if (!cur.hasOwnProperty("child")) { cur.child = [JSON.parse(JSON.stringify(cur))] }
          cur.child.push(item)
        } else {
          result.push(item)
        }
      })
      result.forEach(item => {
        if (Array.isArray(item.child) && item.child.length > 0) {
          item.child.sort((a, b) => a.chart_index - b.chart_index)
          item.child.forEach(unit => unit.active = false)
          item.child[0].active = true
        }
      })
      return result
    },
  },
  created () {

  },
  updated () {

  },
  mounted () {
  },
  destroyed () {
    this.removeWatermark()
  },
  activated () {
    this.initWatermark()
  },
  deactivated () {
    this.removeWatermark()
  },
  watch: {
    watermarkData: {
      handler (newName, oldName) {
        this.initWatermark()
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="css" type="text/css" scoped>
#pulse-report-render {
  width: 100%;
  overflow: auto;
}

#pulse-report-render * {
  margin: 0;
  padding: 0;
}

#pulse-report-render li {
  list-style: none;
}

#pulse-report-render /deep/ table a {
  text-decoration: none;
  color: inherit;
}

#pulse-report-render .vue-grid-layout .vue-grid-item {
  overflow: auto;
}

#pulse-report-render .vue-grid-layout .vue-grid-item .vue-grid-item-wrap {
  position: relative;
  height: 100%;
}

#pulse-report-render
  .vue-grid-layout
  .vue-grid-item
  .vue-grid-item-wrap
  .chart-chapter {
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#pulse-report-render
  .vue-grid-layout
  .vue-grid-item
  .vue-grid-item-wrap
  .tab
  .tab-header {
  display: flex;
  flex-wrap: wrap;
  padding: 4px 0;
  font-size: 12px;
  line-height: 20px;
}

#pulse-report-render
  .vue-grid-layout
  .vue-grid-item
  .vue-grid-item-wrap
  .tab
  .tab-header
  .tab-header__item {
  position: relative;
  padding: 0 10px;
  margin: 0 20px 10px 0;
  background: #fafafa;
  border: 1px solid #fafafa;
  color: #54585a;
  border-radius: 3px;
  transition: all 0.3s;
}

#pulse-report-render
  .vue-grid-layout
  .vue-grid-item
  .vue-grid-item-wrap
  .tab
  .tab-header
  .tab-header__item
  .item-title {
  font-size: 12px;
  cursor: pointer;
  font-size: 12px;
}

#pulse-report-render
  .vue-grid-layout
  .vue-grid-item
  .vue-grid-item-wrap
  .tab
  .tab-header
  .tab-header__item
  .item-icon {
  position: absolute;
  visibility: hidden;
  font-size: 18px;
  cursor: pointer;
  color: rgba(0, 15, 22, 0.5);
  transition: all 0.3s;
}

#pulse-report-render
  .vue-grid-layout
  .vue-grid-item
  .vue-grid-item-wrap
  .tab
  .tab-header
  .tab-header__item
  .item-icon:hover {
  color: #00bcbc;
}

#pulse-report-render
  .vue-grid-layout
  .vue-grid-item
  .vue-grid-item-wrap
  .tab
  .tab-header
  .tab-header__item.tab-header__item--active {
  border-color: #00bcbc;
}

#pulse-report-render
  .vue-grid-layout
  .vue-grid-item
  .vue-grid-item-wrap
  .tab
  .tab-body {
  height: calc(100% - 40px);
}

#pulse-report-render
  .vue-grid-layout
  .vue-grid-item
  .vue-grid-item-wrap
  .tab
  .tab-body
  .chapter-inner {
  height: 100%;
}

#pulse-report-render
  .vue-grid-layout
  .vue-grid-item
  .vue-grid-item-wrap
  .tab
  .tab-body
  .chapter-inner
  .chart-wrap {
  height: 100%;
}
</style>