'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var numerify = _interopDefault(require('numerify'));
var utilsLite = require('utils-lite');

var getFormated = function getFormated(val, type, digit) {
  var defaultVal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '-';
  if (isNaN(val)) return defaultVal; //不是数字，返回'-'

  if (!type) return val; //没有传入type ，返回 val

  if (utilsLite.isFunction(type)) return type(val, numerify);
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
var $get = function $get(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send(null);

    xhr.onload = function () {
      resolve(JSON.parse(xhr.responseText));
    };

    xhr.onerror = function () {
      reject(JSON.parse(xhr.responseText));
    };
  });
};
var mapPromise = {};
var getMapJSON = function getMapJSON(_ref) {
  var position = _ref.position,
      positionJsonLink = _ref.positionJsonLink,
      beforeRegisterMapOnce = _ref.beforeRegisterMapOnce,
      mapURLProfix = _ref.mapURLProfix;
  var link = positionJsonLink || "".concat(mapURLProfix).concat(position, ".json");

  if (!mapPromise[link]) {
    mapPromise[link] = $get(link).then(function (res) {
      if (beforeRegisterMapOnce) res = beforeRegisterMapOnce(res);
      return res;
    });
  }

  return mapPromise[link];
};
var bmapPromise = null;
var amapPromise = null;
var getBmap = function getBmap(key, v) {
  if (!bmapPromise) {
    bmapPromise = new Promise(function (resolve, reject) {
      var callbackName = "bmap".concat(Date.now());
      window[callbackName] = resolve;
      var script = document.createElement('script');
      script.src = ["https://api.map.baidu.com/api?v=".concat(v || '2.0'), "ak=".concat(key), "callback=".concat(callbackName)].join('&');
      document.body.appendChild(script);
    });
  }

  return bmapPromise;
};
var getAmap = function getAmap(key, v) {
  if (!amapPromise) {
    amapPromise = new Promise(function (resolve, reject) {
      var callbackName = "amap".concat(Date.now());
      window[callbackName] = resolve;
      var script = document.createElement('script');
      script.src = ["https://webapi.amap.com/maps?v=".concat(v || '1.4.3'), "key=".concat(key), "callback=".concat(callbackName)].join('&');
      document.body.appendChild(script);
    });
  }

  return amapPromise;
};
function setArrayValue(arr, index, value) {
  if (arr[index] !== undefined) {
    arr[index].push(value);
  } else {
    arr[index] = [value];
  }
}

exports.getFormated = getFormated;
exports.getStackMap = getStackMap;
exports.$get = $get;
exports.getMapJSON = getMapJSON;
exports.getBmap = getBmap;
exports.getAmap = getAmap;
exports.setArrayValue = setArrayValue;
