<!--
 * @Author: dengyue.wang
 * @Date: 2020-04-25 08:15:57
 * @LastEditors: dengyue.wang
 * @LastEditTime: 2020-04-26 18:52:06
 -->
# report-render

## Install
```
npm install report-render --save
```

## Import
```
import ReportRender from 'report-render'

Vue.use(ReportRender)

```

## Use
```
<report-render :reportData="reportData" :watermarkData="watermarkData"></report-render>

```
## Properties

| Name          | Required | Type | Default | Description  |
|---------------|----------|------|---------|--------------|
| reportData    | true     | JSON | {}      | 报表数据结构 |
| watermarkData | true     | JSON | {}      | 报表水印     |

### reportData字段说明

| Name                      | Required | Type    | Default | Description      |
|---------------------------|----------|---------|---------|------------------|
| charts                    | true     | Array   | []      | 图表集合         |
| chart_chapter_collapsible | false    | Boolean | false   | 是否开启折叠模式 |
| owner                     | false    | String  | ""      | 报表创建人       |
| view_user                 | false    | String  | ""      | 报表联系人       |
| category_name             | false    | String  | ""      | 报表分类         |
| view_layout               | false    | JSON    | {}      | 报表布局         |
| version_name              | false    | String  | ""      | 报表版本         |


### watermarkData字段说明

| Name               | Required | Type    | Default | Description         |
|--------------------|----------|---------|---------|---------------------|
| watermark_show     | true     | Boolean | true    | 是否显示水印        |
| watermark_txt      | true     | String  | TEST    | 水印文字            |
| watermark_x        | false    | Number  | 0       | 水印起始位置x轴坐标 |
| watermark_y        | false    | Number  | 0       | 水印起始位置Y轴坐标 |
| watermark_x_space  | false    | Number  | 0       | 水印x轴间隔         |
| watermark_y_space  | false    | Number  | 0       | 水印y轴间隔         |
| watermark_color    | false    | String  | #54585a | 水印字体颜色        |
| watermark_fontsize | false    | String  | 14px    | 水印字体大小        |
| watermark_alpha    | false    | Number  | 0.15    | 水印透明度          |
| watermark_width    | false    | Number  | 300     | 水印宽度            |
| watermark_height   | false    | Number  | 200     | 水印高度            |
| watermark_angle    | false    | Number  | 30      | 水印倾斜度数        |