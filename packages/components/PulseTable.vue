<!--
 * @Author: dengyue.wang
 * @Date: 2020-04-21 05:34:35
 * @LastEditors: dengyue.wang
 * @LastEditTime: 2020-05-18 15:39:38
 -->
<template>
  <div class="table-wrap">
    <div class="tableBox">
      <table>
        <tr v-for="(item,index) in options['series']" :key="index">
          <td v-for="(unit, idx) in item" :class="[{alignLeft:idx===0},{alignRight:idx===(item.length -1)},calTdClass(index,idx)]" :key="idx">
            <vue-markdown class="markdown" v-if="isMarkdown(unit) || isHtml(unit)" :source="unit" :anchorAttributes="{target:'_blank'}"></vue-markdown>
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
  props: ['options', 'styleObj'],
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
    },
    // 26进制字母EXCEL列号 <--> 索引数字
    createCellPos (n) {
      let ordA = 'A'.charCodeAt(0);
      let ordZ = 'Z'.charCodeAt(0);
      let len = ordZ - ordA + 1;
      let s = "";
      while (n >= 0) {
        s = String.fromCharCode(n % len + ordA) + s;
        n = Math.floor(n / len) - 1;
      }
      return s;
    },
    translateCellPos (val) {
      let base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;

      for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
        result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
      }

      return result;
    },
    calTdClass (row, col) {
      const self = this
      if (this.styleObj && this.styleObj.extraOption && this.styleObj.extraOption.tableRules && this.styleObj.extraOption.tableRules.open && Array.isArray(this.styleObj.extraOption.tableRules.data) && this.styleObj.extraOption.tableRules.data.length) {
        try {
          // 首行表头不参与颜色
          if (row === 0) return
          let result = ""
          this.styleObj.extraOption.tableRules.data.forEach(item => {
            const temp = /\$[A-Z]+/g.exec(item.expression)[0]

            const curCol = this.translateCellPos(temp.split('$')[1]) - 1

            if (col != curCol) return
            // 百分数处理

            let tempExp = item.expression.replace(/(-?(\d+\.?\d+?)%)/g, (match) => {
              // console.log(match);
              const str = parseFloat(match)

              return str;
            })
            
            //正则替换为单元格
            const formula = tempExp.replace(/(\$[A-Z]+)/g, (match) => {
              let str = ""

              if (parseFloat(self.options.series[row][self.translateCellPos(match.split('$')[1]) - 1]) || parseFloat(self.options.series[row][self.translateCellPos(match.split('$')[1]) - 1]) === 0) { 
                str = `parseFloat(self.options.series[${row}][${this.translateCellPos(match.split('$')[1]) - 1}])`
              }else{
                str = `self.options.series[${row}][${this.translateCellPos(match.split('$')[1]) - 1}]`
              }

              return str;
            })
            if (eval(formula)) {
              result += ` pulse-table-rule--${item.style}`
            }
          })
          return result
        } catch (error) {
          console.log(error);
        }
      }
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


<style lang="css" scoped type="text/scss">
.table-wrap {
  margin: 0;
  width: 100%;
}

.table-wrap .tableBox {
  width: 100%;
  overflow: auto;
}

.table-wrap .tableBox table {
  margin: 3px 0;
  width: 100%;
  border-top: 2px solid #000f16;
  border-bottom: 2px solid #000f16;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
}

.table-wrap .tableBox table tr .alignLeft {
  text-align: left;
}

.table-wrap .tableBox table tr .alignRight {
  text-align: right;
}

.table-wrap .tableBox table tr:nth-child(1) {
  border-bottom: 1px solid #54585a;
  color: #00bcbc;
}

.table-wrap .tableBox table tr td.pulse-table-rule--error {
  background: #ff231e;
  color: #fff;
}

.table-wrap .tableBox table tr td.pulse-table-rule--warning {
  background: #fff794;
  color: #54585a;
}

.table-wrap .tableBox table tr td.pulse-table-rule--success {
  background: #00bcbc;
  color: #fff;
}
</style>
