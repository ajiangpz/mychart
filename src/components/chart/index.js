import {
    histogram
} from '../bar/bar'
import {
    line
} from '../line/line'
import {
    pie
} from '../pie/pie'
import {
    map
} from '../map/map'
import {
    bar
} from '../bar_x/bar_x'
import {
    wordcloud
} from '../wordcloud/wordcloud'
import {
    chart
} from '../../chart'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/dataZoom'
chart.prototype.chartLib = {
    histogram,
    line,
    pie,
    map,
    bar,
    wordcloud
}
chart.prototype.setType = function (type) {
    chart.prototype.chartHandler = this.chartLib[type]
}
export {
    chart as allCharts
}