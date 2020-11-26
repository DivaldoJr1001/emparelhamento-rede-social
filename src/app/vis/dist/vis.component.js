"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.VisComponent = void 0;
var core_1 = require("@angular/core");
var function_dialog_component_1 = require("../dialogs/function-dialog/function-dialog.component");
var import_export_dialog_component_1 = require("../dialogs/import-export-dialog/import-export-dialog.component");
var hopcroft_karp_util_1 = require("../utils/hopcroft\u2013karp.util");
var VisComponent = /** @class */ (function () {
    function VisComponent(dialog, cdr) {
        this.dialog = dialog;
        this.cdr = cdr;
        this.nodesDataSet = new vis.DataSet();
        this.edgesDataSet = new vis.DataSet();
        this.algorithmRunning = false;
        this.algorithmFinished = false;
        this.functionSettings = {
            createMode: true,
            functionTarget: '',
            nodesDataSet: this.nodesDataSet,
            edgesDataSet: this.edgesDataSet
        };
    }
    VisComponent.prototype.ngAfterViewInit = function () {
        this.draw();
    };
    VisComponent.prototype.draw = function () {
        var data = {
            nodes: this.nodesDataSet,
            edges: this.edgesDataSet
        };
        this.functionSettings = {
            createMode: true,
            functionTarget: '',
            nodesDataSet: this.nodesDataSet,
            edgesDataSet: this.edgesDataSet
        };
        var options = {};
        this.network = new vis.Network(this.networkContainer.nativeElement, data, options);
    };
    VisComponent.prototype.openImportExportDialog = function (importState) {
        var _this = this;
        var importExportSettings = {
            importState: importState,
            nodesDataSet: this.nodesDataSet,
            edgesDataSet: this.edgesDataSet
        };
        var dialogRef = this.dialog.open(import_export_dialog_component_1.ImportExportDialogComponent, {
            data: importExportSettings
        });
        dialogRef.afterClosed().subscribe(function (response) {
            if (response) {
                _this.nodesDataSet = response.nodesDataSet;
                _this.edgesDataSet = response.edgesDataSet;
                _this.draw();
                _this.cdr.detectChanges();
            }
        });
    };
    VisComponent.prototype.openFunctionDialog = function (functionTarget) {
        var _this = this;
        this.functionSettings.functionTarget = functionTarget;
        var dialogRef = this.dialog.open(function_dialog_component_1.FunctionDialogComponent, {
            data: this.functionSettings
        });
        dialogRef.afterClosed().subscribe(function (_) {
            _this.cdr.detectChanges();
        });
    };
    VisComponent.prototype.hasUsuario = function () {
        var nodes = this.nodesDataSet.get();
        return nodes.findIndex(function (node) { return node.shape === 'ellipse'; }) > -1;
    };
    VisComponent.prototype.hasEmpresa = function () {
        var nodes = this.nodesDataSet.get();
        return nodes.findIndex(function (node) { return node.shape === 'box'; }) > -1;
    };
    VisComponent.prototype.hasConexao = function () {
        var edges = this.edgesDataSet.get();
        return edges.length > 0;
    };
    VisComponent.prototype.menuConexaoDisabled = function () {
        return !this.functionSettings.createMode && !this.hasConexao() || !this.hasUsuario() || !this.hasEmpresa();
    };
    VisComponent.prototype.canRunAlgorithm = function () {
        return this.nodesDataSet.get().length > 0 && this.edgesDataSet.get().length > 0;
    };
    VisComponent.prototype.runAlgorithm = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.algorithmRunning = true;
                        return [4 /*yield*/, hopcroft_karp_util_1.runHopcroftKarp({
                                nodesDataSet: this.nodesDataSet,
                                edgesDataSet: this.edgesDataSet
                            })];
                    case 1:
                        _a.sent();
                        this.algorithmRunning = false;
                        this.algorithmFinished = true;
                        this.cdr.detectChanges();
                        return [2 /*return*/];
                }
            });
        });
    };
    VisComponent.prototype.resetAlgorithm = function () {
        var allNodes = this.nodesDataSet.get();
        var allEdges = this.edgesDataSet.get();
        for (var _i = 0, allNodes_1 = allNodes; _i < allNodes_1.length; _i++) {
            var node = allNodes_1[_i];
            if (node.shape === 'ellipse') {
                node.color.background = 'lightskyblue';
            }
            else {
                node.color.background = 'red';
                node.font = { color: 'white' };
            }
            this.nodesDataSet.update(node);
        }
        for (var _a = 0, allEdges_1 = allEdges; _a < allEdges_1.length; _a++) {
            var edge = allEdges_1[_a];
            edge.dashes = true;
            edge.color.color = 'black';
            edge.color.inherit = false;
            this.edgesDataSet.update(edge);
        }
        this.algorithmFinished = false;
        this.cdr.detectChanges();
    };
    __decorate([
        core_1.ViewChild('networkContainer', { static: false })
    ], VisComponent.prototype, "networkContainer");
    VisComponent = __decorate([
        core_1.Component({
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            selector: 'app-vis',
            templateUrl: './vis.component.html',
            styleUrls: ['./vis.component.scss']
        })
    ], VisComponent);
    return VisComponent;
}());
exports.VisComponent = VisComponent;
