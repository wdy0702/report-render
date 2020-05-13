<!--
 * @Author: dengyue.wang
 * @Date: 2020-04-21 05:34:35
 * @LastEditors: dengyue.wang
 * @LastEditTime: 2020-04-29 17:03:43
 -->
<template>
  <div class="md-wrap">
    <vue-markdown class="markdown" :anchorAttributes="{target:'_blank'}" :source="source_string"></vue-markdown>
  </div>
</template>

<script>
  import VueMarkdown from 'vue-markdown'

  export default {
    props: ['options'],
    components: {'vue-markdown': VueMarkdown},
    data() {
      return {
        source_string: this.options['source'].join("\n"),
      }
    },
    methods: {},
    mounted() {
    },
    updated(){
    },
    watch: {
      options: {
        handler(val) {
          this.source_string = val['source'].join("\n")
        },
        deep: true
      },
    },
    computed: {
    }
  }
</script>

<style lang="css" type="text/css">
.md-wrap {
  margin: 3px 0;
  width: 100%;
  font-size: 12px;
  color: #54585a;
  text-align: justify;
}

.md-wrap a {
  color: #3084bb;
}

.md-wrap ul {
  margin-left: 1.5em;
}

.md-wrap ul li {
  list-style-type: disc;
}

.md-wrap img {
  max-width: 100%;
}

.md-wrap h1, .md-wrap h2, .md-wrap h3, .md-wrap h4, .md-wrap h5, .md-wrap h6 {
  display: block;
  font-weight: bold;
}

.md-wrap h1 {
  font-size: 2em;
}

.md-wrap h2 {
  font-size: 1.5em;
}

.md-wrap h3 {
  font-size: 1.17em;
}

.md-wrap h5 {
  font-size: 0.83em;
}

.md-wrap h6 {
  font-size: 0.67em;
}

</style>

