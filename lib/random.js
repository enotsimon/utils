'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = exports.randElement = exports.randNth = exports.randomByWeight = exports.initRandom = undefined;

var _random = require('random');

var _random2 = _interopRequireDefault(_random);

var _seedrandom = require('seedrandom');

var _seedrandom2 = _interopRequireDefault(_seedrandom);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// не знаю что не так с пакетом random видимо биндинги на функциях, если не сделать такое то он функций не видит

// $FlowIgnore
const ri = _random2.default.int.bind(_random2.default);

const rf = _random2.default.float.bind(_random2.default);

const initRandom = exports.initRandom = (seed = null) => {
  _random2.default.use((0, _seedrandom2.default)(seed || Date.now()));
};

const randomByWeight = exports.randomByWeight = (config, rand = rf) => {
  const max = R.reduce((acc, { weight }) => acc + weight, 0, config);
  const randValue = rand(0, max);
  // $FlowIgnore Cannot call `R.reduceWhile` because  `WeightsConfig` [1] is incompatible with  array. wat!?
  const res = R.reduceWhile(
  // id === null for case when randValue = 0
  ({ id, sum }) => id === null || sum <= randValue, (acc, e) => {
    return { id: e.id, sum: acc.sum + e.weight };
  }, { id: null, sum: 0 }, Object.freeze(config));
  return res.id;
};

const randNth = exports.randNth = (list, rand = rf) => R.nth(Math.floor(rand() * list.length))(list);

const randElement = exports.randElement = (arr, rand = ri) => {
  if (arr.length === 0) {
    throw new Error('randElement input array cannot be empty');
  }
  return arr[rand(0, arr.length - 1)];
};

const shuffle = exports.shuffle = (arr, rand = ri) => arr.sort(() => rand(0, 2) - 1);