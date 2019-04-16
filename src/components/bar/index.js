import 'echarts/lib/chart/bar'
import {
    chart
} from '../../chart.js'
import {
    histogram
} from './bar'
chart.prototype.chartHandler = histogram
export {
    chart as eBar
}