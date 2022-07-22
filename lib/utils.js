'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findByLinks = exports.findSubgraphs = exports.removeLinks = exports.removeLink = exports.isSquaresIntersect = exports.intervalsCrossPointNoEdge = exports.intervalsCrossPoint = exports.linesCrossPoint = exports.lineFormula = exports.findNearestPoint = exports.angleBy3Points = exports.gaussFunction = exports.compareDistance = exports.quadDistance = exports.distance = exports.convexPolygonSquare = exports.convexPolygonCentroid = exports.vectorToDist = exports.moveByVector = exports.anglesDiff = exports.degrees = exports.radians = exports.fromPolarCoords = exports.toPolarCoords = exports.forSublist = exports.normalizeValue = exports.shuffle = exports.noOrderNoSameValuesPairs = exports.noOrderPairs = exports.noSameValuesPairs = exports.pairs = exports.randElement = exports.indexById = exports.execInCycleWithDelay = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _random = require('random');

var _random2 = _interopRequireDefault(_random);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// dont use it!!!


/**
 * its a copy-paste of old util.js but refactored
 * plus some new
 */
const execInCycleWithDelay = exports.execInCycleWithDelay = (index, limit, delay, func, final_func = () => {}) => {
  if (typeof limit === 'function' && !limit() || index >= limit) {
    final_func(index);
    return;
  }
  func(index);
  setTimeout(() => {
    execInCycleWithDelay(index + 1, limit, delay, func, final_func);
  }, delay);
};

const indexById = exports.indexById = R.indexBy(R.prop('id'));

const randElement = exports.randElement = arr => {
  if (arr.length === 0) {
    throw new Error('randElement input array cannot be empty');
  }
  return arr[_random2.default.int(0, arr.length - 1)];
};

const filterSame = list => R.filter(([v1, v2]) => !R.equals(v1, v2), list);
const noOrderPairsFilterSame = (list, filter) => {
  return pairs(list).reduce(([acc, closeList], [e1, e2]) => {
    // $FlowIgnore
    const p1 = `${JSON.stringify(e1)}|${JSON.stringify(e2)}`;
    // $FlowIgnore
    const p2 = `${JSON.stringify(e2)}|${JSON.stringify(e1)}`;
    if (filter && p1 === p2) {
      return [acc, closeList];
    }
    if (!closeList[p1] && !closeList[p2]) {
      acc.push([e1, e2]);
    }
    // clone closeList all the time is very expensive, have to reassing input args
    /* eslint-disable-next-line no-param-reassign */
    closeList[p1] = 1;
    /* eslint-disable-next-line no-param-reassign */
    closeList[p2] = 1;
    return [acc, closeList];
  }, [[], {}])[0];
};
const pairs = exports.pairs = list => R.chain(e1 => R.map(e2 => [e1, e2], list), list);
const noSameValuesPairs = exports.noSameValuesPairs = list => filterSame(pairs(list));
const noOrderPairs = exports.noOrderPairs = list => noOrderPairsFilterSame(list, false);
const noOrderNoSameValuesPairs = exports.noOrderNoSameValuesPairs = list => noOrderPairsFilterSame(list, true);

const shuffle = exports.shuffle = arr => arr.sort(() => _random2.default.int(0, 2) - 1);

const normalizeValue = exports.normalizeValue = (value, max, normal_max, min = 0, normal_min = 0) => {
  if (value > max || value < min) {
    console.log('value out of range', value, max, normal_max, min, normal_min);
    throw 'value out of range';
  }
  return (value - min) * (normal_max - normal_min) / (max - min) + normal_min;
};

const forSublist = exports.forSublist = (data, sublist, func, prop = 'id') => {
  const sublistInd = R.indexBy(e => e.toString(), sublist);
  // $FlowIgnore
  return R.map(e => {
    if (sublistInd[e[prop]]) {
      return func(e);
    }
    return e;
  }, data);
};

// ////////////////////////////////////////
// geometry
// ////////////////////////////////////////

