<!--
 * @Author: dengyue.wang
 * @Date: 2020-04-21 05:34:35
 * @LastEditors: dengyue.wang
 * @LastEditTime: 2020-08-21 09:59:54
 -->
<template>
  <div class="tabsMain">
    <ul class="tabsList">
      <li v-for="(item,index) in options" :class="activeName==item.chart_column_index?'active':''" :key="index" @click="handleClick(item)">{{item.chart_column_txt}}</li>
    </ul>
  </div>
</template>

<script>

export default {
  name: "PulseTab",
  props: {
    value: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      activeName: '',
      currOptions: []
    }
  },
  methods: {
    initOptions () {
      this.currOptions = this.options.map(item => {
        return {
          ...item,
          active: item.chart_column_index == this.activeName
        }
      })
    },
    handleClick (item) {
      this.currOptions.forEach(obj => obj.active = false)
      item.active = true
      this.activeName = item.chart_column_index
      this.$emit('input',this.activeName)
    }
  },
  mounted () {
    this.initOptions()
  }
}
</script>

<style lang="css" type="text/css">
.tabsMain {
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  margin: 0;
}
.tabsMain  > div {
  padding: 10px;
}
.tabsList {
  width: 100%;
  background: #f5f7fa;
  overflow: hidden;
}
.tabsList li {
  float: left;
  padding: 0 20px;
  height: 40px;
  box-sizing: border-box;
  line-height: 40px;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  border: 1px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
}
.tabsList li.active {
  color: #00bcbc;
  background-color: #fff;
  border-left-color: #dcdfe6;
  border-right-color: #dcdfe6;
  white-space: nowrap;
  position: relative;
  transition: transfrom 0.3s;
  z-index: 2;
}
.tabsList li:first-child {
  margin-left: -1px;
}
.tabsList li:last-child {
  margin-right: -1px;
}
</style>

