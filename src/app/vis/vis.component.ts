import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FunctionDialogComponent } from '../dialogs/function-dialog/function-dialog.component';
import { ImportExportDialogComponent } from '../dialogs/import-export-dialog/import-export-dialog.component';
import { Node } from '../models/node';
import { FunctionSettings } from '../models/function-settings';
import { ImportExportSettings } from '../models/import-export-settings';
import { Edge } from '../models/edge';
import { runHopcroftKarp } from '../utils/hopcroft–karp.util';
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

  algorithmRunning = false;
  algorithmFinished = false;

  functionSettings: FunctionSettings = {
    createMode: true,
    functionTarget: '',
    nodesDataSet: this.nodesDataSet,
    edgesDataSet: this.edgesDataSet
  };

  constructor(
    public dialog: MatDialog,
    public cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.draw();
  }

  draw() {
    const data = {
      nodes: this.nodesDataSet,
      edges: this.edgesDataSet,
    };

    this.functionSettings = {
      createMode: true,
      functionTarget: '',
      nodesDataSet: this.nodesDataSet,
      edgesDataSet: this.edgesDataSet
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

    const dialogRef = this.dialog.open(ImportExportDialogComponent, {
      data: importExportSettings
    });

    dialogRef.afterClosed().subscribe((response: ImportExportSettings) => {
      if (response) {
        this.nodesDataSet = response.nodesDataSet;
        this.edgesDataSet = response.edgesDataSet;
        this.draw();
        this.cdr.detectChanges();
      }
    });
  }

  openFunctionDialog(functionTarget: string) {
    this.functionSettings.functionTarget = functionTarget;

    const dialogRef = this.dialog.open(FunctionDialogComponent, {
      data: this.functionSettings
    });

    dialogRef.afterClosed().subscribe(_ => {
      this.cdr.detectChanges();
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

  canRunAlgorithm(): boolean {
    return this.nodesDataSet.get().length > 0 && this.edgesDataSet.get().length > 0;
  }

  async runAlgorithm(): Promise<void> {
    this.algorithmRunning = true;
    await runHopcroftKarp({
      nodesDataSet: this.nodesDataSet,
      edgesDataSet: this.edgesDataSet
    });
    this.algorithmRunning = false;
    this.algorithmFinished = true;
    this.cdr.detectChanges();
  }

  resetAlgorithm(): void {
    const allNodes: Node[] = this.nodesDataSet.get();
    const allEdges: Edge[] = this.edgesDataSet.get();

    for (const node of allNodes) {
      if (node.shape === 'ellipse') {
        node.color.background = 'lightskyblue';
      } else {
        node.color.background = 'red';
        node.font = { color: 'white' };
      }
      this.nodesDataSet.update(node);
    }

    for (const edge of allEdges) {
      edge.dashes = true;
      edge.color.color = 'black';
      edge.color.inherit = false;
      this.edgesDataSet.update(edge);
    }

    this.algorithmFinished = false;

    this.cdr.detectChanges();
  }
}
