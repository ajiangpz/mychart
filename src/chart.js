import echartsLib from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import {
    getType,
    debounce, //函数节流
    //第二个参数是时间，即在该时段内不会响应用户的操作，等到时间结束，执行用户的最后一次操作
    camelToKebab, //驼峰转下划线命名
    isArray,
    isObject,
    cloneDeep, //深拷贝
    isEqual
} from "utils-lite";

import {
    DEFAULT_COLORS,
    DEFAULT_THEME,
    STATIC_PROPS,
    ECHARTS_SETTINGS
} from "./constants.js";
import setExtend from "./modules/extend";
import setMark from "./modules/mark";
import setAnimation from "./modules/animation";
import {
    log
} from "util";
export function chart(arg) {
    if (!arg) arg = {}
    this.data = arg.data || []
    this.settings = arg.settings || {}
    this.baseSettings = arg.baseSettings;
    this.el = arg.el || 'chart'
    this.beforeConfig = arg.beforeConfig
    this.afterConfig = arg.afterConfig
    this.afterSetOption = arg.afterSetOption
    this.afterSetOptionOnce = arg.afterSetOptionOnce
    this.events = arg.events
    this.tooltipVisible = arg.tooltipVisible || true
    this.legendVisible = arg.legendVisible || true
    this.legendPosition = arg.legendPosition
    this.markLine = arg.markLine
    this.markArea = arg.markArea
    this.markPoint = arg.markPoint

    this.baseSettings = {
        width: arg.width,
        height: arg.height,
        grid: arg.grid,
        colors: arg.colors,
        visualMap: arg.visualMap,
        dataZoom: arg.dataZoom,
        toolbox: arg.toolbox,
        title: arg.title,
        legend: arg.legend,
        xAxis: arg.xAxis,
        yAxis: arg.yAxis,
        radar: arg.radar,
        tooltip: arg.tooltip,
        axisPointer: arg.axisPointer,
        brush: arg.brush,
        geo: arg.geo,
        timeline: arg.timeline,
        graphic: arg.graphic,
        series: arg.series,
        backgroundColor: arg.backgroundColor,
        textStyle: arg.textStyle
    }





    this.initOptions = arg.initOptions
    this.animation = arg.animation
    this.theme = arg.theme
    this.themeName = arg.themeName
    this.loading = arg.loading
    this.dataEmpty = arg.dataEmpty
    this.extend = arg.extend
    this.judgeWidth = arg.judgeWidth || false
    this.widthChangeDelay = arg.widthChangeDelay || 300
    this.tooltipFormatter = arg.tooltipFormatter
    this.resizeable = arg.resizeable || true
    this.resizeDelay = arg.resizeDelay || 200
    this.changeDelay = arg.changeDelay || 1000
    this.setOptionOpts = arg.setOptionOpts || true
    this.cancelResizeCheck = arg.cancelResizeCheck
    this.notSetUnchange = arg.notSetUnchange
    this.log = arg.log || true
    this.created()
}