// TODO rewrite to XYPoint
const toPolarCoords = exports.toPolarCoords = ({ x, y }) => {
  const radius = Math.sqrt(x * x + y * y);
  const angle = Math.atan2(y, x);
  return { angle, radius };
};

// TODO rewrite to PolarPoint
const fromPolarCoords = exports.fromPolarCoords = ({ angle, radius }) => {
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return { x, y };
};

const radians = exports.radians = deg => deg * Math.PI / 180;

const degrees = exports.degrees = rad => rad * 180 / Math.PI;

const anglesDiff = exports.anglesDiff = (a, b) => {
  const diff = Math.abs(a - b);
  return Math.min(diff, 2 * Math.PI - diff);
};

// length -- usually from 0 to 1
const moveByVector = exports.moveByVector = (from, to, length) => {
  // why i wrote j_max + 1? thats for last gradient area -- otherwise it will be just a single dot
  return { x: from.x + (to.x - from.x) * length, y: from.y + (to.y - from.y) * length };
};

const vectorToDist = exports.vectorToDist = (from, to, length = 1) => {
  const v = { x: to.x - from.x, y: to.y - from.y };
  const distance = Math.sqrt(v.x ** 2 + v.y ** 2);
  return { x: length * v.x / distance, y: length * v.y / distance };
};

const convexPolygonCentroid = exports.convexPolygonCentroid = points => {
  const p1 = points[0];
  let square_sum = 0;
  let xc = 0;
  let yc = 0;
  /* eslint-disable-next-line no-plusplus */
  for (let i = 1; i < points.length - 1; i++) {
    const p2 = points[i];
    const p3 = points[i + 1];
    const square = ((p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)) / 2; // triangle square
    square_sum += square;
    xc += square * (p1.x + p2.x + p3.x) / 3;
    yc += square * (p1.y + p2.y + p3.y) / 3;
  }
  return { x: xc / square_sum, y: yc / square_sum };
};

/**
 * square of convex polygon. points should be sorted by angle to center!!!
 */
const convexPolygonSquare = exports.convexPolygonSquare = points => {
  const p1 = points[0];
  let square = 0;
  for (let i = 1; i < points.length - 1; i + 1) {
    const p2 = points[i];
    const p3 = points[i + 1];
    square += Math.abs((p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)) / 2;
  }
  return square;
};

const distance = exports.distance = (p1, p2) => {
  return Math.sqrt(quadDistance(p1, p2));
};

const quadDistance = exports.quadDistance = (p1, p2) => {
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
};

const compareDistance = exports.compareDistance = (p1, p2, target) => {
  return Math.sign(quadDistance(p1, p2) - target ** 2);
};

const gaussFunction = exports.gaussFunction = (x, sigma, mu) => {
  /* eslint-disable-next-line no-restricted-properties */
  return 1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.pow(Math.E, -(Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2))));
};

/**
 * angle between three points where b is apex (middle point)
 */
const angleBy3Points = exports.angleBy3Points = (a, b, c) => {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const cb = { x: b.x - c.x, y: b.y - c.y };
  const dot = ab.x * cb.x + ab.y * cb.y; // dot product
  const cross = ab.x * cb.y - ab.y * cb.x; // cross product
  const alpha = Math.atan2(cross, dot);
  return alpha;
  // return (int) floor(alpha * 180. / pi + 0.5);
};

const findNearestPoint = exports.findNearestPoint = (target, points) => {
  if (points.length === 0) {
    throw 'empty points array';
  }
  const maped = R.map(p => [p, distance(p, target)])(points);
  return R.reduce(([aN, aD], [cN, cD]) => cD < aD ? [cN, cD] : [aN, aD], maped[0], maped)[0];
};

// take two points and find formula of line between them in (ax + by + c = 0) style
const lineFormula = exports.lineFormula = (p1, p2) => {
  // (y1 - y2) * x + (x2 - x1) * y + (x1*y2 -x2*y1) = 0 ((ax + by + c = 0))
  const a = p1.y - p2.y;
  const b = p2.x - p1.x;
  const c = p1.x * p2.y - p2.x * p1.y;
  // resulting line is the same. we do that for comparing formulae
  return a >= 0 ? { a, b, c } : { a: -a, b: -b, c: -c };
};

