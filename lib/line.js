(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('echarts/lib/chart/line'), require('echarts/lib/echarts'), require('echarts/lib/component/tooltip'), require('echarts/lib/component/legend')) :
  typeof define === 'function' && define.amd ? define(['exports', 'echarts/lib/chart/line', 'echarts/lib/echarts', 'echarts/lib/component/tooltip', 'echarts/lib/component/legend'], factory) :
  (global = global || self, factory(global.eLine = {}, null, global.echarts));
}(this, function (exports, line$1, echartsLib) { 'use strict';

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

  function isFunction(v) {
    return getType(v) === '[object Function]';
  }

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

  var ABBR = {
    th: 3,
    mi: 6,
    bi: 9,
    tr: 12
  };
  var DEFAULT_OPTIONS = {
    zeroFormat: null,
    nullFormat: null,
    defaultFormat: '0,0',
    scalePercentBy100: true,
    abbrLabel: {
      th: 'k',
      mi: 'm',
      bi: 'b',
      tr: 't'
    }
  };
  var TRILLION = 1e12;
  var BILLION = 1e9;
  var MILLION = 1e6;
  var THOUSAND = 1e3;

  function numIsNaN(value) {
    return typeof value === 'number' && isNaN(value);
  }

  function toFixed(value, maxDecimals, roundingFunction, optionals) {
    var splitValue = value.toString().split('.');
    var minDecimals = maxDecimals - (optionals || 0);
    var boundedPrecision = splitValue.length === 2 ? Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals) : minDecimals;
    var power = Math.pow(10, boundedPrecision);
    var output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

    if (optionals > maxDecimals - boundedPrecision) {
      var optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
      output = output.replace(optionalsRegExp, '');
    }

    return output;
  }

  function numberToFormat(options, value, format, roundingFunction) {
    var abs = Math.abs(value);
    var negP = false;
    var optDec = false;
    var abbr = '';
    var decimal = '';
    var neg = false;
    var abbrForce = void 0;
    var signed = void 0;
    format = format || '';
    value = value || 0;

    if (~format.indexOf('(')) {
      negP = true;
      format = format.replace(/[(|)]/g, '');
    } else if (~format.indexOf('+') || ~format.indexOf('-')) {
      signed = ~format.indexOf('+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
      format = format.replace(/[+|-]/g, '');
    }

    if (~format.indexOf('a')) {
      abbrForce = format.match(/a(k|m|b|t)?/);
      abbrForce = abbrForce ? abbrForce[1] : false;
      if (~format.indexOf(' a')) abbr = ' ';
      format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

      if (abs >= TRILLION && !abbrForce || abbrForce === 't') {
        abbr += options.abbrLabel.tr;
        value = value / TRILLION;
      } else if (abs < TRILLION && abs >= BILLION && !abbrForce || abbrForce === 'b') {
        abbr += options.abbrLabel.bi;
        value = value / BILLION;
      } else if (abs < BILLION && abs >= MILLION && !abbrForce || abbrForce === 'm') {
        abbr += options.abbrLabel.mi;
        value = value / MILLION;
      } else if (abs < MILLION && abs >= THOUSAND && !abbrForce || abbrForce === 'k') {
        abbr += options.abbrLabel.th;
        value = value / THOUSAND;
      }
    }

    if (~format.indexOf('[.]')) {
      optDec = true;
      format = format.replace('[.]', '.');
    }

    var int = value.toString().split('.')[0];
    var precision = format.split('.')[1];
    var thousands = format.indexOf(',');
    var leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

    if (precision) {
      if (~precision.indexOf('[')) {
        precision = precision.replace(']', '');
        precision = precision.split('[');
        decimal = toFixed(value, precision[0].length + precision[1].length, roundingFunction, precision[1].length);
      } else {
        decimal = toFixed(value, precision.length, roundingFunction);
      }

      int = decimal.split('.')[0];
      decimal = ~decimal.indexOf('.') ? '.' + decimal.split('.')[1] : '';
      if (optDec && +decimal.slice(1) === 0) decimal = '';
    } else {
      int = toFixed(value, 0, roundingFunction);
    }

    if (abbr && !abbrForce && +int >= 1000 && abbr !== ABBR.trillion) {
      int = '' + +int / 1000;
      abbr = ABBR.million;
    }

    if (~int.indexOf('-')) {
      int = int.slice(1);
      neg = true;
    }

    if (int.length < leadingCount) {
      for (var i = leadingCount - int.length; i > 0; i--) {
        int = '0' + int;
      }
    }

    if (thousands > -1) {
      int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',');
    }

    if (!format.indexOf('.')) int = '';
    var output = int + decimal + (abbr || '');

    if (negP) {
      output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
    } else {
      if (signed >= 0) {
        output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
      } else if (neg) {
        output = '-' + output;
      }
    }

    return output;
  }

  function extend(target, sub) {
    Object.keys(sub).forEach(function (key) {
      target[key] = sub[key];
    });
  }

  var numerifyPercent = {
    regexp: /%/,
    format: function format(value, formatType, roundingFunction, numerify) {
      var space = ~formatType.indexOf(' %') ? ' ' : '';
      var output = void 0;
      if (numerify.options.scalePercentBy100) value = value * 100;
      formatType = formatType.replace(/\s?%/, '');
      output = numerify._numberToFormat(value, formatType, roundingFunction);

      if (~output.indexOf(')')) {
        output = output.split('');
        output.splice(-1, 0, space + '%');
        output = output.join('');
      } else {
        output = output + space + '%';
      }

      return output;
    }
  };
  var options = {};
  var formats = {};
  extend(options, DEFAULT_OPTIONS);

  function format(value, formatType, roundingFunction) {
    formatType = formatType || options.defaultFormat;
    roundingFunction = roundingFunction || Math.round;
    var output = void 0;
    var formatFunction = void 0;

    if (value === 0 && options.zeroFormat !== null) {
      output = options.zeroFormat;
    } else if (value === null && options.nullFormat !== null) {
      output = options.nullFormat;
    } else {
      for (var kind in formats) {
        if (formats[kind] && formatType.match(formats[kind].regexp)) {
          formatFunction = formats[kind].format;
          break;
        }
      }

      formatFunction = formatFunction || numberToFormat.bind(null, options);
      output = formatFunction(value, formatType, roundingFunction, numerify);
    }

    return output;
  }

  function numerify(input, formatType, roundingFunction) {
    var value = void 0;

    if (input === 0 || typeof input === 'undefined') {
      value = 0;
    } else if (input === null || numIsNaN(input)) {
      value = null;
    } else if (typeof input === 'string') {
      if (options.zeroFormat && input === options.zeroFormat) {
        value = 0;
      } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
        value = null;
      } else {
        value = +input;
      }
    } else {
      value = +input || null;
    }

    return format(value, formatType, roundingFunction);
  }

  numerify.options = options;
  numerify._numberToFormat = numberToFormat.bind(null, options);

  numerify.register = function (name, format) {
    formats[name] = format;
  };

  numerify.unregister = function (name) {
    formats[name] = null;
  };

  numerify.setOptions = function (opts) {
    extend(options, opts);
  };

  numerify.reset = function () {
    extend(options, DEFAULT_OPTIONS);
  };

  numerify.register('percentage', numerifyPercent);

  var getFormated = function getFormated(val, type, digit) {
    var defaultVal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '-';
    if (isNaN(val)) return defaultVal; //不是数字，返回'-'

    if (!type) return val; //没有传入type ，返回 val

    if (isFunction(type)) return type(val, numerify);
    digit = isNaN(digit) ? 0 : ++digit; //digit不是数字，默认就为0，是数字，就自增

    var digitStr = ".[".concat(new Array(digit).join(0), "]"); //创建digit个空数组，每个数组push 0 ,再拼接字符串

    var formatter = type;

    switch (type) {
      case 'KMB':
        formatter = digit ? "0,0".concat(digitStr, "a") : '0,0a'; //digit是有定义 没有定义默认为0 ,0 a

        break;

      case 'normal':
        formatter = digit ? "0,0".concat(digitStr) : '0,0';
        break;

      case 'percent':
        formatter = digit ? "0,0".concat(digitStr, "%") : '0,0.[00]%';
        break;
    }

    return numerify(val, formatter);
  };
  var getStackMap = function getStackMap(stack) {
    var stackMap = {};
    Object.keys(stack).forEach(function (item) {
      stack[item].forEach(function (name) {
        stackMap[name] = item;
      });
    });
    return stackMap;
  };

  function getLineXAxis(args) {
    var dimension = args.dimension,
        rows = args.rows,
        xAxisName = args.xAxisName,
        axisVisible = args.axisVisible,
        xAxisType = args.xAxisType;
    return dimension.map(function (item, index) {
      return {
        type: xAxisType,
        nameLocation: "middle",
        nameGap: 22,
        name: xAxisName[index] || "",
        axisTick: {
          show: true,
          lineStyle: {
            color: "#eee"
          }
        },
        data: rows.map(function (row) {
          return row[item];
        }),
        show: axisVisible
      };
    });
  }

  function getLineSeries(args) {
    var rows = args.rows,
        axisSite = args.axisSite,
        metrics = args.metrics,
        area = args.area,
        stack = args.stack,
        nullAddZero = args.nullAddZero,
        labelMap = args.labelMap,
        label = args.label,
        itemStyle = args.itemStyle,
        lineStyle = args.lineStyle,
        areaStyle = args.areaStyle,
        dimension = args.dimension;
    var series = [];
    var dataTemp = {};
    var stackMap = stack && getStackMap(stack);
    metrics.forEach(function (item) {
      dataTemp[item] = [];
    });
    rows.forEach(function (row) {
      metrics.forEach(function (item) {
        var value = null;

        if (row[item] != null) {
          value = row[item];
        } else if (nullAddZero) {
          value = 0;
        }

        dataTemp[item].push([row[dimension[0]], value]);
      });
    });
    metrics.forEach(function (item) {
      var seriesItem = {
        name: labelMap[item] != null ? labelMap[item] : item,
        type: "line",
        data: dataTemp[item]
      };
      if (area) seriesItem.areaStyle = {
        normal: {}
      };

      if (axisSite.right) {
        seriesItem.yAxisIndex = ~axisSite.right.indexOf(item) ? 1 : 0;
      }

      if (stack && stackMap[item]) seriesItem.stack = stackMap[item];
      if (label) seriesItem.label = label;
      if (itemStyle) seriesItem.itemStyle = itemStyle;
      if (lineStyle) seriesItem.lineStyle = lineStyle;
      if (areaStyle) seriesItem.areaStyle = areaStyle;
      series.push(seriesItem);
    });
    return series;
  }

  function getLineYAxis(args) {
    var yAxisName = args.yAxisName,
        yAxisType = args.yAxisType,
        axisVisible = args.axisVisible,
        scale = args.scale,
        min = args.min,
        max = args.max,
        digit = args.digit;
    var yAxisBase = {
      type: "value",
      axisTick: {
        show: false
      },
      show: axisVisible
    };
    var yAxis = [];

    var _loop = function _loop(i) {
      if (yAxisType[i]) {
        yAxis[i] = Object.assign({}, yAxisBase, {
          axisLabel: {
            formatter: function formatter(val) {
              return getFormated(val, yAxisType[i], digit);
            }
          }
        });
      } else {
        yAxis[i] = Object.assign({}, yAxisBase);
      }

      yAxis[i].name = yAxisName[i] || "";
      yAxis[i].scale = scale[i] || false;
      yAxis[i].min = min[i] || null;
      yAxis[i].max = max[i] || null;
    };

    for (var i = 0; i < 2; i++) {
      _loop(i);
    }

    return yAxis;
  }

  function getLineTooltip(args) {
    var axisSite = args.axisSite,
        yAxisType = args.yAxisType,
        digit = args.digit,
        labelMap = args.labelMap,
        tooltipFormatter = args.tooltipFormatter;
    var rightItems = axisSite.right || [];
    var rightList = labelMap ? rightItems.map(function (item) {
      return labelMap[item] === undefined ? item : labelMap[item];
    }) : rightItems;
    return {
      trigger: "axis",
      formatter: function formatter(items) {
        if (tooltipFormatter) {
          return tooltipFormatter.apply(null, arguments);
        }

        var tpl = [];
        var _items$ = items[0],
            name = _items$.name,
            axisValueLabel = _items$.axisValueLabel;
        var title = name || axisValueLabel;
        tpl.push("".concat(title, "<br>"));
        items.forEach(function (_ref) {
          var seriesName = _ref.seriesName,
              data = _ref.data,
              marker = _ref.marker;
          var showData = null;
          var type = ~rightList.indexOf(seriesName) ? yAxisType[1] : yAxisType[0];
          var itemData = isArray(data) ? data[1] : data;
          showData = getFormated(itemData, type, digit);
          tpl.push(marker);
          tpl.push("".concat(seriesName, ": ").concat(showData));
          tpl.push("<br>");
        });
        return tpl.join("");
      }
    };
  }

  function getLegend(args) {
    var metrics = args.metrics,
        legendName = args.legendName,
        labelMap = args.labelMap;
    if (!legendName && !labelMap) return {
      data: metrics
    };
    var data = labelMap ? metrics.map(function (item) {
      return labelMap[item] == null ? item : labelMap[item];
    }) : metrics;
    return {
      data: data,
      formatter: function formatter(name) {
        return legendName[name] != null ? legendName[name] : name;
      }
    };
  }

  var line = function line(columns, rows, settings, extra) {
    rows = isArray(rows) ? rows : [];
    columns = isArray(columns) ? columns : [];
    var _settings$axisSite = settings.axisSite,
        axisSite = _settings$axisSite === void 0 ? {} : _settings$axisSite,
        _settings$yAxisType = settings.yAxisType,
        yAxisType = _settings$yAxisType === void 0 ? ["normal", "normal"] : _settings$yAxisType,
        _settings$xAxisType = settings.xAxisType,
        xAxisType = _settings$xAxisType === void 0 ? "category" : _settings$xAxisType,
        _settings$yAxisName = settings.yAxisName,
        yAxisName = _settings$yAxisName === void 0 ? [] : _settings$yAxisName,
        _settings$dimension = settings.dimension,
        dimension = _settings$dimension === void 0 ? [columns[0]] : _settings$dimension,
        _settings$xAxisName = settings.xAxisName,
        xAxisName = _settings$xAxisName === void 0 ? [] : _settings$xAxisName,
        _settings$axisVisible = settings.axisVisible,
        axisVisible = _settings$axisVisible === void 0 ? true : _settings$axisVisible,
        area = settings.area,
        stack = settings.stack,
        _settings$scale = settings.scale,
        scale = _settings$scale === void 0 ? [false, false] : _settings$scale,
        _settings$min = settings.min,
        min = _settings$min === void 0 ? [null, null] : _settings$min,
        _settings$max = settings.max,
        max = _settings$max === void 0 ? [null, null] : _settings$max,
        _settings$nullAddZero = settings.nullAddZero,
        nullAddZero = _settings$nullAddZero === void 0 ? false : _settings$nullAddZero,
        _settings$digit = settings.digit,
        digit = _settings$digit === void 0 ? 2 : _settings$digit,
        _settings$legendName = settings.legendName,
        legendName = _settings$legendName === void 0 ? {} : _settings$legendName,
        _settings$labelMap = settings.labelMap,
        labelMap = _settings$labelMap === void 0 ? {} : _settings$labelMap,
        label = settings.label,
        itemStyle = settings.itemStyle,
        lineStyle = settings.lineStyle,
        areaStyle = settings.areaStyle;
    var tooltipVisible = extra.tooltipVisible,
        legendVisible = extra.legendVisible,
        tooltipFormatter = extra.tooltipFormatter;
    var metrics = columns.slice();

    if (axisSite.left && axisSite.right) {
      metrics = axisSite.left.concat(axisSite.right);
    } else if (axisSite.left && !axisSite.right) {
      metrics = axisSite.left;
    } else if (settings.metrics) {
      metrics = settings.metrics;
    } else {
      metrics.splice(columns.indexOf(dimension[0]), 1);
    } //指标 metrics


    var legend = legendVisible && getLegend({
      metrics: metrics,
      legendName: legendName,
      labelMap: labelMap
    });
    var tooltip = tooltipVisible && getLineTooltip({
      axisSite: axisSite,
      yAxisType: yAxisType,
      digit: digit,
      labelMap: labelMap,
      xAxisType: xAxisType,
      tooltipFormatter: tooltipFormatter
    });
    var xAxis = getLineXAxis({
      dimension: dimension,
      rows: rows,
      xAxisName: xAxisName,
      axisVisible: axisVisible,
      xAxisType: xAxisType
    });
    var yAxis = getLineYAxis({
      yAxisName: yAxisName,
      yAxisType: yAxisType,
      axisVisible: axisVisible,
      scale: scale,
      min: min,
      max: max,
      digit: digit
    });
    var series = getLineSeries({
      rows: rows,
      axisSite: axisSite,
      metrics: metrics,
      area: area,
      stack: stack,
      nullAddZero: nullAddZero,
      labelMap: labelMap,
      label: label,
      itemStyle: itemStyle,
      lineStyle: lineStyle,
      areaStyle: areaStyle,
      xAxisType: xAxisType,
      dimension: dimension
    });
    var options = {
      legend: legend,
      xAxis: xAxis,
      series: series,
      yAxis: yAxis,
      tooltip: tooltip
    };
    return options;
  };

  chart.prototype.chartHandler = line;

  exports.eLine = chart;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