chart.prototype.chartHandler = null
chart.prototype.draw = function () {
    this.init();
}
chart.prototype.dataHandler = function (arg) {
    if (!this.chartHandler) return;
    //arguments[0]才是传入的对象


    this.columns = arg ? arg.data ? arg.data.columns : this.data.columns : this.data.columns;
    this.rows = arg ? arg.data ? arg.data.rows : this.data.rows : this.data.rows;
    this.settings = arg ? arg.settings || this.settings : this.settings;
    this.baseSettings = arg ? arg.baseSettings || this.baseSettings : this.baseSettings;
    this.width = arg ? arg.width : this.width
    this.height = arg ? arg.height : this.width
    console.log(this.columns, this.rows, this.settings)




    let extra = {
        tooltipVisible: this.tooltipVisible,
        legendVisible: this.legendVisible,
        echarts: this.echarts,
        color: DEFAULT_COLORS,
        tooltipFormatter: this.tooltipFormatter,
        _once: this._once
    };
    // if (this.beforeConfig) data = this.beforeConfig(data);


    let options = this.chartHandler(this.columns, this.rows, this.settings, extra);
    if (options) {
        if (typeof options.then === "function") {
            options.then(this.optionsHandler.bind(this));
        } else {
            this.optionsHandler(options);
        }
    }
}
chart.prototype.init = function () {
    var _this = this
    if (this.echarts) return;
    const themeName = this.themeName || this.theme || DEFAULT_THEME;
    this.echarts = echartsLib.init(
        document.getElementById(this.el),
        themeName,
        this.initOptions
    );
    if (this.data) this.changeHandler();
    this.createEventProxy();
    if (this.resizeable) {
        window.addEventListener('resize', debounce(function () {
            _this.resize();
        }, 1000))
    }
}
chart.prototype.addResizeListener = function () {
    window.addEventListener("resize", this.resizeHandler);
    this._once.onresize = true;
}
chart.prototype.removeResizeListener = function () {
    window.removeEventListener("resize", this.resizeHandler);
    this._once.onresize = false;
}
chart.prototype.created = function () {
    this.echarts = null;
    this.registeredEvents = [];
    this._once = {};
    this._store = {};
    //this.resizeHandler = debounce(this.resize, this.resizeDelay);
    this.resizeHandler = debounce.call(this, this.resize, this.resizeDelay)
    this.changeHandler = debounce(this.dataHandler, this.changeDelay);
}
chart.prototype.createEventProxy = function () {
    // 只要用户使用 on 方法绑定的事件都做一层代理，
    // 是否真正执行相应的事件方法取决于该方法是否仍然存在 events 中
    // 实现 events 的动态响应
    const self = this;
    const keys = Object.keys(this.events || {});
    keys.length &&
        keys.forEach(ev => {
            if (this.registeredEvents.indexOf(ev) === -1) {
                this.registeredEvents.push(ev);
                this.echarts.on(
                    ev,
                    (function (ev) {
                        return function (...args) {
                            if (ev in self.events) {
                                self.events[ev].apply(null, args);
                            }
                        };
                    })(ev)
                );
            }
        });
}
chart.prototype.optionsHandler = function (options) {
    // legend
    if (this.legendPosition && options.legend) {
        options.legend[this.legendPosition] = 10;
        if (~["left", "right"].indexOf(this.legendPosition)) {
            options.legend.top = "middle";
            options.legend.orient = "vertical";
        }
    }
    // color
    options.color = this.chartColor();
    // echarts self settings
    ECHARTS_SETTINGS.forEach(setting => {
        if (JSON.stringify(this.baseSettings[setting]) !== '{}' && JSON.stringify(this.baseSettings[setting]) !== '[]' && this.baseSettings[setting]) {
            if (this.baseSettings[setting] instanceof Array) {
                if (!options[setting]) {
                    options[setting] = this.baseSettings[setting]
                } else {
                    options[setting].forEach((item, index) => {
                        console.log(this.baseSettings[setting][index])
                        Object.assign(item, this.baseSettings[setting][index])
                    })
                }

            } else {
                options[setting] = this.baseSettings[setting];
            }


        }

    });
    // animation0
    if (this.animation) setAnimation(options, this.animation);
    // marks
    if (this.markArea || this.markLine || this.markPoint) {
        const marks = {
            markArea: this.markArea,
            markLine: this.markLine,
            markPoint: this.markPoint
        };
        const series = options.series;
        if (isArray(series)) {
            series.forEach(item => {
                setMark(item, marks);
            });
        } else if (isObject(series)) {
            setMark(series, marks);
        }
    }
    // change inited echarts settings
    if (this.extend) setExtend(options, this.extend);
    // if (this.afterConfig) options = this.afterConfig(options);
    let setOptionOpts = this.setOptionOpts;
    // map chart not merge
    if (
        (this.settings.bmap || this.settings.amap) &&
        !isObject(setOptionOpts)
    ) {
        setOptionOpts = false;
    }
    // exclude unchange options
    // if (this.notSetUnchange && this.notSetUnchange.length) {
    //     this.notSetUnchange.forEach(item => {
    //         const value = options[item];
    //         if (value) {
    //             if (isEqual(value, this._store[item])) {
    //                 options[item] = undefined;
    //             } else {
    //                 this._store[item] = cloneDeep(value);
    //             }
    //         }
    //     });
    //     if (isObject(setOptionOpts)) {
    //         setOptionOpts.notMerge = false;
    //     } else {
    //         setOptionOpts = false;
    //     }
    // }
    if (this._isDestroyed) return;
    if (this.log) console.log(options);
    this.echarts.setOption(options, setOptionOpts);
    // this.$emit("ready", this.echarts, options, echartsLib);
    // if (!this._once["ready-once"]) {
    //     this._once["ready-once"] = true;
    //     this.$emit("ready-once", this.echarts, options, echartsLib);
    // }
    // if (this.judgeWidth) this.judgeWidthHandler(options);
    // if (this.afterSetOption)
    //     this.afterSetOption(this.echarts, options, echartsLib);
    // if (this.afterSetOptionOnce && !this._once["afterSetOptionOnce"]) {
    //     this._once["afterSetOptionOnce"] = true;
    //     this.afterSetOptionOnce(this.echarts, options, echartsLib);
    // }
}
chart.prototype.resize = function () {
    if (!this.cancelResizeCheck) {
        if (this.el) {
            this.echartsResize();
        }
    } else {
        this.echartsResize();
    }
}
chart.prototype.chartColor = function () {
    return this.colors || DEFAULT_COLORS
}
chart.prototype.echartsResize = function () {
    this.echarts && this.echarts.resize();
}