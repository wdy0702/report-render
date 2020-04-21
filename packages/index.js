import ReportRender from './src/index.vue';
ReportRender.install = function(Vue) {
    Vue.component(ReportRender.name, ReportRender);
};
export default ReportRender;