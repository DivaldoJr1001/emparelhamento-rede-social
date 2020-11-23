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
exports.FunctionDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var dialog_1 = require("@angular/material/dialog");
var FunctionDialogComponent = /** @class */ (function () {
    function FunctionDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.nodeLabel = new forms_1.FormControl('');
        this.nodesArray = [];
        this.usuariosArray = [];
        this.empresasArray = [];
        this.edgeArray = [];
        this.usuarioSelecionado = new forms_1.FormControl(undefined);
        this.empresaSelecionada = new forms_1.FormControl(undefined);
        this.objetoRemocaoControl = new forms_1.FormControl(undefined);
        this.edgeCreationError = false;
    }
    FunctionDialogComponent.prototype.ngOnInit = function () {
        if (this.data.functionTarget === 'Usuário') {
            this.usuariosArray = this.data.nodesDataSet.get().filter(function (node) { return node.shape === 'ellipse'; });
        }
        else if (this.data.functionTarget === 'Empresa') {
            this.empresasArray = this.data.nodesDataSet.get().filter(function (node) { return node.shape === 'box'; });
        }
        else {
            this.usuariosArray = this.data.nodesDataSet.get().filter(function (node) { return node.shape === 'ellipse'; });
            this.empresasArray = this.data.nodesDataSet.get().filter(function (node) { return node.shape === 'box'; });
            this.edgeArray = this.data.edgesDataSet.get();
        }
    };
    FunctionDialogComponent.prototype.toLowerCaseFunction = function (s) {
        return s.toLowerCase();
    };
    FunctionDialogComponent.prototype.edgeName = function (edge) {
        return this.data.nodesDataSet.get(edge.from).label + ' - ' + this.data.nodesDataSet.get(edge.to).label;
    };
    FunctionDialogComponent.prototype.executeFunction = function () {
        try {
            this.edgeCreationError = false;
            if (this.data.createMode) {
                if (this.data.functionTarget !== 'Conexão') {
                    var ids = this.data.nodesDataSet.getIds();
                    var id = parseInt(ids.pop() + '', 10) + 1;
                    var label = this.nodeLabel.value;
                    var newNode = {
                        id: id,
                        label: label
                    };
                    if (this.data.functionTarget === 'Usuário') {
                        newNode.shape = 'ellipse';
                        newNode.color = {
                            background: 'lightskyblue',
                            border: 'black'
                        };
                    }
                    else if (this.data.functionTarget === 'Empresa') {
                        newNode.shape = 'box';
                        newNode.font = { color: 'white' };
                        newNode.color = {
                            background: 'red',
                            border: 'black',
                            highlight: {
                                background: 'palevioletred',
                                border: 'black'
                            }
                        };
                    }
                    this.data.nodesDataSet.add(newNode);
                }
                else {
                    var ids = this.data.edgesDataSet.getIds();
                    var id = parseInt(ids.pop() + '', 10) + 1;
                    var newEdge_1 = {
                        id: id,
                        from: this.empresaSelecionada.value.id,
                        to: this.usuarioSelecionado.value.id,
                        color: {
                            color: 'black',
                            inherit: false
                        },
                        dashes: true
                    };
                    if (this.edgeArray.findIndex(function (edge) { return edge.to === newEdge_1.to && edge.from === newEdge_1.from; }) < 0) {
                        this.data.edgesDataSet.add(newEdge_1);
                    }
                    else {
                        throw new Error();
                    }
                }
            }
            else {
                var selecao = this.objetoRemocaoControl.value;
                if (this.data.functionTarget !== 'Conexão') {
                    var id_1 = selecao.id;
                    var edgesToRemove = this.data.edgesDataSet.get().filter(function (edge) { return edge.to === id_1 || edge.from === id_1; });
                    this.data.edgesDataSet.remove(edgesToRemove);
                    this.data.nodesDataSet.remove(selecao);
                }
                else {
                    this.data.edgesDataSet.remove(selecao);
                }
            }
            this.dialogRef.close();
        }
        catch (e) {
            console.log(e);
            this.edgeCreationError = true;
        }
    };
    FunctionDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-function-dialog',
            templateUrl: './function-dialog.component.html',
            styleUrls: ['./function-dialog.component.scss']
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], FunctionDialogComponent);
    return FunctionDialogComponent;
}());
exports.FunctionDialogComponent = FunctionDialogComponent;
