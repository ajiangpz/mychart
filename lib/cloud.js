(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('echarts-wordcloud'), require('echarts/lib/echarts'), require('echarts/lib/component/tooltip'), require('echarts/lib/component/legend')) :
  typeof define === 'function' && define.amd ? define(['exports', 'echarts-wordcloud', 'echarts/lib/echarts', 'echarts/lib/component/tooltip', 'echarts/lib/component/legend'], factory) :
  (global = global || self, factory(global.eCloud = {}, null, global.echarts));
}(this, function (exports, echartsWordcloud, echartsLib) { 'use strict';

  echartsLib = echartsLib && echartsLib.hasOwnProperty('default') ? echartsLib['default'] : echartsLib;

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var self = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(self, args);
      }, delay);
    };
  }

  function set(target, path, value) {
    if (!path) return;
    var targetTemp = target;
    var pathArr = path.split('.');
    pathArr.forEach(function (item, index) {
      if (index === pathArr.length - 1) {
        targetTemp[item] = value;
      } else {
        if (!targetTemp[item]) targetTemp[item] = {};
        targetTemp = targetTemp[item];
      }
    });
  }

  function getType(v) {
    return Object.prototype.toString.call(v);
  }

  function isObject(v) {
    return getType(v) === '[object Object]';
  }

  function isArray(v) {
    return getType(v) === '[object Array]';
  }

  function getSeries(args) {
    var dimension = args.dimension,
        metrics = args.metrics,
        rows = args.rows,
        color = args.color,
        sizeMax = args.sizeMax,
        sizeMin = args.sizeMin,
        shape = args.shape;
    var baseType = {
      type: 'wordCloud',
      textStyle: {
        normal: {
          color: !isArray(color) && !!color ? color : function () {
            return 'rgb(' + [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',') + ')';
          }
        }
      },
      shape: shape,
      sizeRange: [sizeMin, sizeMax]
    };
    var len = isArray(color) ? color.length : 0;
    var data = rows.slice().map(function (row) {
      var text = {
        name: row[dimension],
        value: row[metrics]
      };

      if (len > 0) {
        text.textStyle = {
          normal: {
            color: color[Math.floor(Math.random() * len)]
          }
        };
      }

      return text;
    });
    baseType.data = data;
    return [baseType];
  }

  function getTooltip(args) {
    var tooltipFormatter = args.tooltipFormatter;
    return {
      show: true,
      formatter: function formatter(params) {
        var _params$data = params.data,
            name = _params$data.name,
            value = _params$data.value;

        if (tooltipFormatter) {
          return tooltipFormatter.apply(null, params);
        }

        return "".concat(name, ": ").concat(value);
      }
    };
  }

  var wordcloud = function wordcloud(columns, rows, settings, extra) {
    var _settings$dimension = settings.dimension,
        dimension = _settings$dimension === void 0 ? columns[0] : _settings$dimension,
        _settings$metrics = settings.metrics,
        metrics = _settings$metrics === void 0 ? columns[1] : _settings$metrics,
        _settings$color = settings.color,
        color = _settings$color === void 0 ? '' : _settings$color,
        _settings$sizeMax = settings.sizeMax,
        sizeMax = _settings$sizeMax === void 0 ? 60 : _settings$sizeMax,
        _settings$sizeMin = settings.sizeMin,
        sizeMin = _settings$sizeMin === void 0 ? 12 : _settings$sizeMin,
        _settings$shape = settings.shape,
        shape = _settings$shape === void 0 ? 'circle' : _settings$shape;
    var tooltipVisible = extra.tooltipVisible,
        tooltipFormatter = extra.tooltipFormatter;
    var series = getSeries({
      dimension: dimension,
      metrics: metrics,
      rows: rows,
      color: color,
      sizeMax: sizeMax,
      sizeMin: sizeMin,
      shape: shape
    });
    var tooltip = tooltipVisible && getTooltip({
      tooltipFormatter: tooltipFormatter
    });
    return {
      series: series,
      tooltip: tooltip
    };
  };

  var DEFAULT_THEME = {
    categoryAxis: {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    valueAxis: {
      axisLine: {
        show: false
      }
    },
    line: {
      smooth: true
    },
    grid: {
      containLabel: true,
      left: 10,
      right: 10
    }
  };
  var DEFAULT_COLORS = ['#19d4ae', '#5ab1ef', '#fa6e86', '#ffb980', '#0067a6', '#c4b4e4', '#d87a80', '#9cbbff', '#d9d0c7', '#87a997', '#d49ea2', '#5b4947', '#7ba3a8'];
  var ECHARTS_SETTINGS = ['grid', 'dataZoom', 'visualMap', 'toolbox', 'title', 'legend', 'xAxis', 'yAxis', 'radar', 'tooltip', 'axisPointer', 'brush', 'geo', 'timeline', 'graphic', 'series', 'backgroundColor', 'textStyle'];

  function setExtend (options, extend) {
    Object.keys(extend).forEach(function (attr) {
      var value = extend[attr];

      if (~attr.indexOf(".")) {
        // eg: a.b.c a.1.b
        set(options, attr, value);
      } else if (typeof value === "function") {
        // get callback value
        options[attr] = value(options[attr]);
      } else {
        // mixin extend value
        if (isArray(options[attr]) && isObject(options[attr][0])) {
          // eg: [{ xx: 1 }, { xx: 2 }]
          options[attr].forEach(function (option, index) {
            options[attr][index] = Object.assign({}, option, value);
          });
        } else if (isObject(options[attr])) {
          // eg: { xx: 1, yy: 2 }
          options[attr] = Object.assign({}, options[attr], value);
        } else {
          options[attr] = value;
        }
      }
    });
  }

  function setMark (seriesItem, marks) {
    Object.keys(marks).forEach(function (key) {
      if (marks[key]) seriesItem[key] = marks[key];
    });
  } //把有值的属性（不是null,false,空字符串,undefined）

  function setAnimation (options, animation) {
    Object.keys(animation).forEach(function (key) {
      options[key] = animation[key];
    });
  }

  function chart(arg) {
    this.data = arg.data;
    this.settings = arg.settings || {};
    this.width = arg.width;
    this.height = arg.height;
    this.el = arg.el || 'bar';
    this.beforeConfig = arg.beforeConfig;
    this.afterConfig = arg.afterConfig;
    this.afterSetOption = arg.afterSetOption;
    this.afterSetOptionOnce = arg.afterSetOptionOnce;
    this.events = arg.events;
    this.grid = arg.grid;
    this.colors = arg.colors;
    this.tooltipVisible = arg.tooltipVisible || true;
    this.legendVisible = arg.legendVisible || true;
    this.legendPosition = arg.legendPosition;
    this.markLine = arg.markLine;
    this.markArea = arg.markArea;
    this.markPoint = arg.markPoint;
    this.visualMap = arg.visualMap;
    this.dataZoom = arg.dataZoom;
    this.toolbox = arg.toolbox;
    this.initOptions = arg.initOptions;
    this.title = arg.title;
    this.legend = arg.legend;
    this.xAxis = arg.xAxis;
    this.yAxis = arg.yAxis;
    this.radar = arg.radar;
    this.tooltip = arg.tooltip;
    this.axisPointer = arg.axisPointer;
    this.brush = arg.brush;
    this.geo = arg.geo;
    this.timeline = arg.timeline;
    this.graphic = arg.graphic;
    this.series = arg.series;
    this.backgroundColor = arg.backgroundColor;
    this.textStyle = arg.textStyle;
    this.animation = arg.animation;
    this.theme = arg.theme;
    this.themeName = arg.themeName;
    this.loading = arg.loading;
    this.dataEmpty = arg.dataEmpty;
    this.extend = arg.extend;
    this.judgeWidth = arg.judgeWidth || false;
    this.widthChangeDelay = arg.widthChangeDelay || 300;

    this.tooltipFormatter = arg.tooltipFormatter || function () {};

    this.resizeable = arg.resizeable || true;
    this.resizeDelay = arg.resizeDelay || 200;
    this.changeDelay = arg.changeDelay || 0;
    this.setOptionOpts = arg.setOptionOpts || true;
    this.cancelResizeCheck = arg.cancelResizeCheck;
    this.notSetUnchange = arg.notSetUnchange;
    this.log = arg.log || true;
    this.created();
    this.init();
  }
  chart.prototype.chartHandler = null;

  chart.prototype.dataHandler = function () {
    if (!this.chartHandler) return;
    var data = this.data; //data是从父组件传递而来

    var _data$columns = data.columns,
        columns = _data$columns === void 0 ? [] : _data$columns,
        _data$rows = data.rows,
        rows = _data$rows === void 0 ? [] : _data$rows;
    var extra = {
      tooltipVisible: this.tooltipVisible,
      legendVisible: this.legendVisible,
      echarts: this.echarts,
      color: DEFAULT_COLORS,
      tooltipFormatter: this.tooltipFormatter,
      _once: this._once
    }; // if (this.beforeConfig) data = this.beforeConfig(data);

    var options = this.chartHandler(columns, rows, this.settings, extra);

    if (options) {
      if (typeof options.then === "function") {
        options.then(this.optionsHandler.bind(this));
      } else {
        this.optionsHandler(options);
      }
    }
  };

  chart.prototype.init = function () {
    var _this = this;

    if (this.echarts) return;
    var themeName = this.themeName || this.theme || DEFAULT_THEME;
    this.echarts = echartsLib.init(document.getElementById(this.el), themeName, this.initOptions);
    if (this.data) this.changeHandler();
    this.createEventProxy();

    if (this.resizeable) {
      window.addEventListener('resize', debounce(function () {
        _this.resize();
      }, 1000));
    }
  };

  chart.prototype.addResizeListener = function () {
    window.addEventListener("resize", this.resizeHandler);
    this._once.onresize = true;
  };

  chart.prototype.removeResizeListener = function () {
    window.removeEventListener("resize", this.resizeHandler);
    this._once.onresize = false;
  };

  chart.prototype.created = function () {
    this.echarts = null;
    this.registeredEvents = [];
    this._once = {};
    this._store = {}; //this.resizeHandler = debounce(this.resize, this.resizeDelay);

    this.resizeHandler = debounce.call(this, this.resize, this.resizeDelay);
    this.changeHandler = debounce(this.dataHandler, this.changeDelay);
  };

  chart.prototype.createEventProxy = function () {
    var _this2 = this;

    // 只要用户使用 on 方法绑定的事件都做一层代理，
    // 是否真正执行相应的事件方法取决于该方法是否仍然存在 events 中
    // 实现 events 的动态响应
    var self = this;
    var keys = Object.keys(this.events || {});
    keys.length && keys.forEach(function (ev) {
      if (_this2.registeredEvents.indexOf(ev) === -1) {
        _this2.registeredEvents.push(ev);

        _this2.echarts.on(ev, function (ev) {
          return function () {
            if (ev in self.events) {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              self.events[ev].apply(null, args);
            }
          };
        }(ev));
      }
    });
  };

  chart.prototype.optionsHandler = function (options) {
    var _this3 = this;

    // legend
    if (this.legendPosition && options.legend) {
      options.legend[this.legendPosition] = 10;

      if (~["left", "right"].indexOf(this.legendPosition)) {
        options.legend.top = "middle";
        options.legend.orient = "vertical";
      }
    } // color


    options.color = this.chartColor(); // echarts self settings

    ECHARTS_SETTINGS.forEach(function (setting) {
      if (_this3[setting]) options[setting] = _this3[setting];
    }); // animation

    if (this.animation) setAnimation(options, this.animation); // marks

    if (this.markArea || this.markLine || this.markPoint) {
      var marks = {
        markArea: this.markArea,
        markLine: this.markLine,
        markPoint: this.markPoint
      };
      var series = options.series;

      if (isArray(series)) {
        series.forEach(function (item) {
          setMark(item, marks);
        });
      } else if (isObject(series)) {
        setMark(series, marks);
      }
    } // change inited echarts settings


    if (this.extend) setExtend(options, this.extend); // if (this.afterConfig) options = this.afterConfig(options);

    var setOptionOpts = this.setOptionOpts; // map chart not merge

    if ((this.settings.bmap || this.settings.amap) && !isObject(setOptionOpts)) {
      setOptionOpts = false;
    } // exclude unchange options
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
    this.echarts.setOption(options, setOptionOpts); // this.$emit("ready", this.echarts, options, echartsLib);
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
  };

  chart.prototype.resize = function () {
    if (!this.cancelResizeCheck) {
      if (this.el) {
        this.echartsResize();
      }
    } else {
      this.echartsResize();
    }
  };

  chart.prototype.chartColor = function () {
    return this.colors || DEFAULT_COLORS;
  };

  chart.prototype.echartsResize = function () {
    this.echarts && this.echarts.resize();
  };

  chart.prototype.chartHandler = wordcloud;

  exports.eCloud = chart;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
