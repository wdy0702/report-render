<template>
  <div class="table-wrap">
    <div class="tableBox">
      <table>
        <tr v-for="(item,index) in options['series']" :key="index">
          <td :class="{alignLeft:idx===0, alignRight:idx===(item.length -1)}" v-for="(unit, idx) in item" :key="idx">
            <vue-markdown v-if="isMarkdown(unit) || isHtml(unit)" :source="unit" :anchorAttributes="{target:'_blank'}"></vue-markdown>
            <div v-else v-text="unit"></div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {
  name: "PulseTable",
  props: ['options'],
  components: { 'vue-markdown': VueMarkdown },
  data () {
    return {

    }
  },
  methods: {
    isHtml (htmlStr) {
      var reg = /<[^>]+>/g;
      return reg.test(htmlStr);
    },
    //只支持markdown中的a标签,若全用vue-markdown渲染，在面对千行表格时内存吃满，浏览器崩溃
    isMarkdown (td) {
      return /\[[\s\S]*?\]\([\s\S]*?\)/g.test(td)
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  watch: {

  }
}
</script>


<style lang="scss" scoped type="text/scss">
.table-wrap {
  margin: 0;
  width: 100%;
  .tableBox {
    width: 100%;
    overflow: auto;
    table {
      margin: 3px 0;
      width: 100%;
      border-top: 2px solid #000f16;
      border-bottom: 2px solid #000f16;
      text-align: center;
      font-size: 12px;
      line-height: 25px;
      tr {
        .alignLeft {
          text-align: left;
        }
        .alignRight {
          text-align: right;
        }
      }
      tr:nth-child(1) {
        border-bottom: 1px solid #54585a;
        color: #00bcbc;
      }
    }
  }
}
</style>
