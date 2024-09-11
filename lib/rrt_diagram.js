'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcHeight = exports.generate = exports.pointsByGenerationsIndex = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _utils = require('./utils');

var U = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const REJECT_LIMIT = 500;

// gathers array which index is generation and value -- array of points of that generation
// Array<Array<RRTPoint>> actually is Array<RRTDiagram> but i cant call it so (((
// TODO point index! not object!
const pointsByGenerationsIndex = exports.pointsByGenerationsIndex = rrt => {
  const generations = R.sort((e1, e2) => e1 - e2, R.uniq(R.map(p => p.generation, rrt)));
  return R.map(g => R.map(p => p.index, R.filter(p => p.generation === g, rrt)))(generations);
};

const generate = exports.generate = (step, randPointFunc, roots) => {
  const rootPoints = (roots.length > 0 ? roots : [randPointFunc()]).map((p, index) => _extends({}, p, {
    // generation is my name to graph depth. TODO rename
    generation: 0,
    // index = 0 cause we should be able to access rrt array of point by array index!
    index,
    parent: null,
    children: []
  }));
  return calcChildrenIndex(generateRec(step, step ** 2, randPointFunc, rootPoints));
};

const calcHeight = exports.calcHeight = rrt => calcHeightRec(rrt, R.map(e => e.index, rrt), 0);

const calcHeightRec = (orrt, openList, height) => {
  const rrt = [...orrt];
  const leafs = R.filter(index => {
    const point = rrt[index];
    const plusGoodParent = point.parent !== null && rrt[point.parent].height === undefined ? 1 : 0;
    const goodChildren = R.filter(ci => rrt[ci].height === undefined, point.children);
    // sic! sometimes it can be 0
    const isLeaf = goodChildren.length + plusGoodParent <= 1;
    return isLeaf;
  }, openList);
  R.forEach(i => {
    // $FlowIgnore
    rrt[i].height = height;
  }, leafs);
  // not very optimal, should use index
  const newOpenList = R.difference(openList, leafs);
  if (newOpenList.length === 0) {
    // $FlowIgnore
    return rrt;
  }
  return calcHeightRec(rrt, newOpenList, height + 1);
};

const generateRec = (step, qStep, randPointFunc, points = []) => {
  const point = getNewPoint(points.length, step, qStep, randPointFunc, points);
  if (!point) {
    return points;
  }
  return generateRec(step, qStep, randPointFunc, [...points, point]);
};

const getNewPoint = (index, step, qStep, randPointFunc, points, counter = 0) => {
  if (counter > REJECT_LIMIT) {
    return null;
  }
  const newPoint = randPointFunc();
  const nearest = U.findNearestPoint(newPoint, points);
  if (U.quadDistance(newPoint, nearest) < qStep) {
    return getNewPoint(index, step, qStep, randPointFunc, points, counter + 1);
  }
  const theta = Math.atan2(newPoint.y - nearest.y, newPoint.x - nearest.x);
  const pp = {
    x: nearest.x + step * Math.cos(theta),
    y: nearest.y + step * Math.sin(theta),
    generation: nearest.generation + 1,
    index,
    parent: nearest.index,
    children: []
  };
  return pp;
};

const calcChildrenIndex = rrt => {
  return R.reduce((acc, p) => {
    if (p.parent == null) {
      return acc;
    }
    acc[p.parent].children.push(p.index);
    return acc;
  }, rrt, rrt);
};