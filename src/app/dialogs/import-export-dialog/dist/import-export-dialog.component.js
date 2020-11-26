"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.ImportExportDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var dialog_1 = require("@angular/material/dialog");
var ImportExportDialogComponent = /** @class */ (function () {
    function ImportExportDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.writtenData = new forms_1.FormControl('');
        this.importError = false;
    }
    ImportExportDialogComponent.prototype.ngOnInit = function () {
        this.importState = this.data.importState;
        if (!this.importState) {
            var exportObject = {
                nodes: this.data.nodesDataSet.get(),
                edges: this.data.edgesDataSet.get()
            };
            this.writtenData.setValue(JSON.stringify(exportObject));
        }
    };
    ImportExportDialogComponent.prototype.importData = function () {
        try {
            this.newNodesDataSet = new vis.DataSet();
            this.newEdgesDataSet = new vis.DataSet();
            this.importError = false;
            var importedObject = JSON.parse(this.writtenData.value);
            for (var _i = 0, _a = importedObject.nodes; _i < _a.length; _i++) {
                var node = _a[_i];
                if (node.shape !== 'box' && node.shape !== 'ellipse') {
                    node.shape = 'ellipse';
                    node.color.background = 'lightskyblue';
                    if (this.duplicatedLabel(node.label, node.shape)) {
                        node.shape = 'box';
                        node.color.background = 'red';
                        node.font = { color: 'white' };
                        node.color.highlight = { background: 'palevioletred', border: 'black' };
                        if (this.duplicatedLabel(node.label, node.shape)) {
                            throw new Error('JSON contains a node formatted incorrectly');
                        }
                    }
                }
                else if (node.shape === 'ellipse') {
                    node.color.background = 'lightskyblue';
                }
                else if (node.shape === 'box') {
                    node.color.background = 'red';
                    node.font = { color: 'white' };
                }
                node.color.border = 'black';
                if (this.duplicatedLabel(node.label, node.shape)) {
                    throw new Error('Duplicated label');
                }
                else {
                    this.newNodesDataSet.add(node);
                }
            }
            for (var _b = 0, _c = importedObject.edges; _b < _c.length; _b++) {
                var edge = _c[_b];
                edge.dashes = true;
                edge.color.color = 'black';
                edge.color.inherit = false;
                edge.label = undefined;
                if (this.newNodesDataSet.get(edge.from).shape === 'ellipse' &&
                    this.newNodesDataSet.get(edge.to).shape !== 'box') {
                    var aux = edge.from;
                    edge.from = edge.to;
                    edge.to = aux;
                }
                else if (this.newNodesDataSet.get(edge.from).shape === 'ellipse') {
                    throw new Error('Edge cannot start from a user');
                }
                else if (this.newNodesDataSet.get(edge.to).shape === 'box') {
                    throw new Error('Edge cannot end at a business');
                }
                else if (this.duplicatedEdge(edge.to, edge.from)) {
                    throw new Error('Duplicated edge');
                }
                else {
                    this.newEdgesDataSet.add(edge);
                }
            }
            var responseObject = {
                importState: this.importState,
                nodesDataSet: this.newNodesDataSet,
                edgesDataSet: this.newEdgesDataSet
            };
            this.dialogRef.close(responseObject);
        }
        catch (e) {
            console.log(e);
            this.importError = true;
        }
    };
    ImportExportDialogComponent.prototype.duplicatedLabel = function (label, shape) {
        var nodes = this.newNodesDataSet.get();
        return nodes.findIndex(function (node) { return node.label === label && node.shape === shape; }) > -1;
    };
    ImportExportDialogComponent.prototype.duplicatedEdge = function (to, from) {
        var nodes = this.newEdgesDataSet.get();
        return nodes.findIndex(function (edge) { return edge.to === to && edge.from === from; }) > -1 ||
            nodes.findIndex(function (edge) { return edge.to === from && edge.from === to; }) > -1;
    };
    ImportExportDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-import-export-dialog',
            templateUrl: './import-export-dialog.component.html',
            styleUrls: ['./import-export-dialog.component.scss']
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ImportExportDialogComponent);
    return ImportExportDialogComponent;
}());
exports.ImportExportDialogComponent = ImportExportDialogComponent;
