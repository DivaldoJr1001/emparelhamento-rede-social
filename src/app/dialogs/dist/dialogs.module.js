"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DialogsModule = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var material_module_1 = require("../shared/material.module");
var about_dialog_component_1 = require("./about-dialog/about-dialog.component");
var function_dialog_component_1 = require("./function-dialog/function-dialog.component");
var import_export_dialog_component_1 = require("./import-export-dialog/import-export-dialog.component");
var DialogsModule = /** @class */ (function () {
    function DialogsModule() {
    }
    DialogsModule = __decorate([
        core_1.NgModule({
            declarations: [
                about_dialog_component_1.AboutDialogComponent,
                function_dialog_component_1.FunctionDialogComponent,
                import_export_dialog_component_1.ImportExportDialogComponent
            ],
            entryComponents: [
                about_dialog_component_1.AboutDialogComponent,
                function_dialog_component_1.FunctionDialogComponent,
                import_export_dialog_component_1.ImportExportDialogComponent
            ],
            imports: [
                common_1.CommonModule,
                material_module_1.MaterialModule,
                dialog_1.MatDialogModule
            ],
            providers: [
                {
                    provide: dialog_1.MatDialogRef,
                    useValue: {}
                }
            ]
        })
    ], DialogsModule);
    return DialogsModule;
}());
exports.DialogsModule = DialogsModule;
