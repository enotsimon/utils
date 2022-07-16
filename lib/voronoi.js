'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 *  it is voronoi_diagram.js rewrited
 *  we take original voronoi diagram from d3,
 *  add lloyd relaxation
 *  and then reorganize its internal structure, cause its annoying and awful, for my taste
 *  and to each cell we add array of links to near nodes, sorted by distance
 */

// x, y for cell center i assume
const generate = exports.generate = (nodes, widthTo, heightTo, lloydRelaxationSteps = 0, lloydRelaxationToMove = 1, widthFrom = 0, heightFrom = 0) => {
  const d3Voronoi = d3.voronoi().x(p => p.x).y(p => p.y).extent([[widthFrom, heightFrom], [widthTo, heightTo]]);
  const d3Diagram = R.reduce(acc => lloydRelaxation(acc, d3Voronoi, lloydRelaxationToMove), d3Voronoi(nodes), R.range(0, lloydRelaxationSteps));
  // rewrite edges and nodes
  // the problem with original d3 diagram is not only that node is array(2), but also is that
  // it has nodes duplicates! we are to "regather" all nodes
  const diagram = {};
  diagram.nodes = [];
  diagram.edges = d3Diagram.edges.map(edge => {
    let node_from;
    let node_to;
    diagram.nodes.forEach(node => {
      if (seemsLikeNodesAreEqual(node, edge[0])) {
        node_from = node;
      }
      if (seemsLikeNodesAreEqual(node, edge[1])) {
        node_to = node;
      }
    });
    if (!node_from) {
      node_from = { x: edge[0][0], y: edge[0][1], cells: [], links: [] };
      diagram.nodes.push(node_from);
    }
    if (!node_to) {
      node_to = { x: edge[1][0], y: edge[1][1], cells: [], links: [] };
      diagram.nodes.push(node_to);
    }
    // node_from.links.push(node_to);
    (0, _utils.pushUniq)(node_to, node_from.links);
    node_to.links.push(node_from);
    (0, _utils.pushUniq)(node_from, node_to.links);

    (0, _utils.pushUniq)(edge.left.data, node_from.cells);
    (0, _utils.pushUniq)(edge.left.data, node_to.cells);
    if (edge.right) {
      (0, _utils.pushUniq)(edge.right.data, node_from.cells);
      (0, _utils.pushUniq)(edge.right.data, node_to.cells);
    }
    return {
      from: node_from,
      to: node_to,
      left: edge.left.data,
      right: edge.right ? edge.right.data : null
    };
  });
  // rewrite cells
  diagram.cells = d3Diagram.cells.map(orig_cell => {
    const cell = orig_cell.site.data; // original object!!! and we change it here!!!
    cell.nodes = diagram.nodes.filter(node => node.cells.indexOf(cell) !== -1);
    cell.nodes.sort((n1, n2) => {
      const angle1 = (0, _utils.toPolarCoords)({ x: n1.x - cell.x, y: n1.y - cell.y }).angle;
      const angle2 = (0, _utils.toPolarCoords)({ x: n2.x - cell.x, y: n2.y - cell.y }).angle;
      return angle1 - angle2;
    });
    cell.halfedges = orig_cell.halfedges;
    cell.index = orig_cell.site.index;
    // !!! we rewrite origin coordinates that COULD change (after lloyd relaxation)
    cell.x = orig_cell.site[0];
    cell.y = orig_cell.site[1];
    return cell;
  });
  diagram.cells.forEach(cell => {
    const links = [];
    cell.halfedges.forEach(halfedge_index => {
      const halfedge = diagram.edges[halfedge_index];
      const link_site = halfedge.left === cell ? halfedge.right : halfedge.left;
      // near-border halfedges dont have right or left cell
      if (!link_site) {
        return;
      }
      (0, _utils.pushUniq)(diagram.cells[link_site.index], links);
    });
    // links sorted by distance -- from lowest to highest!
    links.sort((e1, e2) => (0, _utils.distance)(cell, e1) - (0, _utils.distance)(cell, e2));
    /* eslint-disable-next-line no-param-reassign */
    cell.links = links;
  });
  diagram.width = widthTo - widthFrom;
  diagram.height = heightTo - heightFrom;

  // final checks
  diagram.nodes.forEach(node => {
    /* its normal -- 4 or more nodes lie on circle
    if (node.links.length > 3) {
      console.log("ITS TOTAL DISASTER", node.x, node.y);
      node.links.forEach(e => console.log("DISASTER", e.x, e.y));
      //throw('ITS TOTAL DISASTER voronoi diagram');
    }
    */
    if (node.links.length < 2) {
      console.log('a little split', node.x, node.y, node.links);
      throw 'ITS TOTAL DISASTER voronoi diagram';
    }
    /* its normal too
    if (node.cells.length > 3 || node.cells.length == 0) {
      console.log("BAD cells", node.x, node.y, node.cells.length);
      //throw('ITS TOTAL DISASTER voronoi diagram');
    }
    */
  });

  return diagram;
};

const lloydRelaxation = (d3Diagram, d3Voronoi, toMove = 1) => {
  const newPoints = d3Diagram.polygons().map(p => {
    // well, its not real lloyd relaxation, we move new cell center not to centroid, but move
    // it by value of 'to_move' to direction to centroid
    const poly = p.map(e => {
      return { x: e[0], y: e[1] };
    });
    const pf = (0, _utils.convexPolygonCentroid)(poly);
    // ...p.data is for passing original input point to cell like d3 does
    return _extends({}, p.data, (0, _utils.moveByVector)(p.data, pf, toMove));
  });
  return d3Voronoi(newPoints);
};

// PRIVATE. TRY to heal shizophrenia -- different, but very close nodes
// but it can lead us to total
const seemsLikeNodesAreEqual = (node, d3Node) => {
  const veryCloseIs = 0.0000000000001;
  return Math.abs(node.x - d3Node[0]) < veryCloseIs && Math.abs(node.y - d3Node[1]) < veryCloseIs;
  // return node.x == old_node[0] && node.y == old_node[1];
};