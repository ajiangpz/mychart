import 'echarts/lib/chart/pie'
import {
  pie
} from './pie'
import {
  chart
} from '../../chart'
chart.prototype.chartHandler = pie
export {
  chart as ePie
}