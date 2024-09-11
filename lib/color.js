'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forRGB = exports.allChannelMatrixes = exports.to_pixi = exports.darker = exports.brighter = exports.random = exports.random_near = exports.matrixToPIXI = exports.matrixToRGB = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _random = require('random');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// import random from 'random'

// 0 -- 255
const matrixToRGB = exports.matrixToRGB = ({ r, g, b }) => [r, g, b];
const matrixToPIXI = exports.matrixToPIXI = ({ r, g, b }) => to_pixi([r, g, b]);

const random_near = exports.random_near = ([r, g, b], step = 10, count = 2) => {
  return forRGB([r, g, b], e => randomChannel(e, step, count));
};

const random = exports.random = ([r, g, b], step = 10) => {
  return forRGB([r, g, b], e => randomByFloor(e, step));
};

const brighter = exports.brighter = ([r, g, b], step = 10) => {
  return forRGB([r, g, b], e => Math.min(e + step, 255));
};

const darker = exports.darker = ([r, g, b], step = 10) => {
  return forRGB([r, g, b], e => Math.max(e - step, 0));
};

const to_pixi = exports.to_pixi = ([r, g, b]) => {
  /* eslint-disable-next-line no-bitwise */
  return (r << 16) + (g << 8) + b;
};

const allChannelMatrixes = exports.allChannelMatrixes = (order = 1, withMonochrome = false) => {
  if (order < 0 || order > 8) {
    throw new Error('order shold be from 0 to 8');
  }
  const step = 256 / 2 ** order;
  const cnt = 256 / step;
  // 0 is a special case, Math.max(v, 0) for it
  const multis = R.map(i => Math.max(i * step - 1, 0), R.range(0, cnt + 1));
  // console.log('LIST', order, step, cnt, multis)
  return matrixesByValuesList(multis, withMonochrome);
};

const matrixesByValuesList = (list, withMonochrome = false) => {
  const all = R.chain(r => R.chain(g => R.map(b => ({ r, g, b }))(list))(list))(list);
  if (withMonochrome) {
    return all;
  }
  return R.filter(({ r, g, b }) => !(r === g && r === b && g === b), all);
};

const forRGB = exports.forRGB = ([r, g, b], func) => [func(r), func(g), func(b)];

const randomChannel = (base, step, count) => {
  const rand = step * (0, _random.int)(-count, count);
  const res = base + rand;
  // return res > 255 ? 255 : res < 0 ? 0 : res
  return Math.min(255, Math.max(0, res));
};

const randomByFloor = (floor, step) => floor - step * (0, _random.int)(0, Math.floor(floor / step));