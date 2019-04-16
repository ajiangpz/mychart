import 'echarts/lib/chart/line'
import {
    chart
} from '../../chart.js'
import {
    line
} from './line'
Object.deepExtend = function deepExtendFunction(destination, source) {
    for (var property in source) {
        if (source[property] && source[property].constructor &&
            source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            deepExtendFunction(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
};
chart.prototype.chartHandler = line
export {
    chart as eLine
}