// calculates two lines cross point lines taken by their a,b,c coef in (ax + by + c = 0) style
const linesCrossPoint = exports.linesCrossPoint = (f1, f2) => {
  const tmp = f1.a * f2.b - f2.a * f1.b;
  // they are parallel
  if (tmp === 0) {
    return null;
  }
  const x = -(f1.c * f2.b - f2.c * f1.b) / tmp;
  const y = -(f1.a * f2.c - f2.a * f1.c) / tmp;
  return { x, y };
};

const intervalsCrossPoint = exports.intervalsCrossPoint = (a1, a2, b1, b2) => {
  if (R.equals(a1, a2) || R.equals(b1, b2)) {
    throw new Error('a1 === a2 or b1 === b2 which is not allowed');
  }
  if (!isSquaresIntersect(a1, a2, b1, b2)) {
    return null;
  }
  const c = linesCrossPoint(lineFormula(a1, a2), lineFormula(b1, b2));
  if (!c) {
    return null;
  }
  if (between(c.x, a1.x, a2.x) && between(c.y, a1.y, a2.y) && between(c.x, b1.x, b2.x) && between(c.y, b1.y, b2.y)) {
    return c;
  }
  return null;
};

const intervalsCrossPointNoEdge = exports.intervalsCrossPointNoEdge = (a1, a2, b1, b2) => {
  if (R.equals(a1, b1) || R.equals(a1, b2) || R.equals(a2, b1) || R.equals(a2, b2)) {
    return null;
  }
  return intervalsCrossPoint(a1, a2, b1, b2);
};

const isSquaresIntersect = exports.isSquaresIntersect = (a1, a2, b1, b2) => {
  const [axmin, axmax] = minmax(a1.x, a2.x);
  const [aymin, aymax] = minmax(a1.y, a2.y);
  const [bxmin, bxmax] = minmax(b1.x, b2.x);
  const [bymin, bymax] = minmax(b1.y, b2.y);
  return Math.min(axmax, bxmax) >= Math.max(axmin, bxmin) && Math.min(aymax, bymax) >= Math.max(aymin, bymin);
};

const between = (target, n1, n2) => {
  const [min, max] = minmax(n1, n2);
  return min <= target && target <= max;
};

const minmax = (n1, n2) => n1 > n2 ? [n2, n1] : [n1, n2];

// ////////////////////////////////////////
// graph
// ////////////////////////////////////////


/* bi-directional links! */
const removeLink = exports.removeLink = (graph, p1, p2) => {
  return removeLinks(graph, [{ p1, p2 }]);
};

/* bi-directional links! */
const removeLinks = exports.removeLinks = (graph, links) => {
  const copy = _extends({}, graph);
  R.forEach(({ p1, p2 }) => {
    copy[p1].links = R.without([p2], copy[p1].links);
    copy[p2].links = R.without([p1], copy[p2].links);
  }, links);
  return copy;
};

const findSubgraphs = exports.findSubgraphs = graph => findSubgraphsRec(graph, R.values(graph), []);

const findSubgraphsRec = (graph, openList, result) => {
  if (openList.length === 0) {
    return result;
  }
  const chain = findByLinks([openList[0].id], graph);
  const newOpenList = R.filter(e => !chain[e.id], openList);
  result.push(chain);
  return findSubgraphsRec(graph, newOpenList, result);
};

