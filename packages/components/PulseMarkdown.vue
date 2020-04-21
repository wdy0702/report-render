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

<style lang="scss" type="text/scss">
  .md-wrap {
    margin: 3px 0;
    width: 100%;
    font-size: 12px;
    color: #54585a;
    text-align: justify;
    a {
      color: #3084bb;
    }
    ul {
      margin-left: 1.5em;
      li{
        list-style-type: disc;
      }
    }
    img {
      max-width: 100%;
    }
    h1, h2, h3, h4, h5, h6 {
      display: block;
      font-weight: bold;
    }
    h1 {
      font-size: 2em;
    }
    h2 {
      font-size: 1.5em;
    }
    h3 {
      font-size: 1.17em;
    }
    h5 {
      font-size: 0.83em;
    }
    h6 {
      font-size: 0.67em;
    }
  }
</style>

