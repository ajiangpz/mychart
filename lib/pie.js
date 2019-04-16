(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('echarts/lib/chart/pie'), require('echarts/lib/echarts'), require('echarts/lib/component/tooltip'), require('echarts/lib/component/legend')) :
  typeof define === 'function' && define.amd ? define(['exports', 'echarts/lib/chart/pie', 'echarts/lib/echarts', 'echarts/lib/component/tooltip', 'echarts/lib/component/legend'], factory) :
  (global = global || self, factory(global.ePie = {}, null, global.echarts));
}(this, function (exports, pie$1, echartsLib) { 'use strict';

  echartsLib = echartsLib && echartsLib.hasOwnProperty('default') ? echartsLib['default'] : echartsLib;

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
  var itemPoint = function itemPoint(color) {
    return ['<span style="', "background-color:".concat(color, ";"), 'display: inline-block;', 'width: 10px;', 'height: 10px;', 'border-radius: 50%;', 'margin-right:2px;', '"></span>'].join('');
  };
  var ECHARTS_SETTINGS = ['grid', 'dataZoom', 'visualMap', 'toolbox', 'title', 'legend', 'xAxis', 'yAxis', 'radar', 'tooltip', 'axisPointer', 'brush', 'geo', 'timeline', 'graphic', 'series', 'backgroundColor', 'textStyle'];

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

  function cloneDeep(v) {
    return JSON.parse(JSON.stringify(v));
  }

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
  function setArrayValue(arr, index, value) {
    if (arr[index] !== undefined) {
      arr[index].push(value);
    } else {
      arr[index] = [value];
    }
  }

  var pieRadius = 100;
  var ringRadius = [80, 100];
  var roseRingRadius = [20, 100];
  var pieOffsetY = 200;

  function getPieSeries(args) {
    var innerRows = args.innerRows,
        dataType = args.dataType,
        percentShow = args.percentShow,
        dimension = args.dimension,
        metrics = args.metrics,
        radius = args.radius,
        offsetY = args.offsetY,
        selectedMode = args.selectedMode,
        hoverAnimation = args.hoverAnimation,
        digit = args.digit,
        roseType = args.roseType,
        label = args.label,
        level = args.level,
        limitShowNum = args.limitShowNum,
        isRing = args.isRing,
        labelLine = args.labelLine,
        itemStyle = args.itemStyle;
    var series = [];
    var levelTemp = {};
    var rowsTemp = [];

    if (level) {
      level.forEach(function (levelItems, index) {
        levelItems.forEach(function (item) {
          setArrayValue(levelTemp, item, index);
        });
      });
      innerRows.forEach(function (row) {
        var itemLevel = levelTemp[row[dimension]];

        if (itemLevel && itemLevel.length) {
          itemLevel.forEach(function (levelItem) {
            setArrayValue(rowsTemp, levelItem, row);
          });
        }
      });
    } else {
      rowsTemp.push(innerRows);
    }

    var seriesBase = {
      type: 'pie',
      selectedMode: selectedMode,
      hoverAnimation: hoverAnimation,
      roseType: roseType,
      center: ['50%', offsetY]
    };
    var rowsTempLength = rowsTemp.length;
    rowsTemp.forEach(function (dataRows, index) {
      var seriesItem = Object.assign({
        data: []
      }, seriesBase);
      var centerWidth = radius / rowsTempLength;

      if (!index) {
        seriesItem.radius = isRing ? radius : centerWidth;
      } else {
        var outerWidth = centerWidth + radius / (2 * rowsTempLength) * (2 * index - 1);
        var innerWidth = outerWidth + radius / (2 * rowsTempLength);
        seriesItem.radius = [outerWidth, innerWidth];
      }

      if (rowsTempLength > 1 && index === 0) {
        seriesItem.label = {
          normal: {
            position: 'inner'
          }
        };
      }

      if (label) seriesItem.label = label;
      if (labelLine) seriesItem.labelLine = labelLine;
      if (itemStyle) seriesItem.itemStyle = itemStyle;

      if (percentShow) {
        seriesItem.label = {
          normal: {
            show: true,
            position: rowsTempLength > 1 && index === 0 ? 'inner' : 'outside',
            formatter: function formatter(item) {
              var tpl = [];
              tpl.push("".concat(item.name, ":"));
              tpl.push(getFormated(item.value, dataType, digit));
              tpl.push("(".concat(item.percent, "%)"));
              return tpl.join(' ');
            }
          }
        };
      }

      seriesItem.data = dataRows.map(function (row) {
        return {
          name: row[dimension],
          value: row[metrics]
        };
      });
      series.push(seriesItem);
    });

    if (limitShowNum && limitShowNum < series[0].data.length) {
      var firstData = series[0].data;
      var remainArr = firstData.slice(limitShowNum, firstData.length);
      var sum = 0;
      remainArr.forEach(function (item) {
        sum += item.value;
      });
      series[0].data = firstData.slice(0, limitShowNum);
      series[0].data.push({
        name: '其他',
        value: sum
      });
    }

    return series;
  }

  function getPieLegend(args) {
    var innerRows = args.innerRows,
        dimension = args.dimension,
        legendLimit = args.legendLimit,
        legendName = args.legendName,
        level = args.level,
        limitShowNum = args.limitShowNum;
    var legend = [];
    var levelTemp = [];

    if (level) {
      level.forEach(function (levelItem) {
        levelItem.forEach(function (item) {
          levelTemp.push(item);
        });
      });
      legend = levelTemp;
    } else if (limitShowNum && limitShowNum < innerRows.length) {
      for (var i = 0; i < limitShowNum; i++) {
        legend.push(innerRows[i][dimension]);
      }

      legend.push('其他');
    } else {
      legend = innerRows.map(function (row) {
        return row[dimension];
      });
    }

    if (legend.length) {
      return {
        data: legend,
        show: legend.length < legendLimit,
        formatter: function formatter(name) {
          return legendName[name] != null ? legendName[name] : name;
        }
      };
    } else {
      return false;
    }
  }

  function getPieTooltip(args) {
    var dataType = args.dataType,
        innerRows = args.innerRows,
        limitShowNum = args.limitShowNum,
        digit = args.digit,
        metrics = args.metrics,
        dimension = args.dimension;
    var sum = 0;
    var remainArr = innerRows.map(function (row) {
      sum += row[metrics];
      return {
        name: row[dimension],
        value: row[metrics]
      };
    }).slice(limitShowNum, innerRows.length);
    return {
      formatter: function formatter(item) {
        var tpl = [];
        tpl.push(itemPoint(item.color));

        if (limitShowNum && item.name === '其他') {
          tpl.push('其他:');
          remainArr.forEach(function (_ref) {
            var name = _ref.name,
                value = _ref.value;
            var percent = getFormated(value / sum, 'percent');
            tpl.push("<br>".concat(name, ":"));
            tpl.push(getFormated(value, dataType, digit));
            tpl.push("(".concat(percent, ")"));
          });
        } else {
          tpl.push("".concat(item.name, ":"));
          tpl.push(getFormated(item.value, dataType, digit));
          tpl.push("(".concat(item.percent, "%)"));
        }

        return tpl.join(' ');
      }
    };
  }

  var pie = function pie(columns, rows, settings, extra, isRing) {
    var innerRows = cloneDeep(rows);
    var _settings$dataType = settings.dataType,
        dataType = _settings$dataType === void 0 ? 'normal' : _settings$dataType,
        percentShow = settings.percentShow,
        _settings$dimension = settings.dimension,
        dimension = _settings$dimension === void 0 ? columns[0] : _settings$dimension,
        _settings$metrics = settings.metrics,
        metrics = _settings$metrics === void 0 ? columns[1] : _settings$metrics,
        _settings$roseType = settings.roseType,
        roseType = _settings$roseType === void 0 ? false : _settings$roseType,
        _settings$radius = settings.radius,
        radius = _settings$radius === void 0 ? isRing ? roseType ? roseRingRadius : ringRadius : pieRadius : _settings$radius,
        _settings$offsetY = settings.offsetY,
        offsetY = _settings$offsetY === void 0 ? pieOffsetY : _settings$offsetY,
        _settings$legendLimit = settings.legendLimit,
        legendLimit = _settings$legendLimit === void 0 ? 30 : _settings$legendLimit,
        _settings$selectedMod = settings.selectedMode,
        selectedMode = _settings$selectedMod === void 0 ? false : _settings$selectedMod,
        _settings$hoverAnimat = settings.hoverAnimation,
        hoverAnimation = _settings$hoverAnimat === void 0 ? true : _settings$hoverAnimat,
        _settings$digit = settings.digit,
        digit = _settings$digit === void 0 ? 2 : _settings$digit,
        _settings$legendName = settings.legendName,
        legendName = _settings$legendName === void 0 ? {} : _settings$legendName,
        _settings$label = settings.label,
        label = _settings$label === void 0 ? false : _settings$label,
        _settings$level = settings.level,
        level = _settings$level === void 0 ? false : _settings$level,
        _settings$limitShowNu = settings.limitShowNum,
        limitShowNum = _settings$limitShowNu === void 0 ? 0 : _settings$limitShowNu,
        labelLine = settings.labelLine,
        itemStyle = settings.itemStyle;
    var tooltipVisible = extra.tooltipVisible,
        legendVisible = extra.legendVisible;
    if (limitShowNum) innerRows.sort(function (a, b) {
      return b[metrics] - a[metrics];
    });
    var seriesParams = {
      innerRows: innerRows,
      dataType: dataType,
      percentShow: percentShow,
      dimension: dimension,
      metrics: metrics,
      radius: radius,
      offsetY: offsetY,
      selectedMode: selectedMode,
      hoverAnimation: hoverAnimation,
      digit: digit,
      roseType: roseType,
      label: label,
      level: level,
      legendName: legendName,
      limitShowNum: limitShowNum,
      isRing: isRing,
      labelLine: labelLine,
      itemStyle: itemStyle
    };
    var series = getPieSeries(seriesParams);
    var legendParams = {
      innerRows: innerRows,
      dimension: dimension,
      legendLimit: legendLimit,
      legendName: legendName,
      level: level,
      limitShowNum: limitShowNum
    };
    var legend = legendVisible && getPieLegend(legendParams);
    var tooltip = tooltipVisible && getPieTooltip({
      dataType: dataType,
      innerRows: innerRows,
      limitShowNum: limitShowNum,
      digit: digit,
      metrics: metrics,
      dimension: dimension
    });
    var options = {
      series: series,
      legend: legend,
      tooltip: tooltip
    };
    return options;
  };

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

  chart.prototype.chartHandler = pie;

  exports.ePie = chart;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
