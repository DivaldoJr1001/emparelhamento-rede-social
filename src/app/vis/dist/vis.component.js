"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VisComponent = void 0;
var core_1 = require("@angular/core");
var function_dialog_component_1 = require("../dialogs/function-dialog/function-dialog.component");
var import_export_dialog_component_1 = require("../dialogs/import-export-dialog/import-export-dialog.component");
var VisComponent = /** @class */ (function () {
    function VisComponent(dialog) {
        this.dialog = dialog;
        this.nodesDataSet = new vis.DataSet();
        this.edgesDataSet = new vis.DataSet();
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
        var options = {};
        this.network = new vis.Network(this.networkContainer.nativeElement, data, options);
    };
    VisComponent.prototype.openImportExportDialog = function (importState) {
        var importExportSettings = {
            importState: importState,
            nodesDataSet: this.nodesDataSet,
            edgesDataSet: this.edgesDataSet
        };
        this.dialog.open(import_export_dialog_component_1.ImportExportDialogComponent, {
            data: importExportSettings
        });
    };
    VisComponent.prototype.openFunctionDialog = function (functionTarget) {
        this.functionSettings.functionTarget = functionTarget;
        this.dialog.open(function_dialog_component_1.FunctionDialogComponent, {
            data: this.functionSettings
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