/* bi-directional links! */
const findByLinks = exports.findByLinks = (curEdges, graph, filter = () => true, closeList = {}) => {
  if (typeof curEdges === 'string') {
    return findByLinks([curEdges], graph, filter, closeList);
  }
  curEdges.forEach(id => {
    if (!graph[id]) {
      throw new Error(`id ${id} not found in graph`);
    }
  });
  const curEdgesFiltered = R.indexBy(e => e, R.filter(id => !closeList[id] && filter(graph[id]), curEdges));
  if (R.equals(curEdgesFiltered, {})) {
    return closeList;
  }
  const newEdgesA = [];
  /* eslint-disable-next-line array-callback-return */
  R.map(edge => {
    if (curEdgesFiltered[edge.id] !== undefined) {
      /* eslint-disable-next-line no-param-reassign */
      closeList[edge.id] = edge.id;
      newEdgesA.push(edge.links);
    }
  }, graph);
  // $FlowIgnore
  const newEdges = R.uniq(R.flatten(newEdgesA));
  // console.log('newEdges', JSON.stringify(newEdges, null, 2))
  // console.log('closeList', JSON.stringify(closeList, null, 2))
  return findByLinks(newEdges, graph, filter, closeList);
};

// ??? experimental. some standard routine for cyclic openList processing
/*
export const doWhileNotEmpty = (openList: Array<any>, func): boolean => {
  let length_before
  let step = 0
  do {
    length_before = openList.length
    openList = openList.filter(element => !func(element, step++))
    if (length_before == openList.length) {
      console.log('do_while_not_empty() openList length not chenged, bailing out', length_before, openList)
      return false
    }
  } while (openList.length)
  return true
}
*/

/*
FROM trees_util
curve_thru_points(context, path) {
  let sp = {x: (path[0].x + path[1].x)/2, y: (path[0].y + path[1].y)/2};
  context.moveTo(path[0].x, path[0].y);
  context.lineTo(sp.x, sp.y);
  for (let i = 2; i < path.length; i++) {
    let p = {x: (path[i-1].x + path[i].x)/2, y: (path[i-1].y + path[i].y)/2};
    context.quadraticCurveTo(path[i-1].x, path[i-1].y, p.x, p.y);
  }
  let l = path.length-1;
  context.lineTo(path[l].x, path[l].y);
}

// array of points to draw petals "star"
// frame_factor -- cur_frame / max_frame_value
// TODO: big radius points do not depend on frame, can move them out
path_petals(frame, angle_step, start_angle, big_radius, width, frame_factor) {
  let small_radius = 0.13*width * frame_factor
  let focus = (big_radius - small_radius) / 2 + small_radius;
  let path = [];
  let xf1, yf1, xf2, yf2, xb, yb, xs, ys
  for (let angle = 0; angle < 2*Math.PI; angle += angle_step) {
    let rotated_angle = angle + start_angle; // o my god, we need vertical top petal
    let xf_factor = 0.2 * frame / 100;
    [xf1, yf1] = this.from_polar_coords(rotated_angle - xf_factor, focus);
    [xf2, yf2] = this.from_polar_coords(rotated_angle + xf_factor, focus);
    [xb, yb] = this.from_polar_coords(rotated_angle, big_radius);
    [xs, ys] = this.from_polar_coords(rotated_angle + angle_step/2, small_radius);
    path.push([xf1, yf1, xb, yb]);
    path.push([xf2, yf2, xs, ys]);
  }
  return path;
}

// finds ammm... dunno how to say -- side of given point against line
point_side_to_line(point, formula) {
  let ret = formula.a * point.x + formula.b * point.y + formula.c;
  // !!! well, we encounter real troubles with small values, quite often
  if (Math.abs(ret) < 0.00000001) { return 0; }
  return ret;
}

perpendicular_bisector_formula(p1, p2) {
  return {
    a: p2.x - p1.x,
    b: p2.y - p1.y,
    c: (Math.pow(p1.x, 2) - Math.pow(p2.x, 2) + Math.pow(p1.y, 2) - Math.pow(p2.y, 2))/2
  };
}

plane_formula(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
  let A = y1*(z2 - z3) + y2*(z3 - z1) + y3*(z1 - z2),
      B = z1*(x2 - x3) + z2*(x3 - x1) + z3*(x1 - x2),
      C = x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2),
      D = -1*( x1*(y2*z3 - y3*z2) + x2*(y3*z1 - y1*z3) + x3*(y1*z2 - y2*z1) );
  return [A, B, C, D];
}
*/