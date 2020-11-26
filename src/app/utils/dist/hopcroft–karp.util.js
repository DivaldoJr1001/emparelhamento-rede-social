"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.runHopcroftKarp = void 0;
var delay_util_1 = require("./delay.util");
var empresasNodes;
var usuariosNodes;
var allEdges;
var chosenEdges;
var augmentingPath;
var currentPath;
var minDepth;
var currentDepth;
function runHopcroftKarp(datasets) {
    return __awaiter(this, void 0, void 0, function () {
        var currentNodes, _i, currentNodes_1, node, _loop_1, _a, augmentingPath_1, edge;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    empresasNodes = datasets.nodesDataSet.get().filter(function (node) { return node.shape === 'box'; }).map(function (node) {
                        node.parents = [];
                        node.chosen = false;
                        return node;
                    });
                    usuariosNodes = datasets.nodesDataSet.get().filter(function (node) { return node.shape === 'ellipse'; }).map(function (node) {
                        node.parents = [];
                        node.chosen = false;
                        return node;
                    });
                    allEdges = datasets.edgesDataSet.get();
                    chosenEdges = [];
                    currentPath = [];
                    _b.label = 1;
                case 1:
                    augmentingPath = [];
                    minDepth = Infinity;
                    currentDepth = -1;
                    currentNodes = empresasNodes.filter(function (node) { return !node.matched; });
                    for (_i = 0, currentNodes_1 = currentNodes; _i < currentNodes_1.length; _i++) {
                        node = currentNodes_1[_i];
                        exploreNode(node);
                    }
                    _loop_1 = function (edge) {
                        var empresaNode, usuarioNode, edgeIndex;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    empresaNode = empresasNodes.find(function (empresa) { return empresa.id === edge.from; });
                                    usuarioNode = usuariosNodes.find(function (usuario) { return usuario.id === edge.to; });
                                    edgeIndex = chosenEdges.findIndex(function (chosenEdge) { return chosenEdge === edge; });
                                    if (edgeIndex < 0) {
                                        chosenEdges.push(edge);
                                        edge.dashes = false;
                                        edge.color.color = 'green';
                                        edge.color.inherit = false;
                                        datasets.edgesDataSet.update(edge);
                                        empresaNode.matched = true;
                                        usuarioNode.matched = true;
                                    }
                                    else {
                                        chosenEdges.splice(edgeIndex, 1);
                                        edge.dashes = true;
                                        edge.color.color = 'black';
                                        edge.color.inherit = false;
                                        datasets.edgesDataSet.update(edge);
                                    }
                                    return [4 /*yield*/, delay_util_1.delay(2000)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, augmentingPath_1 = augmentingPath;
                    _b.label = 2;
                case 2:
                    if (!(_a < augmentingPath_1.length)) return [3 /*break*/, 5];
                    edge = augmentingPath_1[_a];
                    return [5 /*yield**/, _loop_1(edge)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _a++;
                    return [3 /*break*/, 2];
                case 5:
                    empresasNodes.map(function (node) {
                        node.parents = [];
                        return node;
                    });
                    usuariosNodes.map(function (node) {
                        node.parents = [];
                        return node;
                    });
                    _b.label = 6;
                case 6:
                    if (augmentingPath.length > 0) return [3 /*break*/, 1];
                    _b.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.runHopcroftKarp = runHopcroftKarp;
function exploreNode(node) {
    currentDepth++;
    var isEmpresa = (node.shape === 'box');
    if (currentDepth < minDepth) {
        if (isEmpresa) {
            var linkedEdges = allEdges.filter(function (edge) { return edge.from === node.id &&
                node.parents.findIndex(function (parent) { return parent.id === edge.to; }) < 0; });
            var _loop_2 = function (edge) {
                var nextNode = usuariosNodes.find(function (usuarioNode) { return usuarioNode.id === edge.to; });
                if (nextNode.parents.findIndex(function (parent) { return parent === node; }) < 0) {
                    nextNode.parents.push(node);
                    currentPath.push(edge);
                    exploreNode(nextNode);
                }
            };
            for (var _i = 0, linkedEdges_1 = linkedEdges; _i < linkedEdges_1.length; _i++) {
                var edge = linkedEdges_1[_i];
                _loop_2(edge);
            }
        }
        else if (node.matched) {
            var linkedEdge_1 = chosenEdges.find(function (edge) { return edge.to === node.id; });
            var nextNode = empresasNodes.find(function (empresaNode) { return empresaNode.id === linkedEdge_1.from; });
            nextNode.parents.push(node);
            currentPath.push(linkedEdge_1);
            exploreNode(nextNode);
        }
        else if (currentPath.length < augmentingPath.length || augmentingPath.length === 0) {
            minDepth = currentDepth;
            augmentingPath = [];
            for (var _a = 0, currentPath_1 = currentPath; _a < currentPath_1.length; _a++) {
                var edge = currentPath_1[_a];
                augmentingPath.push(edge);
            }
        }
    }
    if (currentPath.length > 0) {
        currentPath.pop();
    }
    currentDepth--;
}
