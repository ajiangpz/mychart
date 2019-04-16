import 'echarts/lib/chart/bar'
import {
    chart
} from '../../chart.js'
import {
    bar
} from './bar'
chart.prototype.chartHandler = bar
export {
    chart as eBar_x
}