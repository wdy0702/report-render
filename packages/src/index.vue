<!--
 * @Author: dengyue.wang
 * @Date: 2020-04-21 09:01:32
 * @LastEditors: dengyue.wang
 * @LastEditTime: 2020-08-21 10:01:11
 -->
<template>
  <div id="pulse-report-render" class="pulse-report-render" :style="calWebStyle">
    <!-- 栏目sheet -->
    <div class="sheet" v-if="reportData && reportData.chart_chapter_collapsible">
      <pulse-tab :options="columnList" v-model="activeColumn"></pulse-tab>
    </div>
    <grid-layout id="vue-grid-layout" :layout.sync="calChartGridLayout" :col-num="48" :row-height="10" :is-draggable="false" :is-resizable="false" :is-mirrored="false" :vertical-compact="false" :margin="[3,3]" :use-css-transforms="true" @layout-ready="handleGridlayoutReady">
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
import PulseTab from '../components/PulseTab.vue'

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
    PulseMarkdown,
    PulseTab
  },
  data () {
    return {
      rowHeight: 10,
      chapterList: [],
      isMounted: false,
      activeColumn: "",
      columnList: [
      ]
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
          watermark_parent_node: "vue-grid-layout",
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
    },
    /**
     * @description: 初始化水印，页面resize时将重新渲染水印
     * @return: 
     */
    handleGridlayoutReady () {
      this.initWatermark()
    },
    /**
    * @description: columns
    * @return: 
    */
    calColumnList () {
      let temp = []
      if (this.reportData.chart_chapter_collapsible && Array.isArray(this.reportData.charts) && this.reportData.charts.length) {
        let hash = {};
        temp = this.reportData.charts.reduce((item, next) => {
          hash[next.chart_column_index] ? '' : hash[next.chart_column_index] = true && item.push({
            chart_column_index: `${next.chart_column_index}`,
            chart_column_txt: next.chart_column_txt
          });
          return item
        }, []).filter(i => Boolean(i.chart_column_txt)).sort((a, b) => a.chart_column_index - b.chart_column_index)

        this.columnList = temp
        if (Array.isArray(this.columnList) && this.columnList.length > 0) {
          this.activeColumn = `${this.columnList[0].chart_column_index}`
        }
      }
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
      if(this.calReportOriginalData && this.calReportOriginalData.chart_chapter_collapsible){
        charts = charts.filter(i => i.chart_column_index == this.activeColumn)
      }
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
    calReportOriginalData(){
      return JSON.parse(JSON.stringify(this.reportData))
    }
  },
  created () {

  },
  updated () {
  },
  mounted () {
    // this.initWatermark()
    // 该组件mounted时,vue-grid-layout虽然已经mounted,但它还需要一定的运算计算出页面的高度。此时初始化水印会出现水印不完整的情况，所以一定要在handleGridlayoutReady方法中初始化。
    this.calColumnList()
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
      // immediate: true,
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