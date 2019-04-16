import 'echarts-wordcloud'
import {
  wordcloud
}
from './wordcloud'
import {
  chart
} from '../../chart'
chart.prototype.chartHandler = wordcloud
export {
  chart as eCloud
}