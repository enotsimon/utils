'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDotsIntoCircleWithMinDistance = exports.randomPointInSquare = exports.randomPointPolar = exports.randomPointsInSquare = exports.randomPointsPolarNaive = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _random = require('random');

var _random2 = _interopRequireDefault(_random);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _utils = require('./utils');

var U = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const randomPointsPolarNaive = exports.randomPointsPolarNaive = (count, scale = 1) => R.map(() => {
  const angle = _random2.default.float(0, 2 * Math.PI);
  const radius = _random2.default.float(0, scale);
  return U.fromPolarCoords({ angle, radius });
})(R.range(0, count));

const randomPointsInSquare = exports.randomPointsInSquare = (count, scale = 1) => R.map(() => {
  return { x: _random2.default.float(0, scale), y: _random2.default.float(0, scale) };
})(R.range(0, count));

const randomPointPolar = exports.randomPointPolar = (radius = 1) => ({ angle: 2 * Math.PI * _random2.default.float(), radius: radius * Math.sqrt(_random2.default.float()) });

const randomPointInSquare = exports.randomPointInSquare = (scale = 1) => ({ x: _random2.default.float(0, scale), y: _random2.default.float(0, scale) });

const addDotsIntoCircleWithMinDistance = exports.addDotsIntoCircleWithMinDistance = (scale, minDistance, limit, dots = {}, cycles = 0) => {
  if (limit === 0) {
    return dots;
  }
  if (cycles === 1000) {
    throw new Error('too many cycles');
  }
  // TODO stupid way, but -- dont care
  const x = _random2.default.int(-scale, scale);
  const y = _random2.default.int(-scale, scale);
  const { angle, radius } = U.toPolarCoords({ x, y });
  // minDistance i added because of circle contour
  if (radius > scale - minDistance) {
    return addDotsIntoCircleWithMinDistance(scale, minDistance, limit, dots, cycles);
  }
  const tooCloseToAnotherDot = R.find(d => U.distance(d, { x, y }) <= minDistance)(R.values(dots));
  if (tooCloseToAnotherDot) {
    return addDotsIntoCircleWithMinDistance(scale, minDistance, limit, dots, cycles + 1);
  }
  const allIds = R.keys(dots).map(e => Number(e));
  const id = ((allIds.length ? R.reduce((max, cur) => Math.max(max, cur), allIds[0], allIds) : 0) + 1).toString();
  const dot = { id, angle, radius, x, y };
  return addDotsIntoCircleWithMinDistance(scale, minDistance, limit - 1, _extends({}, dots, { [dot.id]: dot }), 0);
};