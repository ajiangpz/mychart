import 'echarts/lib/chart/map'
import {
  chart
} from '../../chart.js'
import {
  map
} from './map'
chart.prototype.chartHandler = map
export {
  chart as eMap
}