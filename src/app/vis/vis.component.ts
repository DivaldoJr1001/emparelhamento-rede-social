import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FunctionDialogComponent } from '../dialogs/function-dialog/function-dialog.component';
import { ImportExportDialogComponent } from '../dialogs/import-export-dialog/import-export-dialog.component';
import { Node } from '../models/node';
import { FunctionSettings } from '../models/function-settings';
import { ImportExportSettings } from '../models/import-export-settings';
import { Edge } from '../models/edge';
declare var vis: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.scss']
})
export class VisComponent implements AfterViewInit {
  @ViewChild('networkContainer', { static: false }) networkContainer: ElementRef;

  public network: any;

  nodesDataSet = new vis.DataSet();
  edgesDataSet = new vis.DataSet();

  functionSettings: FunctionSettings = {
    createMode: true,
    functionTarget: '',
    nodesDataSet: this.nodesDataSet,
    edgesDataSet: this.edgesDataSet
  };

  constructor(public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.draw();
  }

  draw() {
    const data = {
      nodes: this.nodesDataSet,
      edges: this.edgesDataSet,
    };

    const options = {};

    this.network = new vis.Network(this.networkContainer.nativeElement, data, options);
  }

  openImportExportDialog(importState: boolean) {
    const importExportSettings: ImportExportSettings = {
      importState,
      nodesDataSet: this.nodesDataSet,
      edgesDataSet: this.edgesDataSet
    };

    this.dialog.open(ImportExportDialogComponent, {
      data: importExportSettings
    });
  }

  openFunctionDialog(functionTarget: string) {
    this.functionSettings.functionTarget = functionTarget;

    this.dialog.open(FunctionDialogComponent, {
      data: this.functionSettings
    });
  }

  hasUsuario(): boolean {
    const nodes: Node[] = this.nodesDataSet.get();
    return nodes.findIndex(node => node.shape === 'ellipse') > -1;
  }

  hasEmpresa(): boolean {
    const nodes: Node[] = this.nodesDataSet.get();
    return nodes.findIndex(node => node.shape === 'box') > -1;
  }

  hasConexao(): boolean {
    const edges: Edge[] = this.edgesDataSet.get();
    return edges.length > 0;
  }

  menuConexaoDisabled(): boolean {
    return !this.functionSettings.createMode && !this.hasConexao() || !this.hasUsuario() || !this.hasEmpresa();
  }
}
